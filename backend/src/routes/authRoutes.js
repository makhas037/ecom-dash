import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Defines the POST route for /api/auth/register
router.post('/register', registerUser);

// Defines the POST route for /api/auth/login
router.post('/login', loginUser);

export default router;
