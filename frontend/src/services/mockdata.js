// src/services/mockData.js
// This file simulates fetching live data from an API.

export const getBarChartData = () => [
  { name: 'Jan', value: 65, goal: 80 },
  { name: 'Feb', value: 59, goal: 80 },
  { name: 'Mar', value: 80, goal: 80 },
  { name: 'Apr', value: 81, goal: 80 },
  { name: 'May', value: 56, goal: 80 },
  { name: 'Jun', value: 55, goal: 80 },
];

export const getAreaChartData = () => [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 5000 },
    { month: 'Apr', revenue: 4500 },
    { month: 'May', revenue: 6000 },
    { month: 'Jun', revenue: 5500 },
];

export const getRadialBarData = () => [
    { name: 'Activity', value: 76, fill: '#8884d8' },
    { name: 'Transfer', value: 53, fill: '#82ca9d' },
];

export const getDonutChartData = () => [
    { name: 'Growth', value: 70 },
    { name: 'Order', value: 30 },
];
