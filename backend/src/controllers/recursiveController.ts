import { Request, Response } from 'express';
import { recursiveYieldService } from '../services/recursiveYieldService';

/**
 * RecursiveController
 * Exposes alpha-generating yield strategies to platform users.
 */
export class RecursiveController {
  async getStrategies(req: Request, res: Response): Promise<void> {
    try {
      const strategies = await recursiveYieldService.getActiveStrategies();
      res.json(strategies);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async simulateAction(req: Request, res: Response): Promise<void> {
    const { strategyId, amount, leverage } = req.body;
    const userId = (req as any).user?.id;

    if (!userId || typeof strategyId !== 'string' || strategyId.trim() === '') {
      res.status(400).json({ error: 'strategyId and authenticated user are required' });
      return;
    }

    const parsedAmount = typeof amount === 'string' ? amount.trim() : amount;
    const parsedLeverage = typeof leverage === 'string' ? Number(leverage) : leverage;

    if ((typeof parsedAmount !== 'string' && typeof parsedAmount !== 'number') ||
        !Number.isFinite(Number(parsedAmount)) || Number(parsedAmount) <= 0) {
      res.status(400).json({ error: 'amount must be a positive finite number' });
      return;
    }

    if (!Number.isFinite(parsedLeverage) || parsedLeverage <= 0) {
      res.status(400).json({ error: 'leverage must be a positive finite number' });
      return;
    }

    try {
      const simulation = await recursiveYieldService.simulateLoop(
        userId,
        strategyId,
        String(parsedAmount),
        parsedLeverage,
      );
      res.json(simulation);
    } catch (error: any) {
      const status = error.message === 'Strategy not found' || error.message === 'Requested leverage exceeds strategy maximum'
        ? 400
        : 500;
      res.status(status).json({ error: error.message });
    }
  }
}

export const recursiveController = new RecursiveController();
