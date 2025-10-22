import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, ShoppingCart, ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    // Fetch analytics data
    fetch('http://localhost:5000/api/sales/report')
      .then(res => res.json())
      .then(data => setAnalyticsData(data))
      .catch(err => console.error('Error fetching analytics:', err));
  }, []);

  const kpis = [
    { label: 'Total Revenue', value: '£9.7M', change: '+12.5%', icon: DollarSign, color: 'blue', trend: 'up' },
    { label: 'Total Orders', value: '22,190', change: '+8.2%', icon: ShoppingCart, color: 'green', trend: 'up' },
    { label: 'Customers', value: '4,372', change: '-2.3%', icon: Users, color: 'purple', trend: 'down' },
    { label: 'Avg Order Value', value: '£437', change: '+5.1%', icon: TrendingUp, color: 'orange', trend: 'up' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Comprehensive business insights and trends</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${kpi.color}-100 dark:bg-${kpi.color}-900/30 rounded-lg flex items-center justify-center`}>
                <kpi.icon className={`text-${kpi.color}-600`} size={24} />
              </div>
              <span className={`flex items-center text-sm font-semibold ${
                kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {kpi.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                {kpi.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{kpi.value}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData?.series || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="period" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Month */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Orders by Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData?.series || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="period" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
              <Legend />
              <Bar dataKey="orders" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
