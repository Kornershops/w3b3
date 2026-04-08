import prisma from '../config/database';
import { treasuryService } from './treasuryService';
import logger from '../utils/logger';
import { StakingPool, UserStake } from '@/types';
import { priceService } from './priceService';

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
      
      // Calculate real total staked $W3B3 value
      const stakes = await prisma.userStake.findMany();
      const totalW3B3Staked = stakes.reduce((acc, s) => acc + Number(s.amountStaked), 0);
      
      // Fetch Live Prices
      const ethPrice = await priceService.getPrice('ethereum');
      const w3b3Price = await priceService.getPrice('w3b3'); // Uses fallback if not on list
      
      const totalW3B3StakingValueUsd = totalW3B3Staked * w3b3Price;
      
      // In a real scenario, weeklyEthDistributed would come from indexing Treasury harvest events
      // For this alpha, we estimate based on the current treasury native balance if it's > 0
      const currentNativeEth = parseFloat(treasuryData.assets.find(a => a.symbol === 'ETH')?.balance || '0');
      const weeklyEthDistributed = currentNativeEth > 0 ? currentNativeEth / 4 : 2.5; // Baseline if empty
      
      const annualEthDistributed = weeklyEthDistributed * 52;
      const annualRevenueUsd = annualEthDistributed * ethPrice;
      
      // Prevent division by zero
      const aprPercentage = totalW3B3StakingValueUsd > 0 
        ? (annualRevenueUsd / totalW3B3StakingValueUsd) * 100 
        : 0;

      return {
        apr: aprPercentage.toFixed(2),
        baseToken: 'ETH',
        totalDistributedEth: treasuryData.totalEthDistributed,
        lastHarvestAmount: '0.85', // TODO: Fetch from actual contract event log
        nextEstimatedHarvest: new Date(Date.now() + 86400000 * 3).toISOString(),
        updatedAt: new Date().toISOString(),
        price: w3b3Price
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

  private async fetchExternalYield(_address: string): Promise<any> {
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
    // Structural Fix: Use integer seconds to prevent millisecond drift in CI environments
    const nowSeconds = Math.floor(asOf.getTime() / 1000);
    // Structural Fix: Handle Date as string from Shared DTO
    const stakeDate = typeof stake.stakedAt === 'string' ? new Date(stake.stakedAt) : stake.stakedAt;
    const stakeSeconds = Math.floor((stakeDate as Date).getTime() / 1000);
    const timeElapsedSeconds = nowSeconds - stakeSeconds;
    
    // Safety check: if time elapsed is non-existent (new stake), return 0
    if (timeElapsedSeconds <= 0) return 0;
    
    // Convert to years for APY calculation
    const yearsElapsed = timeElapsedSeconds / (60 * 60 * 24 * 365);
    
    // Convert APY and Amount to number safely (Prisma Decimal types)
    const apy = Number(pool.apyPercentage);
    const amount = Number(stake.amountStaked);
    
    const yieldEarned = amount * (apy / 100) * yearsElapsed;
    return Number(yieldEarned.toFixed(2));
  }
}

export const yieldService = new YieldService();
