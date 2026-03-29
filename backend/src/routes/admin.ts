import { Router, Request, Response } from 'express';
import { poolService } from '../services/poolService';
import { authAdminMiddleware } from '../middleware/auth';
import logger from '../utils/logger';

const router = Router();

// Apply admin role validation across the entire sub-router
router.use(authAdminMiddleware);

// Create a new Staking Pool
router.post('/pools', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    
    if (!data.name || !data.chainId || !data.contractAddress || !data.tokenSymbol) {
      return res.status(400).json({ error: 'Missing required pool fields' });
    }

    const pool = await poolService.createPool(data);
    return res.status(201).json(pool);
  } catch (error) {
    logger.error('Error creating pool:', error);
    return res.status(500).json({ error: 'Failed to create pool' });
  }
});

// Update an existing Pool
router.put('/pools/:id', async (req: Request, res: Response) => {
  try {
    const poolId = req.params.id;
    const data = req.body;

    const pool = await poolService.updatePool(poolId, data);
    return res.json(pool);
  } catch (error) {
    logger.error(`Error updating pool ${req.params.id}:`, error);
    return res.status(500).json({ error: 'Failed to update pool' });
  }
});

// Deactivate a Pool (Soft Delete)
router.delete('/pools/:id', async (req: Request, res: Response) => {
  try {
    const poolId = req.params.id;
    const pool = await poolService.deactivatePool(poolId);
    return res.json({ message: 'Pool deactivated successfully', pool });
  } catch (error) {
    logger.error(`Error deactivating pool ${req.params.id}:`, error);
    return res.status(500).json({ error: 'Failed to deactivate pool' });
  }
});

export default router;
