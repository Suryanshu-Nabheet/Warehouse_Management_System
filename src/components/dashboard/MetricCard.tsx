import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

type ColorType = 'blue' | 'emerald' | 'amber' | 'red';
type TrendType = 'up' | 'down';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: TrendType;
  color: ColorType;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  trend, 
  color 
}) => {
  const getColorClasses = (color: ColorType) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 border-blue-100';
      case 'emerald':
        return 'bg-emerald-50 border-emerald-100';
      case 'amber':
        return 'bg-amber-50 border-amber-100';
      case 'red':
        return 'bg-red-50 border-red-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  const getTrendClasses = (trend: TrendType) => {
    return trend === 'up' 
      ? 'text-emerald-600 bg-emerald-50' 
      : 'text-red-600 bg-red-50';
  };

  return (
    <div className={`rounded-xl shadow-sm p-5 border ${getColorClasses(color)} transition-transform hover:shadow-md hover:-translate-y-1 duration-300`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
        <div className="rounded-full p-2 bg-white shadow-sm">
          {icon}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        <span className={`text-xs font-medium py-0.5 px-1.5 rounded ${getTrendClasses(trend)} flex items-center`}>
          {trend === 'up' ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
          {change}
        </span>
        <span className="text-xs text-gray-500">from last period</span>
      </div>
    </div>
  );
};

export default MetricCard;