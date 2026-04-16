import { Router, Request, Response } from 'express';
import { poolService } from '../services/poolService';
import { optionalAuthMiddleware } from '../middleware/auth';
import logger from '../utils/logger';
import prisma from '../config/database';
import { seed } from '../utils/bootstrap';

const router = Router();

// Get all pools
router.get('/', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    // Safety check: only parse chainId if it exists and is a valid number string
    const chainParam = req.query.chain as string;
    const chainId = (chainParam && !isNaN(parseInt(chainParam))) ? parseInt(chainParam) : undefined;

    let result = await poolService.getPools({ chainId, isActive: true }, page, limit);

    // If database is completely empty (first run), auto-seed to provide immediate value
    if (result.count === 0 && !chainId) {
        const totalCount = await prisma.stakingPool.count();
        if (totalCount === 0) {
            logger.info('Database empty, performing automatic boot-sequence seed...');
            await seed(prisma);
            result = await poolService.getPools({ isActive: true }, page, limit);
        }
    }

    return res.json(result);
  } catch (error) {
    logger.error('Error fetching pools:', error);
    return res.status(500).json({ error: 'Failed to fetch pools' });
  }
});

// Get pool by ID
router.get('/:id', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const pool = await poolService.getPoolById(id);

    if (!pool) {
      return res.status(404).json({ error: 'Pool not found' });
    }

    return res.json(pool);
  } catch (error) {
    logger.error('Error fetching pool:', error);
    return res.status(500).json({ error: 'Failed to fetch pool' });
  }
});

// Get pool APY
router.get('/:id/apy', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const pool = await poolService.getPoolById(id);

    if (!pool) {
      return res.status(404).json({ error: 'Pool not found' });
    }

    return res.json({
      poolId: id,
      currentApy: pool.apyPercentage,
      lastUpdated: pool.updatedAt,
    });
  } catch (error) {
    logger.error('Error fetching pool APY:', error);
    return res.status(500).json({ error: 'Failed to fetch pool APY' });
  }
});

// Get pools by chain
router.get('/chain/:chainId', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { chainId } = req.params;

    const pools = await poolService.getPoolsByChain(parseInt(chainId));

    return res.json({
      data: pools,
      count: pools.length,
    });
  } catch (error) {
    logger.error('Error fetching pools by chain:', error);
    return res.status(500).json({ error: 'Failed to fetch pools' });
  }
});

// Get top pools by APY
router.get('/top/apy', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const pools = await poolService.getTopPoolsByApy(limit);

    return res.json({
      data: pools,
      count: pools.length,
    });
  } catch (error) {
    logger.error('Error fetching top pools:', error);
    return res.status(500).json({ error: 'Failed to fetch top pools' });
  }
});

// Get pool statistics
router.get('/stats/all', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const stats = await poolService.getPoolStats();

    return res.json(stats);
  } catch (error) {
    logger.error('Error fetching pool stats:', error);
    return res.status(500).json({ error: 'Failed to fetch pool stats' });
  }
});

export default router;
