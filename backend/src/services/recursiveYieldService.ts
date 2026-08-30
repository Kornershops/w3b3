import { RecursiveStrategy } from '@w3b3/shared';
import { priceService } from './priceService';
import prisma from '../config/database';
import logger from '../utils/logger';

/**
 * RecursiveYieldService
 * High-performance engine for calculating and executing recursive yield strategies (Leveraged LST Looping).
 */
export class RecursiveYieldService {
  calculateNetApy(baseYield: number, borrowCost: number, leverage: number, fee: number = 0.05): number {
    const grossYield = baseYield * leverage;
    const interestExpense = borrowCost * (leverage - 1);
    const netYieldBeforeFee = grossYield - interestExpense;
    return netYieldBeforeFee * (1 - fee);
  }

  /**
   * Simulates a Loop action to verify health factors before on-chain execution.
   * This is advisory simulation only; transaction execution must enforce the same limits on-chain.
   */
  async simulateLoop(userId: string, strategyId: string, amount: string, targetLeverage: number) {
    if (!userId) throw new Error('Authenticated user required');
    if (!strategyId) throw new Error('Strategy ID required');

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      throw new Error('Amount must be a positive finite number');
    }
    if (!Number.isFinite(targetLeverage) || targetLeverage <= 0) {
      throw new Error('Leverage must be a positive finite number');
    }

    try {
      const strategies = await this.getActiveStrategies();
      const strategy = strategies.find(s => s.id === strategyId);
      if (!strategy) throw new Error('Strategy not found');
      if (targetLeverage > strategy.maxLeverage) {
        throw new Error('Requested leverage exceeds strategy maximum');
      }

      const baseAssetId = strategy.baseAsset.toLowerCase() === 'eth' ? 'ethereum' :
                        strategy.baseAsset.toLowerCase() === 'sol' ? 'solana' : 'usd-coin';
      const basePrice = await priceService.getPrice(baseAssetId);

      const pool = await prisma.stakingPool.findFirst({
        where: { tokenSymbol: strategy.targetAsset, isActive: true },
      });

      const targetYield = pool ? Number(pool.apyPercentage) / 100 : 0.05;
      const borrowRate = strategy.baseAsset === 'USDC' ? 0.08 : 0.035;
      const projectedApy = this.calculateNetApy(targetYield, borrowRate, targetLeverage);
      const ltv = strategy.metadata?.liquidationThreshold || 0.8;
      const denominator = targetLeverage - 1 + ltv;
      const healthFactor = denominator > 0 ? 1 / (ltv * targetLeverage / denominator) : Number.POSITIVE_INFINITY;

      return {
        canExecute: healthFactor > 1.12,
        projectedApy: Number((projectedApy * 100).toFixed(2)),
        healthFactor: Number(healthFactor.toFixed(2)),
        liquidationPrice: basePrice * (ltv * 1.05),
        marketContext: {
          assetPrice: basePrice,
          baseYield: (targetYield * 100).toFixed(2),
          borrowRate: (borrowRate * 100).toFixed(2),
          requestedLeverage: targetLeverage,
          maximumLeverage: strategy.maxLeverage,
        }
      };
    } catch (error) {
      logger.error('Simulation Failed:', error);
      throw error;
    }
  }

  async getActiveStrategies(): Promise<RecursiveStrategy[]> {
    const stEthPool = await prisma.stakingPool.findFirst({ where: { tokenSymbol: 'stETH' } });
    const w3usdPool = await prisma.stakingPool.findFirst({ where: { tokenSymbol: 'USDC' } });

    return [
      {
        id: 'strat-eth-001',
        name: 'ETH LST Recursive Loop',
        baseAsset: 'ETH',
        targetAsset: 'stETH',
        maxLeverage: 3.5,
        currentLeverage: 2.5,
        estimatedNetApy: 8.2,
        totalLiquidity: '14500000',
        riskScore: 'MEDIUM',
        isActive: true,
        metadata: {
          poolId: stEthPool?.id || 'default-eth',
          liquidationThreshold: 0.85,
          healthFactor: 1.42,
          rebalanceFrequency: '24h',
        }
      },
      {
        id: 'strat-stable-001',
        name: 'Delta-Neutral Stable Yield',
        baseAsset: 'USDC',
        targetAsset: 'USDC',
        maxLeverage: 1.0,
        currentLeverage: 1.0,
        estimatedNetApy: 12.5,
        totalLiquidity: '5200000',
        riskScore: 'LOW',
        isActive: true,
        metadata: {
          poolId: w3usdPool?.id || 'default-stable',
          liquidationThreshold: 0.95,
          healthFactor: 1.95,
          rebalanceFrequency: 'Hourly',
        }
      }
    ];
  }
}

export const recursiveYieldService = new RecursiveYieldService();
