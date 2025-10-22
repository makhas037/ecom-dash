// backend/src/routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Defines the POST route for http://localhost:5001/api/auth/register
router.post('/register', registerUser);

// Defines the POST route for http://localhost:5001/api/auth/login
router.post('/login', loginUser);

export default router;
