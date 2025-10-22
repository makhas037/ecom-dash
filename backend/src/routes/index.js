import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;

import { AIOrchestrator } from '../services/aiOrchestrator.js';
import { ChatHistoryService } from '../services/chatHistoryService.js';
import { UserPreferencesService } from '../services/userPreferencesService.js';
import { DatasetService } from '../services/datasetService.js';

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
  console.log('🤖 AI Chat request received');
  
  try {
    const { message, userId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Use a default user if not provided (for testing)
    const effectiveUserId = userId || 'default-user-id';

    // Process message through AI Orchestrator
    const result = await AIOrchestrator.processMessage(message, effectiveUserId);

    console.log(`✅ Response generated (type: ${result.messageType})`);
    res.json(result);

  } catch (error) {
    console.error('❌ AI Chat error:', error);
    res.status(500).json({ 
      error: 'AI service error',
      details: error.message
    });
  }
});

// ==================== CHAT HISTORY ====================
router.get('/chat/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    
    const history = await ChatHistoryService.getUserHistory(userId, limit);
    res.json({ history, count: history.length });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/chat/history/search', async (req, res) => {
  try {
    const { userId, searchTerm } = req.body;
    const results = await ChatHistoryService.searchHistory(userId, searchTerm);
    res.json({ results, count: results.length });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/chat/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await ChatHistoryService.clearHistory(userId);
    res.json({ message: 'Chat history cleared successfully' });
  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== USER PREFERENCES ====================
router.get('/preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = await UserPreferencesService.getPreferences(userId);
    res.json(preferences);
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    const preferences = await UserPreferencesService.updatePreferences(userId, updates);
    res.json(preferences);
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/preferences/:userId/reset', async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = await UserPreferencesService.resetPreferences(userId);
    res.json(preferences);
  } catch (error) {
    console.error('Reset preferences error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== USER DATASETS ====================
router.get('/datasets/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const datasets = await DatasetService.getUserDatasets(userId);
    res.json({ datasets, count: datasets.length });
  } catch (error) {
    console.error('Get datasets error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/datasets/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { dataset_name, description, query_config } = req.body;
    
    const dataset = await DatasetService.saveDataset(
      userId,
      dataset_name,
      description,
      query_config
    );
    
    res.json(dataset);
  } catch (error) {
    console.error('Save dataset error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/datasets/:userId/:datasetId', async (req, res) => {
  try {
    const { userId, datasetId } = req.params;
    const dataset = await DatasetService.getDataset(datasetId, userId);
    
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }
    
    res.json(dataset);
  } catch (error) {
    console.error('Get dataset error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/datasets/:userId/:datasetId', async (req, res) => {
  try {
    const { userId, datasetId } = req.params;
    const updates = req.body;
    
    const dataset = await DatasetService.updateDataset(datasetId, userId, updates);
    res.json(dataset);
  } catch (error) {
    console.error('Update dataset error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/datasets/:userId/:datasetId', async (req, res) => {
  try {
    const { userId, datasetId } = req.params;
    await DatasetService.deleteDataset(datasetId, userId);
    res.json({ message: 'Dataset deleted successfully' });
  } catch (error) {
    console.error('Delete dataset error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/datasets/:userId/:datasetId/favorite', async (req, res) => {
  try {
    const { userId, datasetId } = req.params;
    const dataset = await DatasetService.toggleFavorite(datasetId, userId);
    res.json(dataset);
  } catch (error) {
    console.error('Toggle favorite error:', error);
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
    console.error('Sales error:', error);
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
      recentSales: recentSales.rows,
      topProducts: [],
      customerStats: {}
    });
  } catch (error) {
    console.error('Analytics error:', error);
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

console.log('📋 All routes loaded successfully with AI services');

export default router;
