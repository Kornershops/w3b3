import { Router, Request, Response } from 'express';
import { authService } from '../services/authService';
import { authMiddleware, generateToken, setTokenCookies } from '../middleware/auth';
import logger from '../utils/logger';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

import { JwtPayload } from '../types';

const router = Router();

// Connect Wallet Router
router.post('/connect', async (req: Request, res: Response): Promise<Response> => {
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

    // Set HttpOnly Cookies
    setTokenCookies(res, response.token, response.refreshToken);

    return res.json(response);
  } catch (error) {
    logger.error('Error connecting wallet:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
    return res.status(401).json({ error: errorMessage });
  }
});

// Get current user
router.get('/user', authMiddleware, async (req: Request, res: Response): Promise<Response> => {
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
router.post('/logout', (req: Request, res: Response): Response => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return res.json({ message: 'Logged out successfully' });
});

// Refresh Token
router.post('/refresh', async (req: Request, res: Response): Promise<Response> => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret as string) as JwtPayload;
    const newToken = generateToken(decoded.userId, decoded.walletAddress, decoded.role);

    // Update Access Token Cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', newToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 15 * 60 * 1000,
    });

    return res.json({ token: newToken });
  } catch (error) {
    logger.error('Error refreshing token:', error);
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

export default router;
