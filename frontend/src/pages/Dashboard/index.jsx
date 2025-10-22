import React, { useState, useEffect } from 'react';
import KPICard from '../../components/dashboard/KPICard';
import SalesReportAreaCard from '../../components/dashboard/SalesReportAreaCard';
import SalesActivityCard from '../../components/dashboard/SalesActivityCard';
import BestSellersCard from '../../components/dashboard/BestSellersCard';
import CountryOrdersCard from '../../components/dashboard/CountryOrdersCard';
import PageHeader from '../../components/common/PageHeader';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('monthly');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const kpiData = {
    totalProfit: {
      value: 14813.10,
      changePercent: 3.9,
      comparison: 'vs last month $12,534.00',
      sparkline: [20, 35, 45, 30, 50, 60, 45, 55, 40, 65, 55, 70]
    },
    totalInsight: {
      value: 122380,
      changePercent: 4.2,
      comparison: 'vs last month $119.53',
      sparkline: null
    },
    organicSales: {
      value: '98,1M',
      changePercent: -2.8,
      comparison: 'vs last month $2.8M',
      sparkline: null
    },
    grossMargin: {
      value: '98,1M',
      changePercent: 4.2,
      sparkline: [25, 40, 35, 50, 45, 60, 55, 70, 60, 75, 65, 80]
    }
  };

  const salesReportData = {
    series: [
      { label: 'Profit', value: 12000, changePercent: 9.9, color: '#27D3C7' },
      { label: 'Insight', value: 8500, changePercent: 9.9, color: '#FCD34D' },
      { label: 'Sale', value: 16000, changePercent: 9.9, color: '#8B5CF6' },
      { label: 'Target', value: 13500, changePercent: 9.9, color: '#C7D2FE' }
    ],
    perUnitSales: 2780,
    annotations: [{ text: 'Target overflow', value: 378 }]
  };

  const salesActivityData = {
    totalSellCount: 786000,
    segments: [
      { id: 'on_process', label: 'On Process', value: 45, color: '#27D3C7' },
      { id: 'canceled', label: 'Cancelled', value: 23, color: '#FCD34D' },
      { id: 'delivered', label: 'Delivered', value: 32, color: '#8B5CF6' }
    ]
  };

  const bestSellersData = {
    rows: [
      { id: 'u1', name: 'Pisang Kepok', price: 24, avatarUrl: 'https://i.pravatar.cc/150?img=1', changePercent: 4.2, total: 2423.00 },
      { id: 'u2', name: 'Vanessa Black', price: 23, avatarUrl: 'https://i.pravatar.cc/150?img=5', changePercent: 4.1, total: 2323.00 },
      { id: 'u3', name: 'Alison Butler', price: 22, avatarUrl: 'https://i.pravatar.cc/150?img=10', changePercent: 4.6, total: 2223.00 },
      { id: 'u4', name: 'Adam Alsop', price: 21, avatarUrl: 'https://i.pravatar.cc/150?img=8', changePercent: 3.9, total: 2123.00 }
    ]
  };

  const countryData = {
    totalTransactions: 4256,
    countries: [
      { code: 'US', name: 'USA', percent: 27, flag: '🇺🇸' },
      { code: 'AU', name: 'Australia', percent: 14, flag: '🇦🇺' },
      { code: 'IT', name: 'Italy', percent: 35, flag: '🇮🇹' },
      { code: 'IS', name: 'Iceland', percent: 13, flag: '🇮🇸' },
      { code: 'FR', name: 'France', percent: 11, flag: '🇫🇷' }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Dashboard"
        subtitle="Here's your overview of your business sales."
      />

      <div className="space-y-5">
        {/* KPI Cards - Smaller Gaps */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <KPICard
            title="Total Profit"
            value={`$${kpiData.totalProfit.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            changePercent={kpiData.totalProfit.changePercent}
            comparison={kpiData.totalProfit.comparison}
            sparkline={kpiData.totalProfit.sparkline}
            // variant prop removed
          />

          <KPICard
            title="Total Insight"
            value={`$${kpiData.totalInsight.value}`}
            changePercent={kpiData.totalInsight.changePercent}
            comparison={kpiData.totalInsight.comparison}
            // variant prop removed
          />

          <KPICard
            title="Organic Sales"
            value={`$${kpiData.organicSales.value}`}
            changePercent={kpiData.organicSales.changePercent}
            comparison={kpiData.organicSales.comparison}
            // variant prop removed
          />

          <KPICard
            title="Gross Margin"
            value={`$${kpiData.grossMargin.value}`}
            changePercent={kpiData.grossMargin.changePercent}
            sparkline={kpiData.grossMargin.sparkline}
            sparklineColor="#67E8F9"
            // variant prop removed
          />
        </div>

        {/* Main Content Grid - Tighter Spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-5">
            <SalesReportAreaCard
              data={salesReportData}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
            />
            <BestSellersCard data={bestSellersData} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-5">
            <SalesActivityCard data={salesActivityData} />
            <CountryOrdersCard data={countryData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
