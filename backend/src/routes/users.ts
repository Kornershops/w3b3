import { Router, Request, Response } from 'express';
import logger from '../utils/logger';
import prisma from '../config/database';

const router = Router();

// Leaderboard Gamification Endpoint
router.get('/leaderboard', async (req: Request, res: Response) => {
  try {
    // Top 50 Users by accumulated Referral Points
    const leaders = await prisma.user.findMany({
      take: 50,
      orderBy: { points: 'desc' },
      select: {
        id: true,
        walletAddress: true,
        points: true,
        createdAt: true
      }
    });

    return res.json(leaders);
  } catch (error) {
    logger.error('Error fetching leaderboard:', error);
    return res.status(500).json({ error: 'Failed to generate leaderboard' });
  }
});

// Single User profile endpoint
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    // Assuming authentication context has already parsed `req.user`
    // but typically we'll pull it from the token manually here if `authMiddleware` is optional
    return res.status(200).json({ message: 'Profile details accessible securely' });
  } catch (error) {
    logger.error('Error fetching profile:', error);
    return res.status(500).json({ error: 'Failed to fetch user context' });
  }
});

export default router;
