import React, { useState } from 'react';
import { Glasses as MagnifyingGlass, Plus, Trash2, Download, Upload, Edit, Check, X } from 'lucide-react';

interface MappingItem {
  id: string;
  sku: string;
  msku: string;
  marketplace: string;
  lastUpdated: string;
}

const SkuMapper: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<MappingItem>>({});

  // Sample data for SKU mappings
  const [mappings, setMappings] = useState<MappingItem[]>([
    { 
      id: '1', 
      sku: 'APPLE-RED', 
      msku: 'FRUIT-001', 
      marketplace: 'Amazon', 
      lastUpdated: '2023-04-15'
    },
    { 
      id: '2', 
      sku: 'BANANA-YLW', 
      msku: 'FRUIT-002', 
      marketplace: 'Walmart', 
      lastUpdated: '2023-04-12'
    },
    { 
      id: '3', 
      sku: 'ORANGE-ORG', 
      msku: 'FRUIT-003', 
      marketplace: 'eBay', 
      lastUpdated: '2023-04-10'
    },
    { 
      id: '4', 
      sku: 'LAPTOP-15', 
      msku: 'ELEC-001', 
      marketplace: 'Amazon', 
      lastUpdated: '2023-04-08'
    },
    { 
      id: '5', 
      sku: 'PHONE-PRO', 
      msku: 'ELEC-002', 
      marketplace: 'Shopify', 
      lastUpdated: '2023-04-05'
    }
  ]);

  const filteredMappings = mappings.filter(mapping => 
    mapping.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.msku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.marketplace.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEditing = (mapping: MappingItem) => {
    setEditingId(mapping.id);
    setEditValues({
      sku: mapping.sku,
      msku: mapping.msku,
      marketplace: mapping.marketplace
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEditing = (id: string) => {
    setMappings(mappings.map(mapping => 
      mapping.id === id ? 
        { 
          ...mapping, 
          ...editValues, 
          lastUpdated: new Date().toISOString().split('T')[0] 
        } : 
        mapping
    ));
    setEditingId(null);
    setEditValues({});
  };

  const deleteMapping = (id: string) => {
    setMappings(mappings.filter(mapping => mapping.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setEditValues({ ...editValues, [field]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">SKU Mapper</h1>
        <div className="flex space-x-3">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <Upload size={16} />
            <span>Import</span>
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <Download size={16} />
            <span>Export</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <Plus size={16} />
            <span>Add Mapping</span>
          </button>
        </div>
      </div>

      {/* Search and filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlass size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by SKU, MSKU, or marketplace..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Mappings Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MSKU
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marketplace
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMappings.map((mapping) => (
                <tr key={mapping.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === mapping.id ? (
                      <input
                        type="text"
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        value={editValues.sku || ''}
                        onChange={(e) => handleInputChange(e, 'sku')}
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">{mapping.sku}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === mapping.id ? (
                      <input
                        type="text"
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        value={editValues.msku || ''}
                        onChange={(e) => handleInputChange(e, 'msku')}
                      />
                    ) : (
                      <div className="text-sm text-gray-900">{mapping.msku}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === mapping.id ? (
                      <input
                        type="text"
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        value={editValues.marketplace || ''}
                        onChange={(e) => handleInputChange(e, 'marketplace')}
                      />
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {mapping.marketplace}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mapping.lastUpdated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingId === mapping.id ? (
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => saveEditing(mapping.id)} className="text-emerald-600 hover:text-emerald-900">
                          <Check size={18} />
                        </button>
                        <button onClick={cancelEditing} className="text-red-600 hover:text-red-900">
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => startEditing(mapping)} className="text-blue-600 hover:text-blue-900">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => deleteMapping(mapping.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredMappings.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500">No mappings found. Try adjusting your search or add a new mapping.</p>
          </div>
        )}
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredMappings.length}</span> of{' '}
                <span className="font-medium">{filteredMappings.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  {/* Heroicon name: solid/chevron-left */}
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button aria-current="page" className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  {/* Heroicon name: solid/chevron-right */}
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkuMapper;