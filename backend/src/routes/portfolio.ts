import { Router, Request, Response } from 'express';
import { portfolioService } from '../services/portfolioService';
import { authMiddleware } from '../middleware/auth';
import logger from '../utils/logger';

const router = Router();

// Get portfolio summary
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const portfolio = await portfolioService.getPortfolioSummary(req.user.userId);

    res.json(portfolio);
  } catch (error) {
    logger.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

// Get portfolio breakdown
router.get('/breakdown', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const breakdown = await portfolioService.getPortfolioBreakdown(req.user.userId);

    res.json(breakdown);
  } catch (error) {
    logger.error('Error fetching portfolio breakdown:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio breakdown' });
  }
});

// Get portfolio history
router.get('/history', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const history = await portfolioService.getPortfolioHistory(req.user.userId, page, limit);

    res.json(history);
  } catch (error) {
    logger.error('Error fetching portfolio history:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio history' });
  }
});

export default router;
