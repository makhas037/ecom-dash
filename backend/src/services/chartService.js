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

export class ChartService {
  // Detect if user wants a chart
  static detectChartRequest(message) {
    const chartKeywords = ['chart', 'graph', 'visualize', 'plot', 'show me', 'display', 'trend'];
    return chartKeywords.some(keyword => message.toLowerCase().includes(keyword));
  }

  // Generate sales trend chart
  static async generateSalesTrend(userId, days = 30) {
    const query = `
      SELECT 
        TO_CHAR(sale_date, 'Mon DD') as date,
        COUNT(*) as sales_count,
        SUM(amount) as revenue
      FROM sales
      WHERE sale_date >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY sale_date
      ORDER BY sale_date ASC
    `;
    
    const result = await pool.query(query);
    
    return {
      type: 'line',
      title: `Sales Trend (Last ${days} Days)`,
      data: result.rows,
      xKey: 'date',
      yKeys: ['sales_count', 'revenue'],
      colors: ['#8884d8', '#82ca9d'],
      labels: { sales_count: 'Sales', revenue: 'Revenue ($)' }
    };
  }

  // Generate top products chart
  static async generateTopProducts(userId, limit = 5) {
    const query = `
      SELECT 
        p.name as product_name,
        COUNT(s.id) as sales_count,
        COALESCE(SUM(s.amount), 0) as revenue
      FROM products p
      LEFT JOIN sales s ON p.id = s.product_id
      GROUP BY p.id, p.name
      ORDER BY revenue DESC
      LIMIT $1
    `;
    
    const result = await pool.query(query, [limit]);
    
    return {
      type: 'bar',
      title: 'Top Products by Revenue',
      data: result.rows,
      xKey: 'product_name',
      yKeys: ['revenue'],
      colors: ['#8884d8'],
      labels: { revenue: 'Revenue ($)' }
    };
  }

  // Generate customer segments pie chart
  static async generateCustomerSegments(userId) {
    const query = `
      SELECT 
        CASE 
          WHEN total_spent > 1000 THEN 'Premium'
          WHEN total_spent > 500 THEN 'Regular'
          ELSE 'New'
        END as segment,
        COUNT(*) as count
      FROM (
        SELECT customer_id, COALESCE(SUM(amount), 0) as total_spent
        FROM sales
        GROUP BY customer_id
      ) customer_totals
      GROUP BY segment
    `;
    
    const result = await pool.query(query);
    
    return {
      type: 'pie',
      title: 'Customer Segments',
      data: result.rows,
      nameKey: 'segment',
      valueKey: 'count',
      colors: ['#0088FE', '#00C49F', '#FFBB28']
    };
  }

  // Main chart generation router
  static async generateChart(message, userId) {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('sales') || lowerMsg.includes('revenue') || lowerMsg.includes('trend')) {
      return await this.generateSalesTrend(userId);
    }
    
    if (lowerMsg.includes('product')) {
      return await this.generateTopProducts(userId);
    }
    
    if (lowerMsg.includes('customer') || lowerMsg.includes('segment')) {
      return await this.generateCustomerSegments(userId);
    }
    
    return null;
  }
}
