import { Router } from 'express';
import { zapController } from '../controllers/zapController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * Module 2: V3 Mobile Dominance - Alpha Zaps
 */
router.post('/alpha', authMiddleware, zapController.triggerAlpha);

export default router;
