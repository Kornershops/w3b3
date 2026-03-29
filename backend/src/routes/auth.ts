import { Router, Request, Response } from 'express';
import { authService } from '../services/authService';
import { authMiddleware } from '../middleware/auth';
import logger from '../utils/logger';

const router = Router();

// Connect Wallet Router
router.post('/connect', async (req: Request, res: Response) => {
  try {
    const { walletAddress, signature, message, referralCode } = req.body;

    if (!walletAddress || !signature || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate wallet address
    const isValidAddress = await authService.validateWalletAddress(walletAddress);
    if (!isValidAddress) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    // Authenticate with optional referral
    const response = await authService.authenticate(
      walletAddress, 
      message, 
      signature, 
      referralCode
    );

    return res.json(response);
  } catch (error) {
    logger.error('Error connecting wallet:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
    return res.status(401).json({ error: errorMessage });
  }
});

// Get current user
router.get('/user', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.json({
      userId: req.user.userId,
      walletAddress: req.user.walletAddress,
    });
  } catch (error) {
    logger.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Logout
router.post('/logout', authMiddleware, async (req: Request, res: Response) => {
  try {
    // In a real app, you might invalidate the token here
    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Error logging out:', error);
    return res.status(500).json({ error: 'Failed to logout' });
  }
});

// Refresh Token
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Verify using the dedicated refresh secret
    const jwt = require('jsonwebtoken');
    const { config } = require('../config/env');
    const { generateToken } = require('../middleware/auth');
    
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret as string);
    const newToken = generateToken(decoded.userId, decoded.walletAddress, decoded.role);

    return res.json({ token: newToken });
  } catch (error) {
    logger.error('Error refreshing token:', error);
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

export default router;
