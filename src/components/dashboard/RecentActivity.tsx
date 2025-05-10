import React from 'react';
import { 
  Package, 
  TruckIcon, 
  AlertCircle, 
  ShoppingCart,
  ReceiptText
} from 'lucide-react';

const RecentActivity: React.FC = () => {
  // Sample data for recent activities
  const activities = [
    { 
      id: 1, 
      type: 'order', 
      description: 'New order #12345 received', 
      time: '5 minutes ago',
      icon: <ShoppingCart size={16} className="text-blue-600" />,
    },
    { 
      id: 2, 
      type: 'shipping', 
      description: 'Order #12342 shipped via FedEx', 
      time: '2 hours ago',
      icon: <TruckIcon size={16} className="text-emerald-600" />,
    },
    { 
      id: 3, 
      type: 'alert', 
      description: 'Low stock alert for SKU: ELEC-2022', 
      time: '3 hours ago',
      icon: <AlertCircle size={16} className="text-amber-600" />,
    },
    { 
      id: 4, 
      type: 'return', 
      description: 'Return request #5566 processed', 
      time: '5 hours ago',
      icon: <Package size={16} className="text-red-600" />,
    },
    { 
      id: 5, 
      type: 'invoice', 
      description: 'Invoice #INV-2023-056 generated', 
      time: '8 hours ago',
      icon: <ReceiptText size={16} className="text-purple-600" />,
    },
  ];

  return (
    <div className="divide-y divide-gray-100">
      {activities.map((activity) => (
        <div key={activity.id} className="py-3 flex items-start">
          <div className="bg-gray-50 p-2 rounded-lg mr-3">
            {activity.icon}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-800 font-medium">{activity.description}</p>
            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
          </div>
          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            View
          </button>
        </div>
      ))}
      
      <div className="pt-3 text-center">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;