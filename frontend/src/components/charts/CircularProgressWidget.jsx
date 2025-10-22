// src/components/charts/CircularProgressWidget.jsx
import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { getRadialBarData } from '../../services/mockdata';
import Card from '../common/Card';

function CircularProgressWidget() {
  const data = getRadialBarData();
  return (
    <Card style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
      {data.map(item => (
        <div key={item.name} style={{ textAlign: 'center' }}>
          <ResponsiveContainer width={120} height={120}>
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={[item]} startAngle={90} endAngle={450}>
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar background dataKey="value" cornerRadius={10} angleAxisId={0} fill={item.fill} />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="progress-label" fontSize="24px" fill="var(--color-text-primary)">
                {`${item.value}%`}
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
          <h4>{item.name}</h4>
        </div>
      ))}
    </Card>
  );
}

export default CircularProgressWidget;
