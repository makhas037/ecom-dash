import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Internal module imports from our new structure
import apiRouter from './src/routes/api.js';
import { loadKaggleData, getKaggleData } from './src/services/dataService.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { logServerStatus } from './src/utils/logger.js';

// Initialize environment variables from .env file
dotenv.config();

const app = express();
const httpServer = createServer(app);

// NOTE: Socket.io is initialized but not actively used in the provided routes.
// It is ready for future real-time features.
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

// --- Global Middleware Setup ---
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logs HTTP requests to the console

// --- Routing ---
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.use('/api', apiRouter); // All API routes are handled by our main router

// --- Centralized Error Handling ---
// Handles 404 for any routes not matched above
app.use('*', (req, res) => {
  res.status(404).json({ error: `Route not found: ${req.originalUrl}` });
});
// Custom error handler for all other errors
app.use(errorHandler);

// --- Server Startup Logic ---
async function startServer() {
  try {
    await loadKaggleData(); // Load data into memory before starting
    httpServer.listen(PORT, () => {
      logServerStatus(PORT, getKaggleData(), process.env.GEMINI_API_KEY);
    });
  } catch (error) {
    console.error('❌ FATAL: Could not start server.');
    console.error(error);
    process.exit(1); // Exit if the server can't start (e.g., data fails to load)
  }
}

startServer();

export default app;
