import React from 'react';
import { Download, Filter } from 'lucide-react';

const PageHeader = ({ title, subtitle }) => {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200">
            <Download size={16} />
            <span className="text-sm font-medium">Export</span>
          </button>
          <button className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200">
            <Filter size={16} />
            <span className="text-sm font-medium">Filter</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
