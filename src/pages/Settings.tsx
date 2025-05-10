import React, { useState } from 'react';
import { Database, Shield, Bell, User, Globe } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('database');
  
  const tabs = [
    { id: 'database', label: 'Database', icon: <Database size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'account', label: 'Account', icon: <User size={18} /> },
    { id: 'integration', label: 'Integrations', icon: <Globe size={18} /> },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'database' && (
            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Database Connection</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Database Type
                    </label>
                    <select className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>PostgreSQL</option>
                      <option>MySQL</option>
                      <option>SQLite</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Connection URL
                    </label>
                    <input 
                      type="text" 
                      className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="postgres://username:password@localhost:5432/database"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                    Test Connection
                  </button>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Data Sync Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sync Frequency
                    </label>
                    <select className="block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Every 15 minutes</option>
                      <option>Every 30 minutes</option>
                      <option>Every hour</option>
                      <option>Every 6 hours</option>
                      <option>Daily</option>
                      <option>Manual only</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="auto-sync" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="auto-sync" className="ml-2 block text-sm text-gray-700">
                      Enable automatic data synchronization
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="conflict-resolve" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="conflict-resolve" className="ml-2 block text-sm text-gray-700">
                      Automatically resolve conflicts (newest wins)
                    </label>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Database Schema</h3>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="mb-3 flex justify-between items-center">
                    <h4 className="font-medium text-gray-700">Tables</h4>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Refresh Schema
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {['products', 'inventory', 'sales', 'customers', 'orders', 'returns'].map((table, index) => (
                      <div key={index} className="flex justify-between items-center p-2 hover:bg-white rounded">
                        <span className="text-sm font-mono text-gray-700">{table}</span>
                        <div className="flex space-x-2">
                          <button className="text-xs text-blue-600 hover:text-blue-800">View</button>
                          <button className="text-xs text-gray-600 hover:text-gray-800">Manage</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors border border-gray-300">
                  Reset
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="p-4 text-center">
              <Shield size={48} className="mx-auto text-blue-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-800">Security Settings</h3>
              <p className="text-gray-500 mt-2">Security settings would appear here</p>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="p-4 text-center">
              <Bell size={48} className="mx-auto text-blue-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-800">Notification Settings</h3>
              <p className="text-gray-500 mt-2">Notification settings would appear here</p>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="p-4 text-center">
              <User size={48} className="mx-auto text-blue-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-800">Account Settings</h3>
              <p className="text-gray-500 mt-2">Account settings would appear here</p>
            </div>
          )}

          {activeTab === 'integration' && (
            <div className="p-4 text-center">
              <Globe size={48} className="mx-auto text-blue-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-800">Integration Settings</h3>
              <p className="text-gray-500 mt-2">Integration settings would appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;