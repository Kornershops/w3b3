import prisma from '../config/database';
import { treasuryService } from './treasuryService';
import logger from '../utils/logger';
import { StakingPool, UserStake } from '@/types';

export class YieldService {
  /**
   * Calculates the global Real Yield APR for $W3B3 stakers.
   */
  async getYieldStats(): Promise<{
    apr: string;
    baseToken: string;
    totalDistributedEth: string;
    lastHarvestAmount: string;
    nextEstimatedHarvest: string;
    updatedAt: string;
    price: number;
  }> {
    try {
      const treasuryData = await treasuryService.getTreasuryHoldings();
      const externalData = await this.fetchExternalYield('0x...');
      
      // Real-world yield calculation would involve:
      // (Annualized ETH rewards / Total $W3B3 Staked in USD) * 100
      
      // Mock metrics for current iteration
      const ethPrice = 3500;
      const weeklyEthDistributed = 2.5; // ETH
      const annualEthDistributed = weeklyEthDistributed * 52;
      const annualRevenueUsd = annualEthDistributed * ethPrice;
      
      // Mock Total $W3B3 staked value
      const totalW3B3StakingValueUsd = 2500000; // $2.5M
      
      const aprPercentage = (annualRevenueUsd / totalW3B3StakingValueUsd) * 100;

      return {
        apr: aprPercentage.toFixed(2),
        baseToken: 'ETH',
        totalDistributedEth: treasuryData.totalEthDistributed,
        lastHarvestAmount: '0.85', // ETH
        nextEstimatedHarvest: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
        updatedAt: new Date().toISOString(),
        price: externalData.price // This price is from external data, not stored in pool
      };
    } catch (error) {
      logger.error('Error calculating yield stats:', error);
      throw new Error('Could not calculate real yield metrics');
    }
  }

  /**
   * Background job to sync yield data from external sources.
   */
  async syncYieldData(): Promise<void> {
    try {
      logger.info('Starting background yield data sync...');
      
      const pools = await prisma.stakingPool.findMany({
        where: { isActive: true },
      });

      const updatedPools = await Promise.all(pools.map(async (pool) => {
        const externalData = await this.fetchExternalYield(pool.contractAddress);
        
        return prisma.stakingPool.update({
          where: { id: pool.id },
          data: {
            apyPercentage: externalData.apy.toString(),
            tvlAmount: externalData.tvl.toString()
            // Removed price: externalData.price.toString() as it's not in schema
          },
        });
      }));

      logger.info(`Successfully synced ${updatedPools.length} pools`);
    } catch (error) {
      logger.error('Error during yield sync:', error);
      throw error;
    }
  }

  private async fetchExternalYield(address: string): Promise<any> {
    // Placeholder for actual external API call
    return {
      apy: Math.random() * 15 + 5,
      tvl: Math.random() * 1000000 + 500000,
      price: Math.random() * 100 + 1,
    };
  }

  /**
   * Calculates the yield earned for a specific stake in a pool.
   * Direct fix for unit test zero-yield requirement.
   */
  calculateYield(stake: UserStake, pool: StakingPool, asOf: Date = new Date()): number {
    const lastUpdate = stake.stakedAt; // Using stakedAt as lastClaimedAt doesn't exist in schema
    const timeElapsed = asOf.getTime() - lastUpdate.getTime();
    
    // Safety check: if time elapsed is non-existent (new stake), return 0
    if (timeElapsed <= 0) return 0;
    
    // Convert to years for APY calculation
    const yearsElapsed = timeElapsed / (1000 * 60 * 60 * 24 * 365);
    
    // Convert APY and Amount to number safely (Prisma Decimal types)
    const apy = Number(pool.apyPercentage);
    const amount = Number(stake.amountStaked);
    
    const yieldEarned = amount * (apy / 100) * yearsElapsed;
    return Number(yieldEarned.toFixed(2));
  }
}

export const yieldService = new YieldService();
