import express from 'express';
import { getRoot, getHealth } from '../controllers/systemController.js';
import { getSalesSummary, getSalesReport, getTopProducts } from '../controllers/salesController.js';
import { getCustomers } from '../controllers/customerController.js';
import { handleGeminiChat } from '../controllers/chatController.js';

const router = express.Router();

// --- System Routes ---
// Provides basic API info and health status.
router.get('/', getRoot);
router.get('/health', getHealth);

// --- Sales Data Routes ---
// Endpoints for aggregated sales metrics and reports.
router.get('/sales/summary', getSalesSummary);
router.get('/sales/report', getSalesReport);
router.get('/sales/top-products', getTopProducts);

// --- Customer Data Routes ---
// Endpoint to retrieve customer information.
router.get('/customers', getCustomers);

// --- AI Chat Route ---
// Endpoint for interacting with the Gemini-powered chat assistant.
router.post('/chat/gemini', handleGeminiChat);

export default router;
