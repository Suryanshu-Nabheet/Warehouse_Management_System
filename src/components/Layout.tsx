import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Tag, 
  Upload, 
  DatabaseZap, 
  Settings, 
  BarChart3, 
  ChevronRight,
  MenuIcon,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/sku-mapper', name: 'SKU Mapper', icon: <Tag size={20} /> },
    { path: '/data-import', name: 'Data Import', icon: <Upload size={20} /> },
    { path: '/data-explorer', name: 'Data Explorer', icon: <DatabaseZap size={20} /> },
    { path: '/settings', name: 'Settings', icon: <Settings size={20} /> },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 z-20 p-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-white shadow-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <MenuIcon size={20} />
        </button>
      </div>
      
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-30 h-full w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } bg-white border-r border-gray-200 p-4 flex flex-col lg:sticky`}>
        <div className="flex items-center justify-between mb-8 mt-2">
          <div className="flex items-center space-x-2">
            <BarChart3 size={24} className="text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">WMS</h1>
          </div>
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-gray-100 lg:hidden"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-lg group transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className={`mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
                {isActive && <ChevronRight size={16} className="ml-auto text-blue-600" />}
              </Link>
            );
          })}
        </nav>
        
        <div className="pt-4 mt-auto border-t border-gray-200">
          <div className="px-3 py-2">
            <p className="text-xs text-gray-500">WMS v1.0.0</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 lg:p-6 pt-16 lg:pt-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;