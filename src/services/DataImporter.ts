export interface ImportConfig {
  encoding: string;
  delimiter: string;
  hasHeaderRow: boolean;
  trimWhitespace: boolean;
  skipEmptyRows: boolean;
  validateSku: boolean;
  autoMatchSku: boolean;
}

export interface ImportResult {
  success: boolean;
  totalRows: number;
  processedRows: number;
  skippedRows: number;
  errors: ImportError[];
  data: any[];
}

export interface ImportError {
  row: number;
  message: string;
  data?: any;
}

export class DataImporter {
  private config: ImportConfig;
  
  constructor(config?: Partial<ImportConfig>) {
    this.config = {
      encoding: 'utf-8',
      delimiter: ',',
      hasHeaderRow: true,
      trimWhitespace: true,
      skipEmptyRows: true,
      validateSku: true,
      autoMatchSku: true,
      ...config
    };
  }

  /**
   * Updates the importer configuration
   */
  public updateConfig(config: Partial<ImportConfig>): void {
    this.config = {
      ...this.config,
      ...config
    };
  }

  /**
   * Processes a CSV file
   */
  public async processCsvFile(file: File): Promise<ImportResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const result = this.parseCsv(content);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsText(file, this.config.encoding);
    });
  }

  /**
   * Parses CSV content
   */
  private parseCsv(content: string): ImportResult {
    const lines = content.split('\n');
    let headers: string[] = [];
    const data: any[] = [];
    const errors: ImportError[] = [];
    let skippedRows = 0;
    
    // Process header row if needed
    let startRow = 0;
    if (this.config.hasHeaderRow && lines.length > 0) {
      headers = this.parseRow(lines[0]);
      startRow = 1;
    }
    
    // Process data rows
    for (let i = startRow; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty rows if configured
      if (this.config.skipEmptyRows && line === '') {
        skippedRows++;
        continue;
      }
      
      try {
        const row = this.parseRow(line);
        
        // Create object from row data
        const rowData: Record<string, any> = {};
        
        if (this.config.hasHeaderRow) {
          // Map values to headers
          headers.forEach((header, index) => {
            rowData[header] = index < row.length ? row[index] : '';
          });
        } else {
          // Use column indices as keys
          row.forEach((value, index) => {
            rowData[`column${index}`] = value;
          });
        }
        
        // Validate SKU if configured
        if (this.config.validateSku && 'sku' in rowData) {
          if (!this.validateSku(rowData.sku)) {
            errors.push({
              row: i + 1,
              message: 'Invalid SKU format',
              data: rowData
            });
            skippedRows++;
            continue;
          }
        }
        
        data.push(rowData);
      } catch (error) {
        errors.push({
          row: i + 1,
          message: 'Error parsing row: ' + (error as Error).message
        });
        skippedRows++;
      }
    }
    
    return {
      success: errors.length === 0,
      totalRows: lines.length - (this.config.hasHeaderRow ? 1 : 0),
      processedRows: data.length,
      skippedRows,
      errors,
      data
    };
  }

  /**
   * Parses a single CSV row
   */
  private parseRow(line: string): string[] {
    const row: string[] = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = i < line.length - 1 ? line[i + 1] : '';
      
      // Handle quotes
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          currentValue += '"';
          i++; // Skip the next quote
        } else {
          // Toggle quote mode
          inQuotes = !inQuotes;
        }
      }
      // Handle delimiter
      else if (char === this.config.delimiter && !inQuotes) {
        // End of value
        row.push(this.config.trimWhitespace ? currentValue.trim() : currentValue);
        currentValue = '';
      }
      // Any other character
      else {
        currentValue += char;
      }
    }
    
    // Add the last value
    row.push(this.config.trimWhitespace ? currentValue.trim() : currentValue);
    
    return row;
  }

  /**
   * Validates a SKU format
   */
  private validateSku(sku: string): boolean {
    // Simple validation - non-empty and follows pattern
    if (!sku || sku.trim() === '') {
      return false;
    }
    
    // Basic SKU pattern: letters, numbers, dashes, underscores
    const skuPattern = /^[A-Za-z0-9\-_]+$/;
    return skuPattern.test(sku);
  }
  
  /**
   * Processes an Excel file (simulated)
   */
  public async processExcelFile(file: File): Promise<ImportResult> {
    // In a real implementation, you would use a library like SheetJS
    // This is a simplified simulation
    return {
      success: true,
      totalRows: 100,
      processedRows: 98,
      skippedRows: 2,
      errors: [
        { row: 15, message: 'Invalid SKU format' },
        { row: 67, message: 'Missing required field' }
      ],
      data: []
    };
  }
  
  /**
   * Processes a JSON file
   */
  public async processJsonFile(file: File): Promise<ImportResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const jsonData = JSON.parse(content);
          
          // Validate JSON structure
          if (!Array.isArray(jsonData)) {
            throw new Error('JSON data must be an array of objects');
          }
          
          const errors: ImportError[] = [];
          let skippedRows = 0;
          
          // Validate each row
          jsonData.forEach((item, index) => {
            if (typeof item !== 'object' || item === null) {
              errors.push({
                row: index + 1,
                message: 'Invalid row format, expected object'
              });
              skippedRows++;
            } else if (this.config.validateSku && 'sku' in item && !this.validateSku(item.sku)) {
              errors.push({
                row: index + 1,
                message: 'Invalid SKU format',
                data: item
              });
              skippedRows++;
            }
          });
          
          resolve({
            success: errors.length === 0,
            totalRows: jsonData.length,
            processedRows: jsonData.length - skippedRows,
            skippedRows,
            errors,
            data: jsonData.filter((_, index) => !errors.some(e => e.row === index + 1))
          });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsText(file, this.config.encoding);
    });
  }
}