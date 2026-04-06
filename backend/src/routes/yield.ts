import { Router, Request, Response } from 'express';
import { yieldService } from '../services/yieldService';
import logger from '../utils/logger';

const router = Router();

/**
 * @api {get} /api/yield/stats Get Global Real Yield Analytics
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await yieldService.getYieldStats();
    return res.json(stats);
  } catch (error) {
    logger.error('Error fetching yield stats:', error);
    return res.status(500).json({ error: 'Failed to fetch platform yield metrics' });
  }
});

export default router;
