import React from 'react';
import { MoreVertical } from 'lucide-react';

const BestSellersCard = ({ data }) => {
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="bg-white rounded-card p-6 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Best Sellers</h3>
        <button className="p-1 hover:bg-gray-100 rounded-full">
          <MoreVertical size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider pb-3">
                Seller
              </th>
              <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider pb-3">
                Stats
              </th>
              <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wider pb-3">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((seller, index) => (
              <tr 
                key={seller.id} 
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <td className="py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white text-sm font-semibold">
                      {getInitials(seller.name)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{seller.name}</div>
                      <div className="text-xs text-gray-500">${seller.price}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <span className="inline-flex items-center px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                    +{seller.changePercent}%
                  </span>
                </td>
                <td className="py-4 text-right">
                  <span className="text-sm font-semibold text-gray-900">
                    ${seller.total.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BestSellersCard;
