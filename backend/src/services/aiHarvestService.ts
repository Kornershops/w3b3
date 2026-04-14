import { StakingPool } from '../types';
import prisma from '../config/database';
import logger from '../utils/logger';

export class AIHarvestService {
  /**
   * Analyzes active staking pools and recommends the optimal rebalancing 
   * specifically based on shifting APY factors and gas efficiency.
   */
  async getHarvestRecommendations(userId: string) {
    try {
      // 1. Fetch user's active stakes
      const userStakes = await prisma.userStake.findMany({
        where: { userId, isActive: true },
        include: { pool: true }
      });

      // 2. Fetch all competitive market pools
      const allPools = await prisma.stakingPool.findMany({
        where: { isActive: true },
        orderBy: { apyPercentage: 'desc' }
      });

      const recommendations: any[] = [];

      // 3. AI/Algorithmic Evaluation Logic
      for (const stake of userStakes) {
        if (!stake.pool) continue;
        
        const currentApy = parseFloat(stake.pool.apyPercentage.toString());
        
        // Find best alternative pool on the same chain (to minimize bridging fees)
        const bestAlternative = allPools.find(p => 
            p.chainId === stake.pool.chainId && 
            p.id !== stake.pool.id && 
            parseFloat(p.apyPercentage.toString()) > currentApy * 1.15 // at least 15% better
        );

        if (bestAlternative) {
            recommendations.push({
                action: 'REBALANCE',
                currentPoolId: stake.pool.id,
                currentApy: currentApy,
                targetPoolId: bestAlternative.id,
                targetApy: parseFloat(bestAlternative.apyPercentage.toString()),
                estimatedGasGwei: 25, // Mock gas estimate
                reasoning: `Alternative pool offers a significantly higher APY (+${(parseFloat(bestAlternative.apyPercentage.toString()) - currentApy).toFixed(2)}%) on the same chain.`
            });
        }
      }

      // If no immediate rebalances, recommend auto-compounding
      if (recommendations.length === 0 && userStakes.length > 0) {
          recommendations.push({
              action: 'COMPOUND',
              reasoning: 'Your current positions are optimally placed based on current market rates. Auto-compounding is recommended to maximize yield.'
          });
      }

      return recommendations;
    } catch (error) {
      logger.error('Error in AI Harvest Service:', error);
      throw error;
    }
  }
}

export const aiHarvestService = new AIHarvestService();
