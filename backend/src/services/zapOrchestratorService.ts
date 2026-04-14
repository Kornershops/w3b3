import { ethers } from 'ethers';
import logger from '../utils/logger';
import { stakeService } from './stakeService';
import { recursiveYieldService } from './recursiveYieldService';

/**
 * Module 2: V3 Mobile Dominance (Alpha Channel)
 * ZapOrchestratorService - Orchestrates complex multi-step DeFi transactions (Zap) 
 * into a simplified high-fidelity user experience.
 */
export class ZapOrchestratorService {
  /**
   * Orchestrates a "Alpha Zap" - One-tap entry into a leveraged recursive strategy.
   * Internal Flow: Base Stake -> Strategy Attachment -> Leveraged Loop.
   */
  async executeAlphaZap(userId: string, zapData: {
    poolId: string;
    strategyId: string;
    amount: string;
    leverage: number;
    transactionHash: string;
  }) {
    try {
      logger.info(`ZapOrchestrator: Initiating Alpha Zap for User [${userId}] on Pool [${zapData.poolId}]`);

      // 1. Execute & Record the Base Staking Action
      const stake = await stakeService.createStake({
        userId,
        poolId: zapData.poolId,
        amountStaked: zapData.amount,
        transactionHash: zapData.transactionHash
      });

      // 2. Attach and execute the Recursive Yield Strategy (Leveraged Loop)
      const loopResult = await recursiveYieldService.simulateLoop(
        userId,
        zapData.strategyId,
        zapData.amount,
        zapData.leverage
      );

      logger.info(`ZapOrchestrator: Alpha Zap successful. Stake ID: [${stake.id}]`);

      return {
        success: true,
        stakeId: stake.id,
        strategyAttached: zapData.strategyId,
        projectedApy: loopResult.projectedApy,
        status: 'ALPHA_ZAP_COMPLETED'
      };
    } catch (error) {
      logger.error('ZapOrchestrator: Alpha Zap orchestration failed:', error);
      throw error;
    }
  }
}

export const zapOrchestratorService = new ZapOrchestratorService();
