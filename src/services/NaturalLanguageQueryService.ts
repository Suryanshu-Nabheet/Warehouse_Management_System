export class NaturalLanguageQueryService {
  private keywords: Map<string, string> = new Map();
  private templates: Map<string, string> = new Map();
  
  constructor() {
    this.initializeKeywords();
    this.initializeTemplates();
  }
  
  /**
   * Initialize common query keywords
   */
  private initializeKeywords(): void {
    // Time periods
    this.keywords.set('today', 'CURRENT_DATE');
    this.keywords.set('yesterday', 'CURRENT_DATE - INTERVAL \'1 day\'');
    this.keywords.set('this week', 'DATE_TRUNC(\'week\', CURRENT_DATE)');
    this.keywords.set('last week', 'DATE_TRUNC(\'week\', CURRENT_DATE - INTERVAL \'7 days\')');
    this.keywords.set('this month', 'DATE_TRUNC(\'month\', CURRENT_DATE)');
    this.keywords.set('last month', 'DATE_TRUNC(\'month\', CURRENT_DATE - INTERVAL \'1 month\')');
    
    // Aggregations
    this.keywords.set('count', 'COUNT');
    this.keywords.set('total', 'SUM');
    this.keywords.set('average', 'AVG');
    this.keywords.set('minimum', 'MIN');
    this.keywords.set('maximum', 'MAX');
    
    // Entities
    this.keywords.set('products', 'products');
    this.keywords.set('orders', 'orders');
    this.keywords.set('sales', 'sales');
    this.keywords.set('customers', 'customers');
    this.keywords.set('inventory', 'inventory');
    this.keywords.set('returns', 'returns');
  }
  
  /**
   * Initialize query templates
   */
  private initializeTemplates(): void {
    // Product queries
    this.templates.set('top selling products', 
      'SELECT p.product_name, SUM(s.quantity) as total_sold ' +
      'FROM sales s ' +
      'JOIN products p ON s.product_id = p.product_id ' +
      'WHERE s.sale_date >= {{time_period}} ' +
      'GROUP BY p.product_name ' +
      'ORDER BY total_sold DESC ' +
      'LIMIT 10'
    );
    
    // Inventory queries
    this.templates.set('low stock products', 
      'SELECT p.product_name, i.stock_level ' +
      'FROM inventory i ' +
      'JOIN products p ON i.product_id = p.product_id ' +
      'WHERE i.stock_level < 10 ' +
      'ORDER BY i.stock_level ASC'
    );
    
    // Sales queries
    this.templates.set('monthly sales trend', 
      'SELECT DATE_TRUNC(\'month\', s.sale_date) as month, SUM(s.total_amount) as revenue ' +
      'FROM sales s ' +
      'GROUP BY month ' +
      'ORDER BY month'
    );
    
    // Returns queries
    this.templates.set('return rate by product', 
      'SELECT p.product_name, ' +
      'COUNT(r.return_id) as returns, ' +
      'COUNT(s.sale_id) as sales, ' +
      'ROUND(COUNT(r.return_id)::numeric / NULLIF(COUNT(s.sale_id), 0) * 100, 2) as return_rate ' +
      'FROM products p ' +
      'LEFT JOIN sales s ON p.product_id = s.product_id ' +
      'LEFT JOIN returns r ON s.sale_id = r.sale_id ' +
      'GROUP BY p.product_name ' +
      'ORDER BY return_rate DESC'
    );
  }
  
  /**
   * Convert natural language query to SQL
   */
  public convertToSql(naturalQuery: string): string {
    const normalizedQuery = naturalQuery.toLowerCase().trim();
    
    // Try to match against templates
    for (const [pattern, template] of this.templates.entries()) {
      if (normalizedQuery.includes(pattern)) {
        let sql = template;
        
        // Replace time period placeholders
        if (sql.includes('{{time_period}}')) {
          let timePeriod = 'CURRENT_DATE - INTERVAL \'30 days\''; // Default to last 30 days
          
          for (const [timeKeyword, timeValue] of this.keywords.entries()) {
            if (normalizedQuery.includes(timeKeyword) && timeKeyword.startsWith('this') || timeKeyword.startsWith('last')) {
              timePeriod = timeValue;
              break;
            }
          }
          
          sql = sql.replace('{{time_period}}', timePeriod);
        }
        
        return sql;
      }
    }
    
    // If no template matches, try to build a query
    return this.buildQueryFromNaturalLanguage(normalizedQuery);
  }
  
  /**
   * Build a SQL query from natural language
   */
  private buildQueryFromNaturalLanguage(query: string): string {
    // This is a very simplified implementation
    // In a real system, this would use NLP techniques or call an LLM API
    
    let table = 'products'; // Default table
    let fields = '*';
    let whereClause = '';
    let orderClause = '';
    let limitClause = '';
    
    // Determine table
    for (const [entity, tableName] of this.keywords.entries()) {
      if (query.includes(entity) && ['products', 'orders', 'sales', 'customers', 'inventory', 'returns'].includes(entity)) {
        table = tableName;
        break;
      }
    }
    
    // Check for aggregations
    if (query.includes('count')) {
      fields = 'COUNT(*) as count';
    } else if (query.includes('total') && table === 'sales') {
      fields = 'SUM(total_amount) as total_sales';
    } else if (query.includes('average') && table === 'sales') {
      fields = 'AVG(total_amount) as average_sale';
    }
    
    // Check for filters
    if (query.includes('this month')) {
      whereClause = `WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)`;
    } else if (query.includes('last month')) {
      whereClause = `WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')`;
    }
    
    // Check for sorting
    if (query.includes('highest') || query.includes('most')) {
      if (table === 'sales') {
        orderClause = 'ORDER BY total_amount DESC';
      } else if (table === 'products') {
        orderClause = 'ORDER BY price DESC';
      }
    } else if (query.includes('lowest') || query.includes('least')) {
      if (table === 'sales') {
        orderClause = 'ORDER BY total_amount ASC';
      } else if (table === 'products') {
        orderClause = 'ORDER BY price ASC';
      }
    }
    
    // Check for limits
    if (query.includes('top 5')) {
      limitClause = 'LIMIT 5';
    } else if (query.includes('top 10')) {
      limitClause = 'LIMIT 10';
    }
    
    return `SELECT ${fields} FROM ${table} ${whereClause} ${orderClause} ${limitClause}`.trim();
  }
  
  /**
   * Get suggested queries
   */
  public getSuggestedQueries(): string[] {
    return [
      'Show me top selling products this month',
      'List products with less than 10 items in stock',
      'What\'s our monthly revenue trend?',
      'Which marketplace has the highest sales volume?',
      'Show return rate by product category',
      'Compare this month\'s sales with last month'
    ];
  }
}