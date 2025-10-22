const db = require('../config/db');
const redisClient = require('../config/redis');

// Get all sales with pagination and caching
exports.getAllSales = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    
    const cacheKey = `sales:list:p`:l``;
    
    // Check cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log('📦 Returning cached sales data');
      return res.json(JSON.parse(cached));
    }
    
    // Query database
    const salesQuery = 'SELECT * FROM sales ORDER BY created_at DESC LIMIT `1 OFFSET `2';
    const countQuery = 'SELECT COUNT(*) FROM sales';
    
    const [salesResult, countResult] = await Promise.all([
      db.query(salesQuery, [limit, offset]),
      db.query(countQuery)
    ]);
    
    const response = {
      data: salesResult.rows,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].count),
        pages: Math.ceil(countResult.rows[0].count / limit)
      }
    };
    
    // Cache for 2 minutes
    await redisClient.setEx(cacheKey, 120, JSON.stringify(response));
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get sales by date range
exports.getSalesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = 
      SELECT * FROM sales 
      WHERE sale_date BETWEEN `1 AND `2
      ORDER BY sale_date DESC
    ;
    
    const result = await db.query(query, [startDate, endDate]);
    res.json({ data: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('Error fetching sales by date:', error);
    res.status(500).json({ error: error.message });
  }
};

// Clear sales cache (call after updates)
exports.clearSalesCache = async () => {
  try {
    const keys = await redisClient.keys('sales:*');
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};
