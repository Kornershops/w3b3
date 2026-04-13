import prisma from '../config/database';
import { getRedis } from '../config/redis';
import { StakingPool, PoolFilter, PaginatedResponse } from '../types';
import logger from '../utils/logger';
import { Prisma } from '@prisma/client';
import { mapPool } from '../utils/mappers';
import { predictiveAnalyticsService } from './predictiveAnalytics';

const POOL_CACHE_TTL = 60; // 1 minute

export class PoolService {
  async getPools(
    filter: PoolFilter = {},
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<StakingPool>> {
    try {
      const skip = (page - 1) * limit;

      // Build where clause
      interface PoolWhere {
        chainId?: number;
        isActive?: boolean;
      }
      const where: PoolWhere = {};
      if (filter.chainId) where.chainId = filter.chainId;
      if (filter.isActive !== undefined) where.isActive = filter.isActive;

      // Get total count
      const total = await prisma.stakingPool.count({ where });

      // Get pools
      const pools = await prisma.stakingPool.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      // Map pools and enrich with analytics
      const mappedPools = await Promise.all(
        pools.map(async (pool) => {
          const analytics = await predictiveAnalyticsService.forecastPoolYield(pool.id);
          return mapPool(pool, analytics);
        })
      );

      return {
        data: mappedPools,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching pools:', error);
      throw error;
    }
  }

  async getPoolById(poolId: string): Promise<StakingPool | null> {
    try {
      const cacheKey = `pool:${poolId}`;
      let cached: string | null = null;

      // Try cache first
      try {
        const redis = getRedis();
        cached = await redis.get(cacheKey);
      } catch (redisErr) {
        logger.error('Redis get error:', redisErr);
      }

      if (cached) {
        return JSON.parse(cached);
      }

      // Get from database
      const pool = await prisma.stakingPool.findUnique({
        where: { id: poolId },
      });

      let analytics = null;
      if (pool) {
        analytics = await predictiveAnalyticsService.forecastPoolYield(pool.id);

        // Cache the result
        try {
          const redis = getRedis();
          const enrichedPool = mapPool(pool, analytics);
          await redis.setEx(cacheKey, POOL_CACHE_TTL, JSON.stringify(enrichedPool));
          return enrichedPool;
        } catch (redisErr) {
          logger.error('Redis set error:', redisErr);
        }
      }

      return pool ? mapPool(pool, analytics) : null;
    } catch (error) {
      logger.error('Error fetching pool:', error);
      throw error;
    }
  }

  async getPoolsByChain(chainId: number): Promise<StakingPool[]> {
    try {
      const pools = await prisma.stakingPool.findMany({
        where: {
          chainId,
          isActive: true,
        },
        orderBy: { apyPercentage: 'desc' },
      });
      return pools.map(mapPool);
    } catch (error) {
      logger.error('Error fetching pools by chain:', error);
      throw error;
    }
  }

  async createPool(data: {
    name: string;
    chainId: number;
    contractAddress: string;
    tokenSymbol: string;
    tokenDecimals: number;
    apyPercentage: string;
    tvlAmount: string;
    minimumStake: string;
  }): Promise<StakingPool> {
    try {
      const pool = await prisma.stakingPool.create({
        data,
      });

      // Invalidate cache
      try {
        const redis = getRedis();
        await redis.del(`pools:${data.chainId}`);
      } catch (redisErr) {
        logger.error('Redis del error:', redisErr);
      }

      logger.info(`Pool created: ${pool.id}`);
      return mapPool(pool);
    } catch (error) {
      logger.error('Error creating pool:', error);
      throw error;
    }
  }

  async updatePool(
    poolId: string,
    data: Partial<StakingPool>
  ): Promise<StakingPool> {
    try {
      // Structural Fix: Extract only valid Prisma fields from the Shared DTO
      // This prevents 'number' vs 'Decimal' or unexpected DTO fields from breaking the update
      const { ...prismaData } = data as any;
      
      const pool = await prisma.stakingPool.update({
        where: { id: poolId },
        data: prismaData,
      });

      // Invalidate cache
      try {
        const redis = getRedis();
        await redis.del(`pool:${poolId}`);
      } catch (redisErr) {
        logger.error('Redis del error:', redisErr);
      }

      logger.info(`Pool updated: ${poolId}`);
      return mapPool(pool);
    } catch (error) {
      logger.error('Error updating pool:', error);
      throw error;
    }
  }

  async updatePoolApy(poolId: string, newApy: string): Promise<StakingPool> {
    try {
      const pool = await prisma.stakingPool.update({
        where: { id: poolId },
        data: { apyPercentage: newApy },
      });

      // Invalidate cache
      try {
        const redis = getRedis();
        await redis.del(`pool:${poolId}`);
      } catch (redisErr) {
        logger.error('Redis del error:', redisErr);
      }

      logger.info(`Pool APY updated: ${poolId} -> ${newApy}`);
      return mapPool(pool);
    } catch (error) {
      logger.error('Error updating pool APY:', error);
      throw error;
    }
  }

  async updatePoolTvl(poolId: string, newTvl: string): Promise<StakingPool> {
    try {
      const pool = await prisma.stakingPool.update({
        where: { id: poolId },
        data: { tvlAmount: newTvl },
      });

      // Invalidate cache
      try {
        const redis = getRedis();
        await redis.del(`pool:${poolId}`);
      } catch (redisErr) {
        logger.error('Redis del error:', redisErr);
      }

      logger.info(`Pool TVL updated: ${poolId} -> ${newTvl}`);
      return mapPool(pool);
    } catch (error) {
      logger.error('Error updating pool TVL:', error);
      throw error;
    }
  }

  async deactivatePool(poolId: string): Promise<StakingPool> {
    try {
      const pool = await prisma.stakingPool.update({
        where: { id: poolId },
        data: { isActive: false },
      });

      // Invalidate cache
      try {
        const redis = getRedis();
        await redis.del(`pool:${poolId}`);
      } catch (redisErr) {
        logger.error('Redis del error:', redisErr);
      }

      logger.info(`Pool deactivated: ${poolId}`);
      return mapPool(pool);
    } catch (error) {
      logger.error('Error deactivating pool:', error);
      throw error;
    }
  }

  async getTopPoolsByApy(limit = 10): Promise<StakingPool[]> {
    try {
      const pools = await prisma.stakingPool.findMany({
        where: { isActive: true },
        orderBy: { apyPercentage: 'desc' },
        take: limit,
      });
      return pools.map(mapPool);
    } catch (error) {
      logger.error('Error fetching top pools:', error);
      throw error;
    }
  }

  async getPoolStats(): Promise<{
    totalPools: number;
    totalTvl: string;
    averageApy: string;
    pools: StakingPool[];
  }> {
    try {
      const pools = await prisma.stakingPool.findMany({
        where: { isActive: true },
      });

      const totalTvl = pools.reduce((sum, pool) => {
        return sum + parseFloat(pool.tvlAmount.toString());
      }, 0);

      const avgApy =
        pools.length > 0
          ? pools.reduce((sum, pool) => {
              return sum + parseFloat(pool.apyPercentage.toString());
            }, 0) / pools.length
          : 0;

      return {
        totalPools: pools.length,
        totalTvl: totalTvl.toString(),
        averageApy: avgApy.toFixed(2),
        pools: pools.map(mapPool),
      };
    } catch (error) {
      logger.error('Error fetching pool stats:', error);
      throw error;
    }
  }
}

export const poolService = new PoolService();
