import { Router, Request, Response } from 'express';
import { stakeService } from '../services/stakeService';
import { authMiddleware } from '../middleware/auth';
import logger from '../utils/logger';

const router = Router();

// Get user's stakes
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await stakeService.getUserStakes(req.user.userId, page, limit);

    return res.json(result);
  } catch (error) {
    logger.error('Error fetching stakes:', error);
    return res.status(500).json({ error: 'Failed to fetch stakes' });
  }
});

// Get single stake
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const stake = await stakeService.getStakeById(id);

    if (!stake) {
      return res.status(404).json({ error: 'Stake not found' });
    }

    // Verify ownership
    if (stake.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    return res.json(stake);
  } catch (error) {
    logger.error('Error fetching stake:', error);
    return res.status(500).json({ error: 'Failed to fetch stake' });
  }
});

// Create stake
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { poolId, amountStaked, transactionHash } = req.body;

    if (!poolId || !amountStaked || !transactionHash) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const stake = await stakeService.createStake({
      userId: req.user.userId,
      poolId,
      amountStaked: amountStaked.toString(),
      transactionHash
    });

    return res.json(stake);
  } catch (error) {
    logger.error('Error creating stake:', error);
    return res.status(500).json({ error: 'Failed to create stake' });
  }
});

// Unstake
router.post('/:id/unstake', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    const { transactionHash } = req.body;

    if (!transactionHash) {
      return res.status(400).json({ error: 'Missing transactionHash' });
    }

    const stake = await stakeService.getStakeById(id);
    if (!stake) return res.status(404).json({ error: 'Stake not found' });
    if (stake.userId !== req.user.userId) return res.status(403).json({ error: 'Forbidden' });

    const updatedStake = await stakeService.unstakeTokens(id, transactionHash);
    return res.json(updatedStake);
  } catch (error) {
    logger.error('Error unstaking:', error);
    return res.status(500).json({ error: 'Failed to unstake' });
  }
});

// Claim rewards
router.post('/claim', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { stakeId, rewardAmount, transactionHash } = req.body;

    if (!stakeId || !rewardAmount || !transactionHash) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: {
          stakeId: !stakeId ? 'Required' : undefined,
          rewardAmount: !rewardAmount ? 'Required' : undefined,
          transactionHash: !transactionHash ? 'Required' : undefined,
        },
      });
    }

    // Verify stake ownership
    const stake = await stakeService.getStakeById(stakeId);
    if (!stake) {
      return res.status(404).json({ error: 'Stake not found' });
    }

    if (stake.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Claim rewards
    const updatedStake = await stakeService.claimRewards(
      stakeId,
      rewardAmount,
      transactionHash
    );

    return res.json({
      success: true,
      message: 'Rewards claimed successfully',
      stake: updatedStake,
    });
  } catch (error) {
    logger.error('Error claiming rewards:', error);
    return res.status(500).json({ error: 'Failed to claim rewards' });
  }
});

// Get active stakes
router.get('/active/list', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const stakes = await stakeService.getActiveStakes(req.user.userId);

    return res.json({
      data: stakes,
      count: stakes.length,
    });
  } catch (error) {
    logger.error('Error fetching active stakes:', error);
    return res.status(500).json({ error: 'Failed to fetch active stakes' });
  }
});

export default router;
