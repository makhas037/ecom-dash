import React, { useState } from 'react';
import { ArrowUpRight, ArrowUp, ArrowDown, X, TrendingUp, DollarSign } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const KPICard = ({
  title,
  value,
  changePercent,
  comparison,
  sparkline = null,
  sparklineColor = '#8B5CF6'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isPositive = changePercent > 0;
  const sparklineData = sparkline ? sparkline.map(val => ({ value: val })) : null;

  // --- Style Definitions for Hover States ---
  const cardGradientClasses = 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg';
  const cardWhiteClasses = 'bg-white shadow-sm border border-gray-100';
  const buttonHoverClasses = 'bg-white text-purple-600';
  // CHANGED: Updated default button color to make it more visible
  const buttonDefaultClasses = 'bg-blue-100 text-blue-700';

  const defaultTextColor = 'text-gray-800';
  const defaultSubtitleColor = 'text-gray-500';
  const hoverTextColor = 'text-white';
  const hoverSubtitleColor = 'text-white/80';

  // Mock data for modal
  const detailedData = [ { month: 'Jan', value: 12400 }, { month: 'Jun', value: 14813 } ];

  return (
    <>
      <div
        className="relative h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Card Body with curved corners */}
        <div
          className={`
            h-full flex flex-col justify-between transition-all duration-300
            rounded-xl overflow-hidden
            ${isHovered ? cardGradientClasses : cardWhiteClasses}
          `}
        >
          {/* Top content area with padding to avoid the button */}
          <div className="p-4 pr-14">
            <h3 className={`text-sm font-medium ${isHovered ? hoverSubtitleColor : defaultSubtitleColor}`}>
              {title}
            </h3>
          </div>

          {/* Bottom content area */}
          <div className="p-4 pt-0">
            {/* Value & Change */}
            <div className="mb-2">
              <div className="flex items-baseline space-x-2">
                <span className={`text-3xl font-bold ${isHovered ? hoverTextColor : defaultTextColor}`}>
                  {value}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                  isPositive
                    ? (isHovered ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700')
                    : (isHovered ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700')
                }`}>
                  {isPositive ? <ArrowUp size={12} className="mr-0.5" /> : <ArrowDown size={12} className="mr-0.5" />}
                  {Math.abs(changePercent)}%
                </span>
              </div>
            </div>

            {/* Comparison Text */}
            {comparison && (
              <p className={`text-xs ${isHovered ? hoverSubtitleColor : defaultSubtitleColor}`}>
                {comparison}
              </p>
            )}
          </div>

          {/* Sparkline Chart */}
          {sparklineData && (
            <div className="h-16 -mx-1 -mb-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <defs>
                    <linearGradient id={`gradient-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isHovered ? 'white' : sparklineColor} stopOpacity={isHovered ? 0.4 : 0.2} />
                      <stop offset="95%" stopColor={isHovered ? 'white' : sparklineColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={isHovered ? 'rgba(255,255,255,0.9)' : sparklineColor}
                    fill={`url(#gradient-${title.replace(/\s+/g, '')})`}
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* The "Cutter" Div - Creates the illusion of a curved corner */}
        <div className="absolute top-0 right-0 w-14 h-14 bg-gray-50 rounded-bl-full pointer-events-none"></div>

        {/* The Arrow Button - Placed inside the "cutout" area */}
        <button
          onClick={() => setIsExpanded(true)}
          className={`
            absolute top-2 right-2 w-8 h-8 flex items-center justify-center
            rounded-full shadow-sm transition-all duration-300 hover:scale-110 z-10
            ${isHovered ? buttonHoverClasses : buttonDefaultClasses}
          `}
        >
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* Expansion Modal (no changes) */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsExpanded(false)}
        >
           <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <p className="text-white/80 text-sm">Detailed Analytics & Insights</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-purple-100">
                  <p className="text-sm text-gray-600 mb-1">Current Value</p>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <p className="text-sm text-gray-600 mb-1">Growth Rate</p>
                  <p className="text-2xl font-bold text-green-600">{isPositive ? '+' : ''}{changePercent}%</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                  <p className="text-sm text-gray-600 mb-1">Target</p>
                  <p className="text-2xl font-bold text-orange-600">$15,000</p>
                </div>
              </div>

              {/* Detailed Chart */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">6-Month Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={detailedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={{ fill: '#8B5CF6', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KPICard;
