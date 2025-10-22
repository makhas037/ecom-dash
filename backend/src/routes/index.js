import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import { FileUploadService, upload } from '../services/fileUploadService.js';

const router = express.Router();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'ecom_dash',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Makhas037@123*',
  max: 20,
});

// ==================== HEALTH CHECK ====================
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== AI CHAT ====================
router.post('/gemini/chat', async (req, res) => {
  console.log('🤖 Chat request');
  
  try {
    const { message, userId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyCs0rVYHFMKL3lifcistmSUY90jKv059WY';
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let prompt = 'You are Fick AI, a helpful business analytics assistant.\n\n';
    prompt += `User: ${message}\n\nProvide a helpful response in under 150 words.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      response: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'AI service error', details: error.message });
  }
});

// ==================== FILE UPLOAD & DATASETS ====================
router.post('/datasets/:userId/upload', upload.single('file'), async (req, res) => {
  console.log('📤 File upload');
  
  try {
    const { userId } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const parsedData = await FileUploadService.parseFile(req.file.path, req.file.originalname);
    const dataset = await FileUploadService.saveDataset(userId, req.file, parsedData);
    
    res.json({
      message: 'Dataset uploaded successfully',
      dataset: {
        ...dataset,
        preview: parsedData.data.slice(0, 5)
      }
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/datasets/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const query = 'SELECT * FROM user_datasets WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [userId]);
    res.json({ datasets: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('Get datasets error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/datasets/:userId/:datasetId/data', async (req, res) => {
  try {
    const { userId, datasetId } = req.params;
    const fullData = await FileUploadService.getDatasetData(datasetId, userId);
    
    res.json({
      dataset: {
        id: fullData.id,
        name: fullData.dataset_name,
        rowCount: fullData.row_count,
        columnCount: fullData.column_count,
        columns: fullData.query_config.columns
      },
      data: fullData.data.slice(0, 100),
      total: fullData.data.length,
      preview: fullData.preview
    });
  } catch (error) {
    console.error('Get dataset data error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/datasets/:userId/:datasetId/apply', async (req, res) => {
  try {
    const { userId, datasetId } = req.params;
    const dataset = await FileUploadService.applyDataset(datasetId, userId);
    res.json({ message: 'Dataset applied successfully', dataset });
  } catch (error) {
    console.error('Apply dataset error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/datasets/:userId/applied', async (req, res) => {
  try {
    const { userId } = req.params;
    const query = 'SELECT * FROM user_datasets WHERE user_id = $1 AND is_applied = true';
    const result = await pool.query(query, [userId]);
    res.json({ dataset: result.rows[0] || null });
  } catch (error) {
    console.error('Get applied dataset error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/datasets/:userId/:datasetId', async (req, res) => {
  try {
    const { userId, datasetId } = req.params;
    await FileUploadService.deleteDataset(datasetId, userId);
    res.json({ message: 'Dataset deleted successfully' });
  } catch (error) {
    console.error('Delete dataset error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== PREFERENCES ====================
router.get('/preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    let query = 'SELECT * FROM user_preferences WHERE user_id = $1';
    let result = await pool.query(query, [userId]);
    
    if (result.rows.length === 0) {
      query = `INSERT INTO user_preferences (user_id) VALUES ($1) RETURNING *`;
      result = await pool.query(query, [userId]);
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { theme, default_chart_type, ai_response_style } = req.body;

    const query = `
      UPDATE user_preferences
      SET theme = COALESCE($2, theme),
          default_chart_type = COALESCE($3, default_chart_type),
          ai_response_style = COALESCE($4, ai_response_style),
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [userId, theme, default_chart_type, ai_response_style]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== CHAT HISTORY ====================
router.get('/chat/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    
    const query = `
      SELECT id, message, response, message_type, metadata, created_at
      FROM chat_history
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `;
    
    const result = await pool.query(query, [userId, limit]);
    res.json({ history: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/chat/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await pool.query('DELETE FROM chat_history WHERE user_id = $1', [userId]);
    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== EXISTING ENDPOINTS ====================
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
    res.status(500).json({ error: error.message });
  }
});

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
      recentSales: recentSales.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, full_name, role FROM users');
    res.json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/customers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
    res.json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

console.log('📋 All routes loaded successfully');

export default router;