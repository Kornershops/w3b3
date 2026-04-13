import { Request, Response } from 'express';
import { recursiveYieldService } from '../services/recursiveYieldService';

/**
 * RecursiveController
 * Exposes alpha-generating yield strategies to the platform users.
 */
export class RecursiveController {
  async getStrategies(req: Request, res: Response) {
    try {
      const strategies = await recursiveYieldService.getActiveStrategies();
      res.json(strategies);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async simulateAction(req: Request, res: Response) {
    const { strategyId, amount, leverage } = req.body;
    const userId = (req as any).user.id;

    try {
      const simulation = await recursiveYieldService.simulateLoop(userId, strategyId, amount, leverage);
      res.json(simulation);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const recursiveController = new RecursiveController();
