import { Router, Request, Response } from 'express';
import { governanceService } from '../services/governanceService';
import { authMiddleware } from '../middleware/auth';
import logger from '../utils/logger';

const router = Router();

/**
 * @api {get} /api/governance/power Get User Voting Power & Tier
 */
router.get('/power', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const power = await governanceService.getVotingPower(userId);
    const multiplier = await governanceService.getYieldMultiplier(userId);
    
    return res.json({ power, multiplier });
  } catch (error) {
    logger.error('Error fetching governance power:', error);
    return res.status(500).json({ error: 'Failed to fetch governance metrics' });
  }
});

/**
 * @api {post} /api/governance/vote Cast a Community Mandate
 */
router.post('/vote', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { poolId, weight } = req.body;
    const result = await governanceService.castVote(userId, poolId, weight);
    return res.json(result);
  } catch (error) {
    logger.error('Error casting vote:', error);
    return res.status(500).json({ error: 'Failed to broadcast mandate' });
  }
});

export default router;
