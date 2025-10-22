import axios from 'axios';
import { pool } from '../config/db.js';
import logger from '../utils/logger.js';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export const analyticsController = {
  // Get sales forecast
  getForecast: async (req, res) => {
    try {
      const { horizon = 28 } = req.query;

      // Fetch historical data
      const historicalQuery = `
        SELECT 
          DATE(created_at) as date,
          SUM(total_amount) as revenue
        FROM sales
        WHERE created_at >= NOW() - INTERVAL '12 months'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;

      const historicalData = await pool.query(historicalQuery);

      // Call ML service for forecast
      const response = await axios.post(`${ML_SERVICE_URL}/forecast`, {
        data: historicalData.rows,
        horizon: parseInt(horizon)
      });

      res.json({
        forecast: response.data.forecast,
        confidence: response.data.confidence,
        model: response.data.model
      });
    } catch (error) {
      logger.error('Error generating forecast:', error);
      res.status(500).json({ error: 'Failed to generate forecast' });
    }
  },

  // Customer segmentation
  getCustomerSegments: async (req, res) => {
    try {
      const query = `
        WITH customer_metrics AS (
          SELECT 
            c.id,
            c.name,
            COUNT(s.id) as frequency,
            MAX(s.created_at) as last_purchase,
            SUM(s.total_amount) as monetary
          FROM customers c
          LEFT JOIN sales s ON c.id = s.customer_id
          GROUP BY c.id, c.name
        )
        SELECT 
          id,
          name,
          frequency,
          EXTRACT(DAY FROM NOW() - last_purchase) as recency,
          monetary,
          CASE 
            WHEN EXTRACT(DAY FROM NOW() - last_purchase) <= 30 AND frequency >= 5 THEN 'Champions'
            WHEN EXTRACT(DAY FROM NOW() - last_purchase) <= 90 AND frequency >= 3 THEN 'Loyal'
            WHEN EXTRACT(DAY FROM NOW() - last_purchase) <= 180 THEN 'At Risk'
            ELSE 'Lost'
          END as segment
        FROM customer_metrics
        ORDER BY monetary DESC
      `;

      const result = await pool.query(query);

      // Group by segment
      const segments = result.rows.reduce((acc, customer) => {
        const segment = customer.segment;
        if (!acc[segment]) {
          acc[segment] = [];
        }
        acc[segment].push(customer);
        return acc;
      }, {});

      res.json({
        segments,
        totalCustomers: result.rows.length,
        segmentDistribution: {
          Champions: segments.Champions?.length || 0,
          Loyal: segments.Loyal?.length || 0,
          'At Risk': segments['At Risk']?.length || 0,
          Lost: segments.Lost?.length || 0
        }
      });
    } catch (error) {
      logger.error('Error fetching customer segments:', error);
      res.status(500).json({ error: 'Failed to fetch customer segments' });
    }
  },

  // Churn prediction
  getChurnPrediction: async (req, res) => {
    try {
      // Fetch customer features
      const query = `
        SELECT 
          c.id,
          c.name,
          COUNT(s.id) as order_count,
          AVG(s.total_amount) as avg_order_value,
          MAX(s.created_at) as last_order_date,
          EXTRACT(DAY FROM NOW() - MAX(s.created_at)) as days_since_last_order
        FROM customers c
        LEFT JOIN sales s ON c.id = s.customer_id
        GROUP BY c.id, c.name
      `;

      const customers = await pool.query(query);

      // Call ML service for churn prediction
      const response = await axios.post(`${ML_SERVICE_URL}/churn`, {
        customers: customers.rows
      });

      res.json({
        predictions: response.data.predictions,
        highRiskCount: response.data.predictions.filter(p => p.risk === 'high').length
      });
    } catch (error) {
      logger.error('Error predicting churn:', error);
      res.status(500).json({ error: 'Failed to predict churn' });
    }
  }
};
