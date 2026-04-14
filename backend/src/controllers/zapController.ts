import { Request, Response } from 'express';
import { zapOrchestratorService } from '../services/zapOrchestratorService';
import logger from '../utils/logger';

/**
 * ZapController
 * Handles high-fidelity, one-tap DeFi entry points.
 */
export class ZapController {
  /**
   * Triggers an Alpha Zap orchestration.
   */
  async triggerAlpha(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const zapData = req.body;

      if (!zapData.poolId || !zapData.strategyId || !zapData.amount || !zapData.transactionHash) {
        return res.status(400).json({ error: 'Missing required zap parameters.' });
      }

      const result = await zapOrchestratorService.executeAlphaZap(userId, zapData);
      return res.json(result);
    } catch (error: any) {
      logger.error('ZapController triggerAlpha Error:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}

export const zapController = new ZapController();
