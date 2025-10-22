export const endpoints = {
  // Sales
  salesSummary: '/sales/summary',
  salesReport: '/sales/report',
  topProducts: '/sales/top-products',
  salesByRegion: '/sales/by-region',

  // Analytics
  forecast: '/analytics/forecast',
  segments: '/analytics/segments',
  churn: '/analytics/churn',

  // Customers
  customers: '/customers',
  customerById: (id) => `/customers/${id}`,

  // AI
  aiChat: '/ai/chat',
  aiInsights: '/ai/insights',
};
