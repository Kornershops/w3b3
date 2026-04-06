import { yieldService } from '@/services/yieldService';
import { StakingPool, UserStake } from '@/types';

describe('YieldService', () => {
  const mockPool: StakingPool = {
    id: 'pool-1',
    name: 'Test Pool',
    contractAddress: '0x123',
    tokenSymbol: 'TEST',
    tokenDecimals: 18,
    apyPercentage: 10 as any,
    tvlAmount: 1000000 as any,
    minimumStake: 0 as any,
    chainId: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockStake: UserStake = {
    id: 'stake-1',
    userId: 'user-1',
    poolId: 'pool-1',
    amountStaked: 1000 as any,
    rewardsClaimed: 0 as any,
    transactionHash: null,
    stakedAt: new Date(),
    unstakedAt: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should calculate zero yield for a new stake', () => {
    const now = new Date();
    const mockStakeAtNow = { ...mockStake, stakedAt: now, updatedAt: now };
    const yieldEarned = yieldService.calculateYield(mockStakeAtNow, mockPool, now);
    expect(yieldEarned).toBe(0);
  });

  it('should calculate correct yield after one year', () => {
    const stakedAt = new Date('2023-01-01T00:00:00Z');
    const asOf = new Date('2024-01-01T00:00:00Z');
    const mockStakeYearOld = { ...mockStake, stakedAt, updatedAt: stakedAt };
    
    const yieldEarned = yieldService.calculateYield(mockStakeYearOld, mockPool, asOf);
    // 1000 * 0.1 * 1 year = 100
    expect(yieldEarned).toBe(100);
  });

  it('should return 0 for negative time elapsed', () => {
    const stakedAt = new Date();
    const asOf = new Date(stakedAt.getTime() - 1000); // 1 second before stake
    const mockStakeFuture = { ...mockStake, stakedAt };
    
    const yieldEarned = yieldService.calculateYield(mockStakeFuture, mockPool, asOf);
    expect(yieldEarned).toBe(0);
  });
});
