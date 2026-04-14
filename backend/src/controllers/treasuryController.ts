import { Request, Response } from 'express';
import { treasuryService } from '../services/treasuryService';
import { revenueRouterService } from '../services/revenueRouterService';
import logger from '../utils/logger';

/**
 * TreasuryController
 * Exposes protocol health and algorithmic harvesting triggers.
 */
export class TreasuryController {
  /**
   * Returns high-fidelity protocol health metrics.
   */
  async getStatus(req: Request, res: Response) {
    try {
      const status = await treasuryService.getTreasuryHoldings();
      res.json(status);
    } catch (error: any) {
      logger.error('TreasuryController getStatus Error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Triggers the algorithmic fee harvest cycle.
   * Restricted to Admin/Service accounts in production.
   */
  async triggerHarvest(req: Request, res: Response) {
    try {
      const result = await revenueRouterService.harvestFees();
      res.json(result);
    } catch (error: any) {
      logger.error('TreasuryController triggerHarvest Error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

export const treasuryController = new TreasuryController();
