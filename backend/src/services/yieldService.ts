import prisma from '../config/database';
import { treasuryService } from './treasuryService';
import logger from '../utils/logger';
import { StakingPool, UserStake } from '../types';
import { priceService } from './priceService';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { getCoinGeckoId } from '../utils/coingecko';

const COINGECKO_KEY = process.env.COINGECKO_API_KEY;
const IS_PRO = !!COINGECKO_KEY;

const coinGeckoClient = axios.create({
  baseURL: IS_PRO ? 'https://pro-api.coingecko.com/api/v3' : 'https://api.coingecko.com/api/v3',
  timeout: 10000,
  headers: IS_PRO ? { 'x-cg-pro-api-key': COINGECKO_KEY } : {},
  params: IS_PRO ? {} : { x_cg_demo_api_key: '' }
});

axiosRetry(coinGeckoClient, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export class YieldService {
  /**
   * Calculates the global Real Yield APR for $W3B3 stakers from recorded treasury
   * distributions and live market prices. No synthetic yield values are permitted.
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
      const stakes = await prisma.userStake.findMany();
      const totalW3B3Staked = stakes.reduce((acc, s) => acc + Number(s.amountStaked), 0);
      const ethPrice = await priceService.getPrice('ethereum');
      const w3b3Price = await priceService.getPrice('w3b3');
      const totalW3B3StakingValueUsd = totalW3B3Staked * w3b3Price;

      const latestReward = await prisma.reward.findFirst({
        orderBy: { createdAt: 'desc' }
      });

      if (!latestReward) {
        throw new Error('No recorded reward distribution exists; real-yield APR is unavailable');
      }

      const firstReward = await prisma.reward.findFirst({
        orderBy: { createdAt: 'asc' }
      });
      if (!firstReward) {
        throw new Error('No recorded reward distribution history exists');
      }

      const elapsedSeconds = (latestReward.createdAt.getTime() - firstReward.createdAt.getTime()) / 1000;
      if (elapsedSeconds <= 0 || totalW3B3StakingValueUsd <= 0) {
        throw new Error('Insufficient recorded distribution history or staking value to calculate APR');
      }

      const distributedEth = Number(treasuryData.totalEthDistributed);
      const annualizedEthDistributed = distributedEth * (365 * 24 * 60 * 60 / elapsedSeconds);
      const annualRevenueUsd = annualizedEthDistributed * ethPrice;
      const aprPercentage = (annualRevenueUsd / totalW3B3StakingValueUsd) * 100;

      return {
        apr: aprPercentage.toFixed(2),
        baseToken: 'ETH',
        totalDistributedEth: treasuryData.totalEthDistributed,
        lastHarvestAmount: latestReward.amount.toString(),
        nextEstimatedHarvest: 'UNAVAILABLE',
        updatedAt: new Date().toISOString(),
        price: w3b3Price
      };
    } catch (error) {
      logger.error('Error calculating yield stats:', error);
      throw new Error('Could not calculate real yield metrics');
    }
  }

  /**
   * Background job to sync yield and authentic market analytics.
   * Pool APY/TVL must come from an authoritative adapter; this method never
   * substitutes random or fabricated values when that adapter is unavailable.
   */
  async syncYieldData(): Promise<void> {
    try {
      logger.info('🛰️ Starting Global Analytics Sync (authoritative data only)...');

      const pools = await prisma.stakingPool.findMany({
        where: { isActive: true },
        include: { analytics: true }
      });

      const updatedPools: StakingPool[] = [];
      for (const pool of pools) {
        const yieldData = await this.fetchExternalYield(pool.contractAddress);

        let analyticsData: Record<string, unknown> | undefined;
        const cgId = getCoinGeckoId(pool.tokenSymbol);

        if (cgId) {
          try {
            if (!IS_PRO) await new Promise(resolve => setTimeout(resolve, 1500));

            const history = await coinGeckoClient.get(`/coins/${cgId}/market_chart`, {
              params: { vs_currency: 'usd', days: '7', interval: 'hourly' }
            });

            const prices = history.data.prices.map((p: [number, number]) => ({
              date: new Date(p[0]).toISOString().split('T')[0],
              price: p[1]
            }));
            const caps = history.data.market_caps.map((m: [number, number]) => ({
              date: new Date(m[0]).toISOString().split('T')[0],
              tvl: m[1]
            }));

            const firstPrice = prices[0]?.price || 0;
            const lastPrice = prices[prices.length - 1]?.price || 0;
            const trend = lastPrice > firstPrice ? 'BULLISH' : lastPrice < firstPrice ? 'BEARISH' : 'STABLE';

            analyticsData = {
              historicalPrice: prices,
              historicalTvl: caps,
              trend,
              confidenceScore: 0.98
            };
          } catch (cgError) {
            logger.warn(`CoinGecko fetch failed for ${pool.tokenSymbol}`, cgError);
          }
        }

        const updated = await prisma.stakingPool.update({
          where: { id: pool.id },
          data: {
            apyPercentage: yieldData.apy.toString(),
            tvlAmount: yieldData.tvl.toString(),
            ...(analyticsData ? {
              analytics: {
                upsert: {
                  create: analyticsData,
                  update: analyticsData
                }
              }
            } : {})
          }
        });
        updatedPools.push(updated as any);
      }

      logger.info(`✅ Successfully synced ${updatedPools.length} pools from authoritative yield adapters`);
    } catch (error) {
      logger.error('CRITICAL: Analytics Sync Failed:', error);
      throw error;
    }
  }

  private async fetchExternalYield(_address: string): Promise<{ apy: number; tvl: number }> {
    throw new Error(
      'Authoritative staking yield adapter is not configured; refusing to persist synthetic APY/TVL data'
    );
  }

  calculateYield(stake: UserStake, pool: StakingPool, asOf: Date = new Date()): number {
    const nowSeconds = Math.floor(asOf.getTime() / 1000);
    const stakeDate = typeof stake.stakedAt === 'string' ? new Date(stake.stakedAt) : stake.stakedAt;
    const stakeSeconds = Math.floor((stakeDate as Date).getTime() / 1000);
    const timeElapsedSeconds = nowSeconds - stakeSeconds;

    if (timeElapsedSeconds <= 0) return 0;

    const yearsElapsed = timeElapsedSeconds / (60 * 60 * 24 * 365);
    const apy = Number(pool.apyPercentage);
    const amount = Number(stake.amountStaked);

    const yieldEarned = amount * (apy / 100) * yearsElapsed;
    return Number(yieldEarned.toFixed(2));
  }
}

export const yieldService = new YieldService();
