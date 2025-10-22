import express from 'express';
import { salesController } from '../controllers/salesController.js';
import { analyticsController } from '../controllers/analyticsController.js';
import { customerController } from '../controllers/customerController.js';
import { geminiController } from '../controllers/geminiController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/health', (req, res) => res.json({ status: 'OK' }));

// Sales routes
router.get('/sales/summary', salesController.getDashboardSummary);
router.get('/sales/report', salesController.getSalesReport);
router.get('/sales/top-products', salesController.getTopProducts);
router.get('/sales/by-region', salesController.getSalesByRegion);

// Analytics routes
router.get('/analytics/forecast', analyticsController.getForecast);
router.get('/analytics/segments', analyticsController.getCustomerSegments);
router.get('/analytics/churn', analyticsController.getChurnPrediction);

// Customer routes
router.get('/customers', customerController.getAllCustomers);
router.get('/customers/:id', customerController.getCustomerById);
router.post('/customers', customerController.createCustomer);
router.put('/customers/:id', customerController.updateCustomer);

// Gemini AI routes
router.post('/ai/chat', geminiController.chat);
router.get('/ai/insights', geminiController.generateInsights);

export default router;
