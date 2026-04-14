import { Router } from 'express';
import { treasuryController } from '../controllers/treasuryController';
import { authMiddleware, authAdminMiddleware } from '../middleware/auth';

const router = Router();

/**
 * Module 1: Institutional Alpha - Treasury & Revenue Routing
 */

// Public/User metrics (Authenticated)
router.get('/status', authMiddleware, treasuryController.getStatus);

// Admin-restricted harvesting trigger
router.post('/harvest', authAdminMiddleware, treasuryController.triggerHarvest);

export default router;
