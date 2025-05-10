import React, { useState } from 'react';
import { BarChart2, Download, Filter, ChevronDown, PlusCircle, Glasses as MagnifyingGlass, BarChart3, Play } from 'lucide-react';

const DataExplorer: React.FC = () => {
  const [query, setQuery] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Sample query history
  const queryHistory = [
    { id: 1, name: 'Top selling products', query: 'SELECT product_name, SUM(quantity) FROM sales GROUP BY product_name ORDER BY SUM(quantity) DESC LIMIT 10', date: '2023-04-15' },
    { id: 2, name: 'Low stock alert', query: 'SELECT sku, product_name, stock_level FROM inventory WHERE stock_level < 10', date: '2023-04-12' },
    { id: 3, name: 'Monthly sales trend', query: 'SELECT DATE_TRUNC(\'month\', order_date) as month, SUM(total) FROM orders GROUP BY month ORDER BY month', date: '2023-04-10' },
  ];

  const handleRunQuery = () => {
    setShowPreview(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Data Explorer</h1>
        <div className="flex space-x-3">
          <button 
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            onClick={() => setHistoryOpen(!historyOpen)}
          >
            <span>History</span>
            <ChevronDown size={16} />
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <PlusCircle size={16} />
            <span>Save Query</span>
          </button>
          <button 
            className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${!query ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!query}
            onClick={handleRunQuery}
          >
            <Play size={16} />
            <span>Run Query</span>
          </button>
        </div>
      </div>

      {/* Query History Dropdown */}
      {historyOpen && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Recent Queries</h3>
          <div className="space-y-3">
            {queryHistory.map(item => (
              <div 
                key={item.id} 
                className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                onClick={() => {
                  setQuery(item.query);
                  setHistoryOpen(false);
                }}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-700">{item.name}</h4>
                  <span className="text-xs text-gray-500">{item.date}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600 font-mono truncate">{item.query}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Query Editor */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="border-b border-gray-200 px-4 py-3 bg-gray-50 flex justify-between items-center">
          <h3 className="font-medium text-gray-700">Query Editor</h3>
          <div>
            <select className="text-sm border border-gray-300 rounded-md shadow-sm p-1 focus:ring-blue-500 focus:border-blue-500">
              <option value="sql">SQL</option>
              <option value="natural">Natural Language</option>
            </select>
          </div>
        </div>
        <div className="p-4">
          <textarea
            className="w-full h-32 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono text-gray-700 p-3"
            placeholder="SELECT * FROM sales WHERE date > '2023-01-01' ORDER BY date DESC"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          ></textarea>
          <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
            <div>
              <span>Use SELECT statements to query data or try using natural language</span>
            </div>
            <div>
              <button className="text-blue-600 hover:text-blue-800">
                Format Query
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Natural Language Query Examples */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h3 className="font-medium text-gray-700 mb-3">Try with Natural Language</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            "Show me top selling products this month",
            "List products with less than 10 items in stock",
            "What's our monthly revenue trend?",
            "Which marketplace has the highest sales volume?",
            "Show return rate by product category",
            "Compare this month's sales with last month"
          ].map((example, index) => (
            <div 
              key={index}
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => setQuery(example)}
            >
              <div className="flex items-center">
                <MagnifyingGlass size={14} className="text-blue-600 mr-2" />
                <span className="text-sm text-gray-700">{example}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Query Results */}
      {showPreview && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="border-b border-gray-200 px-4 py-3 bg-gray-50 flex justify-between items-center">
            <h3 className="font-medium text-gray-700">Query Results</h3>
            <div className="flex space-x-3">
              <button className="text-gray-600 hover:text-gray-800 flex items-center gap-1 text-sm">
                <Filter size={14} />
                <span>Filter</span>
              </button>
              <button className="text-gray-600 hover:text-gray-800 flex items-center gap-1 text-sm">
                <BarChart3 size={14} />
                <span>Visualize</span>
              </button>
              <button className="text-gray-600 hover:text-gray-800 flex items-center gap-1 text-sm">
                <Download size={14} />
                <span>Export</span>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity Sold
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { product: 'Premium Headphones', sku: 'ELEC-001', category: 'Electronics', quantity: 128, revenue: '$9,600.00' },
                  { product: 'Wireless Mouse', sku: 'ELEC-002', category: 'Electronics', quantity: 85, revenue: '$2,550.00' },
                  { product: 'Ergonomic Keyboard', sku: 'ELEC-003', category: 'Electronics', quantity: 76, revenue: '$4,560.00' },
                  { product: 'Ultra HD Monitor', sku: 'ELEC-004', category: 'Electronics', quantity: 42, revenue: '$12,600.00' },
                  { product: 'Bluetooth Speaker', sku: 'ELEC-005', category: 'Electronics', quantity: 96, revenue: '$3,840.00' },
                ].map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.revenue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Data Visualization */}
          <div className="p-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
              <BarChart2 size={18} className="text-blue-600" />
              Data Visualization
            </h4>
            
            <div className="h-64 relative">
              {/* Placeholder for chart */}
              <div className="absolute inset-0 flex items-end justify-between px-2">
                {[128, 85, 76, 42, 96].map((height, index) => {
                  const maxHeight = Math.max(128, 85, 76, 42, 96);
                  const percentage = (height / maxHeight) * 100;
                  
                  return (
                    <div 
                      key={index} 
                      className="relative group"
                      style={{ width: '18%' }}
                    >
                      <div 
                        className="absolute bottom-0 w-full bg-blue-500 opacity-20 rounded-t-md transition-all duration-300 group-hover:opacity-30"
                        style={{ height: `${percentage}%` }}
                      ></div>
                      <div 
                        className="absolute bottom-0 w-full bg-blue-600 rounded-t-md transition-all duration-500 group-hover:bg-blue-700"
                        style={{ height: `${percentage * 0.8}%` }}
                      ></div>
                      <div className="absolute -bottom-6 w-full text-center text-xs text-gray-500">
                        {['Headphones', 'Mouse', 'Keyboard', 'Monitor', 'Speaker'][index]}
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                        {height} units - ${['9,600', '2,550', '4,560', '12,600', '3,840'][index]}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Y-axis labels */}
              <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-xs text-gray-400 py-2">
                <span>140</span>
                <span>105</span>
                <span>70</span>
                <span>35</span>
                <span>0</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataExplorer;