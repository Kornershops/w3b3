import { User, StakingPool, UserStake } from '../types';

/**
 * Mapper to convert Prisma User to Shared DTO
 */
export function mapUser(user: any): User {
  return {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

/**
 * Mapper to convert Prisma StakingPool to Shared DTO
 */
export function mapPool(pool: any, analytics?: any): StakingPool {
  return {
    ...pool,
    apyPercentage: Number(pool.apyPercentage), // Ensure number for Shared DTO alignment
    tvlAmount: pool.tvlAmount.toString(),
    minimumStake: pool.minimumStake.toString(),
    createdAt: pool.createdAt.toISOString(),
    updatedAt: pool.updatedAt.toISOString(),
    analytics: analytics || undefined,
  };
}

/**
 * Mapper to convert Prisma UserStake to Shared DTO
 */
export function mapStake(stake: any): UserStake {
  const mappedStake: UserStake = {
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

  if (stake.user) {
    mappedStake.user = mapUser(stake.user);
  }

  return mappedStake;
}
