const { yieldService } = require('../../../dist/services/yieldService');

describe('YieldService', () => {
  const mockPool = {
    id: 'pool-1',
    name: 'Test Pool',
    contractAddress: '0x123',
    tokenSymbol: 'TEST',
    tokenDecimals: 18,
    apyPercentage: 10,
    tvlAmount: 1000000,
    minimumStake: 0,
    chainId: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockStake = {
    id: 'stake-1',
    userId: 'user-1',
    poolId: 'pool-1',
    amountStaked: 1000,
    rewardsClaimed: 0,
    transactionHash: null,
    stakedAt: new Date(),
    unstakedAt: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should calculate zero yield for a new stake', () => {
    const now = new Date();
    // Force identical timestamps to guarantee 0 diff
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
