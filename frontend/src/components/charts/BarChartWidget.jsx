// src/components/charts/BarChartWidget.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getBarChartData } from '../../services/mockdata';
import Card from '../common/Card';

function BarChartWidget() {
  const data = getBarChartData();
  return (
    <Card>
      <h3 style={{marginBottom: '20px'}}>Activity Overview</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <XAxis dataKey="name" stroke="var(--color-text-secondary)" />
          <YAxis stroke="var(--color-text-secondary)" />
          <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}/>
          <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="goal" fill="rgba(0, 123, 255, 0.2)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default BarChartWidget;
