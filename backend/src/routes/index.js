import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;

const router = express.Router();

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'ecom_dash',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Makhas037@123*',
  max: 20,
});

pool.on('connect', () => {
  console.log('✅ Database connected in routes');
});

// Health check
router.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Gemini AI Chat - CRITICAL: This must be defined
router.post('/gemini/chat', async (req, res) => {
  console.log('🤖 Gemini chat endpoint hit');
  console.log('Request body:', req.body);
  
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyCs0rVYHFMKL3lifcistmSUY90jKv059WY';
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let prompt = `You are Fick AI, a business analytics assistant.\n\n`;
    
    if (context?.salesData) {
      prompt += `Business metrics:\n`;
      prompt += `- Total Sales: ${context.salesData.total_sales || 'N/A'}\n`;
      prompt += `- Revenue: $${context.salesData.total_revenue || 'N/A'}\n`;
      prompt += `- Avg Order: $${context.salesData.avg_order_value || 'N/A'}\n\n`;
    }
    
    prompt += `Question: ${message}\n\nProvide a helpful response in under 150 words.`;

    console.log('Sending to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('✅ Gemini response received');
    res.json({
      response: text,
      timestamp: new Date().toISOString(),
      model: 'gemini-2.5-flash'
    });
  } catch (error) {
    console.error('❌ Gemini error:', error);
    res.status(500).json({ 
      error: 'AI service error',
      details: error.message 
    });
  }
});

// Sales endpoint
router.get('/sales', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    
    const [salesResult, countResult] = await Promise.all([
      pool.query('SELECT * FROM sales ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]),
      pool.query('SELECT COUNT(*) FROM sales')
    ]);
    
    res.json({
      data: salesResult.rows,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].count),
        pages: Math.ceil(countResult.rows[0].count / limit)
      }
    });
  } catch (error) {
    console.error('Sales error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Analytics dashboard
router.get('/analytics/dashboard', async (req, res) => {
  try {
    const kpisQuery = `
      SELECT 
        COUNT(*) as total_sales,
        COALESCE(SUM(amount), 0) as total_revenue,
        COALESCE(AVG(amount), 0) as avg_order_value,
        COUNT(DISTINCT customer_id) as unique_customers
      FROM sales
      WHERE sale_date >= CURRENT_DATE - INTERVAL '30 days'
    `;
    
    const [kpis, recentSales] = await Promise.all([
      pool.query(kpisQuery),
      pool.query('SELECT * FROM sales ORDER BY created_at DESC LIMIT 10')
    ]);
    
    res.json({
      kpis: kpis.rows[0],
      recentSales: recentSales.rows,
      topProducts: [],
      customerStats: {}
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Users
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, full_name, role FROM users');
    res.json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Products
router.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Customers
router.get('/customers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
    res.json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Log all registered routes
console.log('📋 Registered routes:');
router.stack.forEach((r) => {
  if (r.route) {
    const methods = Object.keys(r.route.methods).join(', ').toUpperCase();
    console.log(`  ${methods} /api${r.route.path}`);
  }
});

export default router;