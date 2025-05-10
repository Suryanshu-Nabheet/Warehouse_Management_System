import React from 'react';

const SalesChart: React.FC = () => {
  return (
    <div className="relative h-64">
      {/* This is a placeholder for the chart. In a real app, you would use a library like Chart.js, Recharts, or ApexCharts */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-full w-full items-end justify-between px-2">
          {/* Sample bars for the chart */}
          {[65, 45, 75, 55, 85, 35, 60].map((height, index) => (
            <div 
              key={index} 
              className="relative group"
              style={{ width: '12%' }}
            >
              <div 
                className="absolute bottom-0 w-full bg-blue-500 opacity-20 rounded-t-md transition-all duration-300 group-hover:opacity-30"
                style={{ height: `${height}%` }}
              ></div>
              <div 
                className="absolute bottom-0 w-full bg-blue-600 rounded-t-md transition-all duration-500 group-hover:bg-blue-700"
                style={{ height: `${height * 0.8}%` }}
              ></div>
              <div className="absolute -bottom-6 w-full text-center text-xs text-gray-500">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
              </div>
              
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                ${Math.floor(height * 10 + 200)}
              </div>
            </div>
          ))}
        </div>

        {/* Y-axis labels */}
        <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-xs text-gray-400 py-2">
          <span>$1000</span>
          <span>$750</span>
          <span>$500</span>
          <span>$250</span>
          <span>$0</span>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;