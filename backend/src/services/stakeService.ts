import prisma from '../config/database';
import { UserStake, PaginatedResponse, StakingPool } from '../types';
import logger from '../utils/logger';

/**
 * Mapper to convert Prisma StakingPool to Shared DTO
 */
export function mapPool(pool: any): StakingPool {
  return {
    ...pool,
    apyPercentage: pool.apyPercentage.toString(),
    tvlAmount: pool.tvlAmount.toString(),
    minimumStake: pool.minimumStake.toString(),
    createdAt: pool.createdAt.toISOString(),
    updatedAt: pool.updatedAt.toISOString(),
  };
}

/**
 * Mapper to convert Prisma UserStake to Shared DTO
 */
export function mapStake(stake: any): UserStake {
  const mappedStake = {
    ...stake,
    amountStaked: stake.amountStaked.toString(),
    rewardsClaimed: stake.rewardsClaimed.toString(),
    stakedAt: stake.stakedAt.toISOString(),
    unstakedAt: stake.unstakedAt ? stake.unstakedAt.toISOString() : null,
    createdAt: stake.createdAt.toISOString(),
    updatedAt: stake.updatedAt.toISOString(),
  };

  if (stake.pool) {
    mappedStake.pool = mapPool(stake.pool);
  }

  return mappedStake;
}

export class StakeService {
  async getUserStakes(
    userId: string,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<UserStake>> {
    try {
      const skip = (page - 1) * limit;

      // Get total count
      const total = await prisma.userStake.count({
        where: { userId },
      });

      // Get stakes with pool info
      const stakes = await prisma.userStake.findMany({
        where: { userId },
        include: { pool: true },
        skip,
        take: limit,
        orderBy: { stakedAt: 'desc' },
      });

      return {
        data: stakes.map(mapStake),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching user stakes:', error);
      throw error;
    }
  }

  async getStakeById(stakeId: string): Promise<UserStake | null> {
    try {
      const stake = await prisma.userStake.findUnique({
        where: { id: stakeId },
        include: { pool: true },
      });
      return stake ? mapStake(stake) : null;
    } catch (error) {
      logger.error('Error fetching stake:', error);
      throw error;
    }
  }

  async createStake(data: {
    userId: string;
    poolId: string;
    amountStaked: string;
    transactionHash: string;
  }): Promise<UserStake> {
    try {
      const stake = await prisma.userStake.create({
        data: {
          ...data,
          isActive: true,
        },
        include: { pool: true },
      });

      logger.info(`Stake created: ${stake.id}`);
      return mapStake(stake);
    } catch (error) {
      logger.error('Error creating stake:', error);
      throw error;
    }
  }

  async updateStake(stakeId: string, data: Partial<UserStake>): Promise<UserStake> {
    try {
      // Structural Fix: Extract only valid Prisma fields from the Shared DTO
      const { pool, user, ...prismaData } = data as any;
      
      const stake = await prisma.userStake.update({
        where: { id: stakeId },
        data: prismaData,
      });

      logger.info(`Stake updated: ${stakeId}`);
      return mapStake(stake);
    } catch (error) {
      logger.error('Error updating stake:', error);
      throw error;
    }
  }

  async unstakeTokens(
    stakeId: string,
    _transactionHash: string
  ): Promise<UserStake> {
    try {
      const stake = await prisma.userStake.update({
        where: { id: stakeId },
        data: {
          isActive: false,
          unstakedAt: new Date(),
        },
        include: { pool: true },
      });

      logger.info(`Tokens unstaked: ${stakeId}`);
      return mapStake(stake);
    } catch (error) {
      logger.error('Error unstaking tokens:', error);
      throw error;
    }
  }

  async claimRewards(
    stakeId: string,
    rewardAmount: string,
    transactionHash: string
  ): Promise<UserStake> {
    try {
      // Update stake with claimed rewards
      const stake = await prisma.userStake.update({
        where: { id: stakeId },
        data: {
          rewardsClaimed: {
            increment: rewardAmount,
          },
        },
        include: { pool: true },
      });

      // Create reward record
      await prisma.reward.create({
        data: {
          stakeId,
          userId: stake.userId,
          amount: rewardAmount,
          claimedAt: new Date(),
          transactionHash,
        },
      });

      logger.info(`Rewards claimed: ${stakeId} - ${rewardAmount}`);
      return mapStake(stake);
    } catch (error) {
      logger.error('Error claiming rewards:', error);
      throw error;
    }
  }

  async getActiveStakes(userId: string): Promise<UserStake[]> {
    try {
      const stakes = await prisma.userStake.findMany({
        where: {
          userId,
          isActive: true,
        },
        include: { pool: true },
        orderBy: { stakedAt: 'desc' },
      });
      return stakes.map(mapStake);
    } catch (error) {
      logger.error('Error fetching active stakes:', error);
      throw error;
    }
  }

  async getTotalStaked(userId: string): Promise<string> {
    try {
      const stakes = await prisma.userStake.findMany({
        where: {
          userId,
          isActive: true,
        },
      });

      const total = stakes.reduce((sum, stake) => {
        return sum + parseFloat(stake.amountStaked.toString());
      }, 0);

      return total.toString();
    } catch (error) {
      logger.error('Error calculating total staked:', error);
      throw error;
    }
  }

  async getTotalRewards(userId: string): Promise<string> {
    try {
      const stakes = await prisma.userStake.findMany({
        where: { userId },
      });

      const total = stakes.reduce((sum, stake) => {
        return sum + parseFloat(stake.rewardsClaimed.toString());
      }, 0);

      return total.toString();
    } catch (error) {
      logger.error('Error calculating total rewards:', error);
      throw error;
    }
  }

  async getStakesByPool(poolId: string): Promise<UserStake[]> {
    try {
      const stakes = await prisma.userStake.findMany({
        where: {
          poolId,
          isActive: true,
        },
        include: { pool: true },
      });
      return stakes.map(mapStake);
    } catch (error) {
      logger.error('Error fetching stakes by pool:', error);
      throw error;
    }
  }

  async getPoolTotalStaked(poolId: string): Promise<string> {
    try {
      const stakes = await prisma.userStake.findMany({
        where: {
          poolId,
          isActive: true,
        },
      });

      const total = stakes.reduce((sum, stake) => {
        return sum + parseFloat(stake.amountStaked.toString());
      }, 0);

      return total.toString();
    } catch (error) {
      logger.error('Error calculating pool total staked:', error);
      throw error;
    }
  }
}

export const stakeService = new StakeService();
