import React from 'react';
import { MoreVertical } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const SalesActivityCard = ({ data }) => {
  return (
    <div className="bg-white rounded-card p-6 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Sales Activity</h3>
        <div className="flex items-center space-x-3">
          <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Daily</option>
          </select>
          <button className="p-1 hover:bg-gray-100 rounded-full">
            <MoreVertical size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Chart and Legend */}
      <div className="flex items-center justify-between">
        {/* Donut Chart */}
        <div className="relative flex-shrink-0">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={data.segments}
                cx={100}
                cy={100}
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {data.segments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-gray-900">
              {(data.totalSellCount / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-gray-600">Total sell count</div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-4 flex-1 ml-8">
          {data.segments.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesActivityCard;
