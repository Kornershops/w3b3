import { Router, Request, Response } from 'express';
import { authService } from '../services/authService';
import { authMiddleware } from '../middleware/auth';
import logger from '../utils/logger';

const router = Router();

// Connect wallet
router.post('/connect', async (req: Request, res: Response) => {
  try {
    const { walletAddress, signature, message } = req.body;

    // Validate inputs
    if (!walletAddress || !signature || !message) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: {
          walletAddress: !walletAddress ? 'Required' : undefined,
          signature: !signature ? 'Required' : undefined,
          message: !message ? 'Required' : undefined,
        },
      });
    }

    // Validate wallet address
    const isValidAddress = await authService.validateWalletAddress(walletAddress);
    if (!isValidAddress) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    // Validate message
    const isValidMessage = await authService.validateMessage(message);
    if (!isValidMessage) {
      return res.status(400).json({ error: 'Invalid message' });
    }

    // Validate signature
    const isValidSignature = await authService.validateSignature(signature);
    if (!isValidSignature) {
      return res.status(400).json({ error: 'Invalid signature format' });
    }

    // Authenticate
    const response = await authService.authenticate(walletAddress, message, signature);

    res.json(response);
  } catch (error) {
    logger.error('Error connecting wallet:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
    res.status(401).json({ error: errorMessage });
  }
});

// Get current user
router.get('/user', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    res.json({
      userId: req.user.userId,
      walletAddress: req.user.walletAddress,
    });
  } catch (error) {
    logger.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Logout
router.post('/logout', authMiddleware, async (req: Request, res: Response) => {
  try {
    // In a real app, you might invalidate the token here
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Error logging out:', error);
    res.status(500).json({ error: 'Failed to logout' });
  }
});

export default router;
