import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticate, getCurrentUser);

// Google OAuth - placeholder
router.get('/google', (req, res) => {
  res.status(501).json({ 
    error: 'Google OAuth not configured yet',
    message: 'Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env'
  });
});

router.get('/google/callback', (req, res) => {
  res.redirect('/login?error=google_not_configured');
});

export default router;
