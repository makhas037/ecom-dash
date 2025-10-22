import React from 'react';
import { MoreVertical } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const SalesReportAreaCard = ({ data, timeRange, onTimeRangeChange }) => {
  const timeRangeOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Sales Report Area</h3>
          <span className="inline-flex items-center px-2 py-1 bg-purple-50 text-purple-600 text-sm font-medium rounded-md">
            +4.2% vs last years
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data.series} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={60}>
              {data.series.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center mb-6">
        {data.series.map((item, index) => (
          <div key={index} className="text-center">
            <div className="text-xs font-medium text-gray-600 mb-1">{item.label}</div>
            <div className="inline-flex items-center px-2 py-1 bg-gray-50 rounded text-xs font-medium text-gray-700">
              ↗ +{item.changePercent}%
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-600">Target overflow</p>
          <p className="text-sm text-gray-600">by ${data.annotations[0].value} profit</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-gray-900">${data.perUnitSales}</div>
          <p className="text-sm text-gray-600">Per unit sales</p>
        </div>
      </div>
    </div>
  );
};

export default SalesReportAreaCard;
