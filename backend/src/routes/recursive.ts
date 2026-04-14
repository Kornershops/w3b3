import { Router } from 'express';
import { recursiveController } from '../controllers/recursiveController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * Phase 13: Recursive Yield & Capital Efficiency Routes
 */
router.get('/', recursiveController.getStrategies);
router.post('/simulate', authMiddleware, recursiveController.simulateAction);

export default router;
