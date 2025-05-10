import { EventEmitter } from 'events';

export interface SKU {
  id: string;
  sku: string;
  msku: string;
  marketplace: string;
  lastUpdated: string;
}

export interface MappingResult {
  success: boolean;
  message?: string;
  data?: any;
}

export class SkuMapper extends EventEmitter {
  private skuMappings: Map<string, string> = new Map();
  private skuDetails: Map<string, SKU> = new Map();
  private marketplaceFormats: Map<string, RegExp> = new Map();
  
  constructor() {
    super();
    this.initMarketplaceFormats();
  }
  
  private initMarketplaceFormats() {
    // Initialize known marketplace SKU formats
    this.marketplaceFormats.set('Amazon', /^[A-Z0-9]{10}$/);
    this.marketplaceFormats.set('Walmart', /^[A-Z]{3}\d{5}$/);
    this.marketplaceFormats.set('eBay', /^[A-Z]+-\d{4}$/);
    this.marketplaceFormats.set('Shopify', /^[A-Z]+-[A-Z0-9]+-\d{2}$/);
  }
  
  /**
   * Adds a SKU to MSKU mapping
   */
  public addMapping(skuObj: SKU): MappingResult {
    // Validate SKU format based on marketplace
    const marketplaceRegex = this.marketplaceFormats.get(skuObj.marketplace);
    
    if (marketplaceRegex && !marketplaceRegex.test(skuObj.sku)) {
      return {
        success: false,
        message: `Invalid SKU format for ${skuObj.marketplace}`
      };
    }
    
    // Check if SKU already exists
    if (this.skuMappings.has(skuObj.sku)) {
      return {
        success: false,
        message: 'SKU already exists'
      };
    }
    
    // Add mapping
    this.skuMappings.set(skuObj.sku, skuObj.msku);
    this.skuDetails.set(skuObj.sku, skuObj);
    
    this.emit('mapping-added', skuObj);
    
    return {
      success: true,
      data: skuObj
    };
  }
  
  /**
   * Updates an existing SKU mapping
   */
  public updateMapping(skuObj: SKU): MappingResult {
    if (!this.skuMappings.has(skuObj.sku)) {
      return {
        success: false,
        message: 'SKU not found'
      };
    }
    
    this.skuMappings.set(skuObj.sku, skuObj.msku);
    this.skuDetails.set(skuObj.sku, {
      ...this.skuDetails.get(skuObj.sku),
      ...skuObj
    });
    
    this.emit('mapping-updated', skuObj);
    
    return {
      success: true,
      data: this.skuDetails.get(skuObj.sku)
    };
  }
  
  /**
   * Removes a SKU mapping
   */
  public removeMapping(sku: string): MappingResult {
    if (!this.skuMappings.has(sku)) {
      return {
        success: false,
        message: 'SKU not found'
      };
    }
    
    const skuObj = this.skuDetails.get(sku);
    this.skuMappings.delete(sku);
    this.skuDetails.delete(sku);
    
    this.emit('mapping-removed', skuObj);
    
    return {
      success: true,
      data: skuObj
    };
  }
  
  /**
   * Gets the MSKU for a given SKU
   */
  public getMsku(sku: string): string | null {
    return this.skuMappings.get(sku) || null;
  }
  
  /**
   * Gets all SKUs mapped to a specific MSKU
   */
  public getSkusForMsku(msku: string): SKU[] {
    const result: SKU[] = [];
    
    this.skuDetails.forEach((skuObj) => {
      if (skuObj.msku === msku) {
        result.push(skuObj);
      }
    });
    
    return result;
  }
  
  /**
   * Searches for SKUs matching a pattern
   */
  public searchSkus(query: string): SKU[] {
    const result: SKU[] = [];
    const lowerQuery = query.toLowerCase();
    
    this.skuDetails.forEach((skuObj) => {
      if (
        skuObj.sku.toLowerCase().includes(lowerQuery) ||
        skuObj.msku.toLowerCase().includes(lowerQuery) ||
        skuObj.marketplace.toLowerCase().includes(lowerQuery)
      ) {
        result.push(skuObj);
      }
    });
    
    return result;
  }
  
  /**
   * Auto-detects SKU format and marketplace
   */
  public detectSkuFormat(sku: string): string | null {
    for (const [marketplace, regex] of this.marketplaceFormats.entries()) {
      if (regex.test(sku)) {
        return marketplace;
      }
    }
    
    return null;
  }
  
  /**
   * Bulk import SKU mappings
   */
  public importMappings(mappings: SKU[]): MappingResult {
    const results = {
      success: true,
      total: mappings.length,
      imported: 0,
      failed: 0,
      errors: [] as string[]
    };
    
    mappings.forEach((mapping) => {
      const result = this.addMapping(mapping);
      
      if (result.success) {
        results.imported++;
      } else {
        results.failed++;
        results.errors.push(`SKU ${mapping.sku}: ${result.message}`);
      }
    });
    
    if (results.failed > 0) {
      results.success = false;
    }
    
    return {
      success: results.success,
      message: `Imported ${results.imported} of ${results.total} mappings`,
      data: results
    };
  }
  
  /**
   * Exports all SKU mappings
   */
  public exportMappings(): SKU[] {
    return Array.from(this.skuDetails.values());
  }
}