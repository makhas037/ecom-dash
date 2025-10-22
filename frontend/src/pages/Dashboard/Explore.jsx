import React from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';

const Explore = () => {
  const items = [
    { id: 1, title: 'Sales Analysis Report', category: 'Reports', date: 'Jan 15, 2025' },
    { id: 2, title: 'Customer Segmentation', category: 'Analytics', date: 'Jan 14, 2025' },
    { id: 3, title: 'Product Performance', category: 'Reports', date: 'Jan 13, 2025' },
    { id: 4, title: 'Churn Prediction Model', category: 'ML Models', date: 'Jan 12, 2025' },
  ];

  return (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Explore</h1>
            <p className="text-gray-600 dark:text-gray-400">Discover insights and reports</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              <Grid size={20} className="text-gray-700 dark:text-gray-300" />
            </button>
            <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
              <List size={20} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <Filter size={20} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4"></div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{item.category}</span>
              <span>{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
