import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'ecom_dash',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Makhas037@123*',
  max: 20,
});

export class AnalyticsService {
  // Check if question is about analytics
  static isAnalyticsQuestion(message) {
    const keywords = ['analytics', 'metrics', 'kpi', 'performance', 'insights', 'dashboard'];
    return keywords.some(k => message.toLowerCase().includes(k));
  }

  // Get real-time analytics data
  static async getAnalyticsData(userId) {
    const kpisQuery = `
      SELECT 
        COUNT(*) as total_sales,
        COALESCE(SUM(amount), 0) as total_revenue,
        COALESCE(AVG(amount), 0) as avg_order_value,
        COUNT(DISTINCT customer_id) as unique_customers
      FROM sales
      WHERE sale_date >= CURRENT_DATE - INTERVAL '30 days'
    `;
    
    const result = await pool.query(kpisQuery);
    return result.rows[0];
  }

  // Explain analytics to user
  static async explainAnalytics(message, userId) {
    const data = await this.getAnalyticsData(userId);
    
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('dashboard') || lowerMsg.includes('overview')) {
      return `Your dashboard shows key business metrics:
      
📊 **Total Sales**: ${data.total_sales} transactions in the last 30 days
💰 **Total Revenue**: $${parseFloat(data.total_revenue).toFixed(2)}
📈 **Average Order Value**: $${parseFloat(data.avg_order_value).toFixed(2)}
👥 **Unique Customers**: ${data.unique_customers} customers

These metrics help you track business health and identify growth opportunities.`;
    }
    
    if (lowerMsg.includes('kpi') || lowerMsg.includes('metrics')) {
      return `Your Key Performance Indicators (KPIs):

1. **Revenue**: Measures total income - currently $${parseFloat(data.total_revenue).toFixed(2)}
2. **Average Order Value (AOV)**: Shows spending per transaction - $${parseFloat(data.avg_order_value).toFixed(2)}
3. **Customer Count**: Tracks unique buyers - ${data.unique_customers} customers
4. **Sales Volume**: Total transactions - ${data.total_sales} sales

Track these daily to spot trends and make data-driven decisions.`;
    }
    
    return `Your analytics show ${data.total_sales} sales generating $${parseFloat(data.total_revenue).toFixed(2)} in revenue. What specific metric would you like me to explain?`;
  }
}
