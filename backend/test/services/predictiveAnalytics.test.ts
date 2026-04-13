import { predictiveAnalyticsService } from '../../src/services/predictiveAnalytics';
import prisma from '../../src/config/database';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('PredictiveAnalyticsService', () => {
  let poolId: string;

  beforeAll(async () => {
    // We need a pool in the database to test against
    const pool = await prisma.stakingPool.create({
      data: {
        name: 'Test Analytics Pool',
        chainId: 1,
        contractAddress: '0xtest' + Math.random(),
        tokenSymbol: 'TEST',
        tokenDecimals: 18,
        apyPercentage: '10.5',
        tvlAmount: '500000',
        minimumStake: '1',
      }
    });
    poolId = pool.id;
  });

  it('should return 7-day historical TVL and trend markers', async () => {
    const result = await predictiveAnalyticsService.forecastPoolYield(poolId);
    
    expect(result).not.toBeNull();
    if (result) {
      expect(result.historicalTvl).toHaveLength(7);
      expect(result.trend).toBeDefined();
      expect(result.confidenceScore).toBeGreaterThanOrEqual(0);
      expect(result.confidenceScore).toBeLessThanOrEqual(1);
      expect(typeof result.projected7DayApy).toBe('number');
    }
  });

  afterAll(async () => {
    await prisma.stakingPool.delete({ where: { id: poolId } });
  });
});
