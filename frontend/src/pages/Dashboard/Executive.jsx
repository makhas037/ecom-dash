// src/pages/Dashboard/Executive.jsx
import React from 'react';
import BarChartWidget from '../../components/charts/BarChartWidget';
import AreaChartWidget from '../../components/charts/AreaChartWidget';
import CircularProgressWidget from '../../components/charts/CircularProgressWidget';
import './Dashboard.css';

function Executive() {
  return (
    <div className="dashboard-grid">
      <BarChartWidget />
      <CircularProgressWidget />
      <div className="area-chart-widget">
        <AreaChartWidget />
      </div>
      {/* Add more widgets here */}
    </div>
  );
}

export default Executive;
