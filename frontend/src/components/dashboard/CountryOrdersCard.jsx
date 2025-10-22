import React from 'react';
import { MoreVertical } from 'lucide-react';

const CountryOrdersCard = ({ data }) => {
  return (
    <div className="bg-white rounded-card p-6 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Most Order by Country</h3>
        <button className="p-1 hover:bg-gray-100 rounded-full">
          <MoreVertical size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Total Value */}
      <div className="mb-6">
        <div className="text-4xl font-bold text-primary mb-1">
          ${data.totalTransactions}
        </div>
        <p className="text-sm text-gray-600">International Transaction</p>
      </div>

      {/* Map Placeholder */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl h-24 mb-6 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            {/* Simplified world map shapes */}
            <path d="M50,80 Q80,60 120,80 T200,90 L220,110 Q180,130 140,120 Q100,110 80,90 Z" fill="#6D5AFE" />
            <path d="M240,70 Q270,50 310,70 L330,90 Q300,110 270,100 Q250,90 240,70 Z" fill="#27D3C7" />
            <path d="M80,140 Q110,120 150,140 L170,160 Q140,180 110,170 Q90,160 80,140 Z" fill="#FFD166" />
          </svg>
        </div>
        <p className="text-gray-400 text-sm font-medium z-10">World Map Visualization</p>
      </div>

      {/* Country List */}
      <div className="space-y-3">
        {data.countries.map((country, index) => (
          <div 
            key={country.code} 
            className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">{country.flag}</span>
              <span className="text-sm font-medium text-gray-900">{country.name}</span>
            </div>
            <span className="text-sm font-medium text-gray-600">{country.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountryOrdersCard;
