import React from 'react';
import { BarChart, PieChart, CircleDollarSign, Package, AlertTriangle, Truck } from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import SalesChart from '../components/dashboard/SalesChart';
import ProductDistribution from '../components/dashboard/ProductDistribution';
import RecentActivity from '../components/dashboard/RecentActivity';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
          <Truck size={16} />
          <span>Generate Report</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Sales" 
          value="$24,389.45" 
          change="+12.5%" 
          icon={<CircleDollarSign className="text-emerald-600" />} 
          trend="up"
          color="emerald"
        />
        <MetricCard 
          title="Products" 
          value="1,284" 
          change="+3.2%" 
          icon={<Package className="text-blue-600" />} 
          trend="up"
          color="blue"
        />
        <MetricCard 
          title="Low Stock" 
          value="28" 
          change="+15.4%" 
          icon={<AlertTriangle className="text-amber-600" />} 
          trend="up"
          color="amber"
        />
        <MetricCard 
          title="Returns" 
          value="32" 
          change="-2.3%" 
          icon={<Package className="text-red-600" />} 
          trend="down"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <BarChart size={20} className="text-blue-600" />
              Sales Overview
            </h2>
            <select className="bg-gray-50 border border-gray-200 text-gray-700 py-1 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="yearly">This Year</option>
            </select>
          </div>
          <SalesChart />
        </div>

        {/* Product Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <PieChart size={20} className="text-blue-600" />
              Product Distribution
            </h2>
          </div>
          <ProductDistribution />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 className="font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <RecentActivity />
      </div>
    </div>
  );
};

export default Dashboard;