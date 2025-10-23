import authRoutes from './auth.js';
import express from 'express';
import { queryWithUser } from '../config/database.js';
import pool from '../config/database.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { FileUploadService } from '../services/fileUploadService.js';

const router = express.Router();

// ==================== HEALTH CHECK ====================
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== AI CHAT (WITH USER ISOLATION) ====================
router.post('/gemini/chat', authMiddleware, async (req, res) => {
  console.log('🤖 Chat request');

  try {
    const { message } = req.body;
    const userId = req.userId; // From auth middleware

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

    // Save to chat history with RLS (automatically user-scoped)
    await queryWithUser(
      userId,
      `INSERT INTO chat_history (user_id, message, response, message_type, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [userId, message, text, 'general']
    );

    res.json({
      response: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'AI service error', details: error.message });
  }
});

// ==================== FILE UPLOAD & DATASETS (SECURE WITH USER ISOLATION) ====================
router.post('/datasets/:userId/upload', authMiddleware, upload.single('file'), async (req, res) => {
  console.log('📤 File upload');

  try {
    const { userId } = req.params;

    // SECURITY: Verify user can only upload to their own account
    if (userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized: Cannot upload to another user\'s account' });
    }

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

router.get('/datasets/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    // SECURITY: Verify user can only access their own data
    if (userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized: Cannot access another user\'s datasets' });
    }

    // RLS automatically filters by user_id
    const result = await queryWithUser(
      userId,
      'SELECT * FROM user_datasets ORDER BY created_at DESC'
    );

    res.json({ datasets: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('Get datasets error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/datasets/:userId/:datasetId/data', authMiddleware, async (req, res) => {
  try {
    const { userId, datasetId } = req.params;

    // SECURITY: Verify ownership
    if (userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

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

router.post('/datasets/:userId/:datasetId/apply', authMiddleware, async (req, res) => {
  try {
    const { userId, datasetId } = req.params;

    // SECURITY: Verify ownership
    if (userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const dataset = await FileUploadService.applyDataset(datasetId, userId);
    res.json({ message: 'Dataset applied successfully', dataset });
  } catch (error) {
    console.error('Apply dataset error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/datasets/:userId/applied', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    // SECURITY: Verify ownership
    if (userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // RLS automatically filters
    const result = await queryWithUser(
      userId,
      'SELECT * FROM user_datasets WHERE is_applied = true'
    );

    res.json({ dataset: result.rows[0] || null });
  } catch (error) {
    console.error('Get applied dataset error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/datasets/:userId/:datasetId', authMiddleware, async (req, res) => {
  try {
    const { userId, datasetId } = req.params;

    // SECURITY: Verify ownership
    if (userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    await FileUploadService.deleteDataset(datasetId, userId);
    res.json({ message: 'Dataset deleted successfully' });
  } catch (error) {
    console.error('Delete dataset error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== PREFERENCES (SECURE) ====================
router.get('/preferences/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    // SECURITY: Verify ownership
    if (userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // RLS automatically filters
    let result = await queryWithUser(
      userId,
      'SELECT * FROM user_preferences WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      result = await queryWithUser(
        userId,
        `INSERT INTO user_preferences (user_id) VALUES ($1) RETURNING *`,
        [userId]
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/preferences/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { theme, default_chart_type, ai_response_style } = req.body;

    // SECURITY: Verify ownership
    if (userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // RLS automatically filters
    const result = await queryWithUser(
      userId,
      `UPDATE user_preferences
       SET theme = COALESCE($2, theme),
           default_chart_type = COALESCE($3, default_chart_type),
           ai_response_style = COALESCE($4, ai_response_style),
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $1
       RETURNING *`,
      [userId, theme, default_chart_type, ai_response_style]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== CHAT HISTORY (SECURE) ====================
router.get('/chat/history/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    // SECURITY: Verify ownership
    if (userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // RLS automatically filters by user_id
    const result = await queryWithUser(
      userId,
      `SELECT id, message, response, message_type, metadata, created_at
       FROM chat_history
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit]
    );

    res.json({ history: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/chat/history/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    // SECURITY: Verify ownership
    if (userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // RLS automatically filters
    await queryWithUser(
      userId,
      'DELETE FROM chat_history WHERE user_id = $1',
      [userId]
    );

    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== USER-SPECIFIC ANALYTICS (SECURE) ====================
router.get('/analytics/dashboard', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Get user-specific analytics from their applied dataset
    const result = await queryWithUser(
      userId,
      `SELECT * FROM user_datasets WHERE user_id = $1 AND is_applied = true LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({
        message: 'No dataset applied. Please upload and apply a dataset first.',
        kpis: { total_sales: 0, total_revenue: 0, avg_order_value: 0, unique_customers: 0 }
      });
    }

    const appliedDataset = result.rows[0];
    const data = appliedDataset.data_snapshot || [];

    // Calculate KPIs from user's data
    const kpis = {
      total_sales: data.length,
      total_revenue: data.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0),
      avg_order_value: data.length > 0 ? (data.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0) / data.length) : 0,
      unique_customers: new Set(data.map(row => row.customer_id)).size
    };

    res.json({
      kpis,
      recentSales: data.slice(0, 10),
      datasetName: appliedDataset.dataset_name
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== CUSTOMERS (USER-SPECIFIC) ====================
router.get('/customers', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 20;

    // RLS automatically filters
    const result = await queryWithUser(
      userId,
      'SELECT * FROM user_customers ORDER BY created_at DESC LIMIT $1',
      [limit]
    );

    res.json({ data: result.rows, count: result.rows.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SALES (USER-SPECIFIC) ====================
router.get('/sales', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    // RLS automatically filters
    const [salesResult, countResult] = await Promise.all([
      queryWithUser(
        userId,
        'SELECT * FROM user_sales ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [limit, offset]
      ),
      queryWithUser(userId, 'SELECT COUNT(*) FROM user_sales')
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

// Products and other global data (no user isolation needed)
router.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

console.log('📋 All routes loaded successfully');
console.log('🔒 Multi-tenant security enabled with Row-Level Security');

router.use('/auth', authRoutes);

export default router;
