import React from 'react';

const ProductDistribution: React.FC = () => {
  // Sample data for the pie chart
  const segments = [
    { name: 'Electronics', percentage: 35, color: 'bg-blue-500' },
    { name: 'Clothing', percentage: 25, color: 'bg-emerald-500' },
    { name: 'Home Goods', percentage: 20, color: 'bg-amber-500' },
    { name: 'Accessories', percentage: 15, color: 'bg-purple-500' },
    { name: 'Other', percentage: 5, color: 'bg-gray-500' },
  ];

  return (
    <div className="flex flex-col">
      {/* This is a placeholder for the pie chart */}
      <div className="relative mx-auto w-36 h-36 mt-2 mb-6">
        <svg viewBox="0 0 36 36" className="w-full h-full">
          <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" 
                  stroke="#f3f4f6" strokeWidth="3" strokeDasharray="100" strokeDashoffset="0"></circle>
          
          {segments.map((segment, index) => {
            // Calculate the position of each segment in the circle
            const prevSegments = segments.slice(0, index);
            const offset = prevSegments.reduce((acc, curr) => acc + curr.percentage, 0);
            
            return (
              <circle 
                key={segment.name}
                cx="18" 
                cy="18" 
                r="15.91549430918954" 
                fill="transparent" 
                stroke={segment.color.replace('bg-', '')} 
                strokeWidth="3" 
                strokeDasharray={`${segment.percentage} ${100 - segment.percentage}`}
                strokeDashoffset={`${-offset}`}
                className={segment.color}
                style={{ strokeDashoffset: `${-offset}`, transition: 'all 0.5s ease-out' }}
              ></circle>
            );
          })}
          <text x="18" y="18" fontFamily="Verdana" fontSize="3" textAnchor="middle" alignmentBaseline="middle">
            Product Categories
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="space-y-2 mt-4">
        {segments.map((segment) => (
          <div key={segment.name} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${segment.color} mr-2`}></div>
              <span className="text-sm text-gray-600">{segment.name}</span>
            </div>
            <span className="text-sm font-medium">{segment.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDistribution;