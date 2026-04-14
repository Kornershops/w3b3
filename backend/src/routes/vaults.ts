import { Router } from 'express';
import { vaultController } from '../controllers/vaultController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * Phase 12: Institutional Custody & Multi-Sig Rails
 */
router.post('/create', authMiddleware, vaultController.createVault);
router.get('/my', authMiddleware, vaultController.getMyVaults);
router.post('/propose', authMiddleware, vaultController.propose);
router.post('/approve', authMiddleware, vaultController.approve);

export default router;
