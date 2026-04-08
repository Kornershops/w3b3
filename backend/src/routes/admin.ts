import { Router, Request, Response } from 'express';
import { poolService } from '../services/poolService';
import { authAdminMiddleware } from '../middleware/auth';
import { seed } from '../utils/bootstrap';
import prisma from '../config/database';
import logger from '../utils/logger';

const router = Router();

/**
 * @route   POST /api/admin/bootstrap-data
 * @desc    Internally triggers the database seeding logic.
 * @access  Private (Admin Secret required)
 */
router.post('/bootstrap-data', async (req: Request, res: Response) => {
  const adminSecret = req.headers['x-admin-secret'];

  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    logger.warn(`Unauthorized bootstrap attempt from IP: ${req.ip}`);
    return res.status(401).json({ error: 'Unauthorized. Invalid Admin Secret.' });
  }

  try {
    logger.info('Admin triggered database bootstrap...');
    await seed(prisma);
    
    return res.status(200).json({ 
      status: 'success', 
      message: 'Database seeded successfully with initial staking pools.' 
    });
  } catch (error) {
    logger.error('Bootstrap failed:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: 'Failed to seed database.',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Apply admin role validation for standard CRUD operations
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
