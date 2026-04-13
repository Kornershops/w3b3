import { Router } from 'express';
import { recursiveController } from '../controllers/recursiveController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * Phase 13: Recursive Yield & Capital Efficiency Routes
 */
router.get('/', recursiveController.getStrategies);
router.post('/simulate', authenticate, recursiveController.simulateAction);

export default router;
