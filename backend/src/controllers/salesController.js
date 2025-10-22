import { pool } from '../config/db.js';
import logger from '../utils/logger.js';

export const salesController = {
  // Get dashboard summary
  getDashboardSummary: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      const query = `
        SELECT 
          SUM(total_amount) as total_revenue,
          COUNT(*) as total_orders,
          AVG(total_amount) as average_order_value,
          SUM(profit) as total_profit,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_orders,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
          SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders
        FROM sales
        WHERE created_at BETWEEN $1 AND $2
      `;

      const result = await pool.query(query, [
        startDate || '2024-01-01',
        endDate || new Date().toISOString()
      ]);

      // Calculate previous period for comparison
      const prevQuery = `
        SELECT SUM(total_amount) as prev_revenue
        FROM sales
        WHERE created_at BETWEEN 
          (DATE $1 - INTERVAL '30 days') AND 
          (DATE $2 - INTERVAL '30 days')
      `;

      const prevResult = await pool.query(prevQuery, [
        startDate || '2024-01-01',
        endDate || new Date().toISOString()
      ]);

      const currentRevenue = parseFloat(result.rows[0].total_revenue || 0);
      const previousRevenue = parseFloat(prevResult.rows[0].prev_revenue || 1);
      const changePercent = ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(2);

      res.json({
        summary: {
          totalProfit: {
            value: parseFloat(result.rows[0].total_profit || 0),
            changePercent: parseFloat(changePercent),
            comparatorValue: previousRevenue
          },
          totalRevenue: {
            value: currentRevenue,
            changePercent: parseFloat(changePercent)
          },
          totalOrders: parseInt(result.rows[0].total_orders || 0),
          averageOrderValue: parseFloat(result.rows[0].average_order_value || 0),
          orderStatus: {
            completed: parseInt(result.rows[0].completed_orders || 0),
            pending: parseInt(result.rows[0].pending_orders || 0),
            cancelled: parseInt(result.rows[0].cancelled_orders || 0)
          }
        }
      });
    } catch (error) {
      logger.error('Error fetching dashboard summary:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard summary' });
    }
  },

  // Get sales report data
  getSalesReport: async (req, res) => {
    try {
      const { period = 'monthly' } = req.query;
      
      let groupBy;
      switch (period) {
        case 'daily':
          groupBy = "DATE_TRUNC('day', created_at)";
          break;
        case 'weekly':
          groupBy = "DATE_TRUNC('week', created_at)";
          break;
        case 'yearly':
          groupBy = "DATE_TRUNC('year', created_at)";
          break;
        default:
          groupBy = "DATE_TRUNC('month', created_at)";
      }

      const query = `
        SELECT 
          ${groupBy} as period,
          SUM(total_amount) as revenue,
          SUM(profit) as profit,
          COUNT(*) as orders
        FROM sales
        WHERE created_at >= NOW() - INTERVAL '6 months'
        GROUP BY period
        ORDER BY period ASC
      `;

      const result = await pool.query(query);

      res.json({
        series: result.rows.map(row => ({
          period: row.period,
          revenue: parseFloat(row.revenue),
          profit: parseFloat(row.profit),
          orders: parseInt(row.orders)
        })),
        perUnitSales: 2780
      });
    } catch (error) {
      logger.error('Error fetching sales report:', error);
      res.status(500).json({ error: 'Failed to fetch sales report' });
    }
  },

  // Get top products
  getTopProducts: async (req, res) => {
    try {
      const query = `
        SELECT 
          p.id,
          p.name,
          p.category,
          SUM(si.quantity) as total_sold,
          SUM(si.total_price) as total_revenue
        FROM products p
        JOIN sales_items si ON p.id = si.product_id
        JOIN sales s ON si.sale_id = s.id
        WHERE s.created_at >= NOW() - INTERVAL '30 days'
        GROUP BY p.id, p.name, p.category
        ORDER BY total_revenue DESC
        LIMIT 10
      `;

      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      logger.error('Error fetching top products:', error);
      res.status(500).json({ error: 'Failed to fetch top products' });
    }
  },

  // Get sales by region
  getSalesByRegion: async (req, res) => {
    try {
      const query = `
        SELECT 
          country,
          COUNT(*) as order_count,
          SUM(total_amount) as total_revenue,
          ROUND((COUNT(*)::NUMERIC / (SELECT COUNT(*) FROM sales) * 100), 2) as percentage
        FROM sales
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY country
        ORDER BY total_revenue DESC
        LIMIT 10
      `;

      const result = await pool.query(query);
      res.json({
        countries: result.rows.map(row => ({
          country: row.country,
          orderCount: parseInt(row.order_count),
          revenue: parseFloat(row.total_revenue),
          percentage: parseFloat(row.percentage)
        }))
      });
    } catch (error) {
      logger.error('Error fetching sales by region:', error);
      res.status(500).json({ error: 'Failed to fetch sales by region' });
    }
  }
};
