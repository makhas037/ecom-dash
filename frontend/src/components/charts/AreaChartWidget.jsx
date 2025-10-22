// src/components/charts/AreaChartWidget.jsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getAreaChartData } from '../../services/mockdata';
import Card from '../common/Card';

function AreaChartWidget() {
  const data = getAreaChartData();
  return (
    <Card>
      <h3 style={{marginBottom: '20px'}}>Revenue Growth</h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="month" stroke="var(--color-text-secondary)" />
          <YAxis stroke="var(--color-text-secondary)" />
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}/>
          <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorRevenue)" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default AreaChartWidget;
