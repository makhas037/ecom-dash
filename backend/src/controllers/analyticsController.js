const db = require('../config/db');
const redisClient = require('../config/redis');

// Batch endpoint for dashboard overview
exports.getDashboardOverview = async (req, res) => {
  try {
    const cacheKey = 'dashboard:overview';
    
    // Check cache
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log('📦 Returning cached dashboard data');
      return res.json(JSON.parse(cached));
    }
    
    // Fetch all data in parallel
    const [kpis, recentSales, topProducts, customerStats] = await Promise.all([
      getKPIs(),
      getRecentSales(10),
      getTopProducts(5),
      getCustomerStats()
    ]);
    
    const response = { kpis, recentSales, topProducts, customerStats };
    
    // Cache for 5 minutes
    await redisClient.setEx(cacheKey, 300, JSON.stringify(response));
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    res.status(500).json({ error: error.message });
  }
};

// Helper functions
async function getKPIs() {
  const query = 
    SELECT 
      COUNT(*) as total_sales,
      SUM(amount) as total_revenue,
      AVG(amount) as avg_order_value,
      COUNT(DISTINCT customer_id) as unique_customers
    FROM sales
    WHERE sale_date >= CURRENT_DATE - INTERVAL '30 days'
  ;
  const result = await db.query(query);
  return result.rows[0];
}

async function getRecentSales(limit = 10) {
  const query = 'SELECT * FROM sales ORDER BY created_at DESC LIMIT `1';
  const result = await db.query(query, [limit]);
  return result.rows;
}

async function getTopProducts(limit = 5) {
  const query = 
    SELECT p.name, p.id, COUNT(s.id) as sales_count, SUM(s.amount) as revenue
    FROM products p
    JOIN sales s ON p.id = s.product_id
    WHERE s.sale_date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY p.id, p.name
    ORDER BY revenue DESC
    LIMIT `1
  ;
  const result = await db.query(query, [limit]);
  return result.rows;
}

async function getCustomerStats() {
  const query = 
    SELECT 
      COUNT(*) as total_customers,
      COUNT(CASE WHEN last_purchase >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as active_customers
    FROM customers
  ;
  const result = await db.query(query);
  return result.rows[0];
}

module.exports = { getDashboardOverview };
