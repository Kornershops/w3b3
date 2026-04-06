import prisma from '../config/database';
import { Portfolio, PortfolioBreakdown } from '../types';
import logger from '../utils/logger';

export class PortfolioService {
  async getPortfolioSummary(userId: string): Promise<Portfolio> {
    try {
      const stakes = await prisma.userStake.findMany({
        where: { userId },
        include: { pool: true },
      });

      // Calculate totals
      const totalStaked = stakes.reduce((sum, stake) => {
        return sum + parseFloat(stake.amountStaked.toString());
      }, 0);

      const totalRewards = stakes.reduce((sum, stake) => {
        return sum + parseFloat(stake.rewardsClaimed.toString());
      }, 0);

      const netGain = totalStaked > 0 ? ((totalRewards / totalStaked) * 100).toFixed(2) : '0';

      // Calculate estimated annual earnings
      const estimatedAnnual = stakes.reduce((sum, stake) => {
        if (!stake.pool) return sum;
        const apy = parseFloat(stake.pool.apyPercentage.toString());
        const stakeAmount = parseFloat(stake.amountStaked.toString());
        return sum + (stakeAmount * apy) / 100;
      }, 0);

      const activeStakes = stakes.filter((s) => s.isActive).length;

      return {
        totalStaked: totalStaked.toString(),
        totalRewards: totalRewards.toString(),
        netGain,
        estimatedAnnual: estimatedAnnual.toString(),
        activeStakes,
        totalStakes: stakes.length,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Error calculating portfolio summary:', error);
      throw error;
    }
  }

  async getPortfolioBreakdown(userId: string): Promise<PortfolioBreakdown> {
    try {
      const stakes = await prisma.userStake.findMany({
        where: { userId },
        include: { pool: true },
      });

      // Calculate by chain
      const chainMap = new Map<number, { staked: number; rewards: number }>();

      stakes.forEach((stake) => {
        if (!stake.pool) return;

        const chainId = stake.pool.chainId;
        const current = chainMap.get(chainId) || { staked: 0, rewards: 0 };

        current.staked += parseFloat(stake.amountStaked.toString());
        current.rewards += parseFloat(stake.rewardsClaimed.toString());

        chainMap.set(chainId, current);
      });

      const totalStaked = Array.from(chainMap.values()).reduce(
        (sum, v) => sum + v.staked,
        0
      );

      const byChain = Array.from(chainMap.entries()).map(([chainId, data]) => ({
        chainId,
        chainName: this.getChainName(chainId),
        totalStaked: data.staked.toString(),
        totalRewards: data.rewards.toString(),
        percentage: totalStaked > 0 ? Math.round((data.staked / totalStaked) * 100) : 0,
      }));

      // Calculate by asset
      const assetMap = new Map<string, { staked: number; rewards: number }>();

      stakes.forEach((stake) => {
        if (!stake.pool) return;

        const symbol = stake.pool.tokenSymbol;
        const current = assetMap.get(symbol) || { staked: 0, rewards: 0 };

        current.staked += parseFloat(stake.amountStaked.toString());
        current.rewards += parseFloat(stake.rewardsClaimed.toString());

        assetMap.set(symbol, current);
      });

      const byAsset = Array.from(assetMap.entries()).map(([symbol, data]) => ({
        symbol,
        totalStaked: data.staked.toString(),
        totalRewards: data.rewards.toString(),
        percentage: totalStaked > 0 ? Math.round((data.staked / totalStaked) * 100) : 0,
      }));

      return { byChain, byAsset };
    } catch (error) {
      logger.error('Error calculating portfolio breakdown:', error);
      throw error;
    }
  }

  async getPortfolioHistory(userId: string, page = 1, limit = 20): Promise<{
    data: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    try {
      const skip = (page - 1) * limit;

      // Get all transactions (stakes, unstakes, claims)
      const stakes = await prisma.userStake.findMany({
        where: { userId },
        include: { pool: true },
        orderBy: { stakedAt: 'desc' },
      });

      const rewards = await prisma.reward.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      // Combine and sort
      const transactions = [
        ...stakes.map((stake) => ({
          id: stake.id,
          type: 'stake' as const,
          amount: stake.amountStaked.toString(),
          token: stake.pool?.tokenSymbol || 'UNKNOWN',
          chainId: stake.pool?.chainId || 0,
          transactionHash: stake.transactionHash || '',
          status: 'confirmed' as const,
          timestamp: stake.stakedAt.toISOString(),
        })),
        ...rewards.map((reward) => ({
          id: reward.id,
          type: 'claim' as const,
          amount: reward.amount.toString(),
          token: 'REWARD',
          chainId: 0,
          transactionHash: reward.transactionHash || '',
          status: reward.claimedAt ? ('confirmed' as const) : ('pending' as const),
          timestamp: reward.createdAt.toISOString(),
        })),
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      const total = transactions.length;
      const paginatedTransactions = transactions.slice(skip, skip + limit);

      return {
        data: paginatedTransactions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching portfolio history:', error);
      throw error;
    }
  }

  private getChainName(chainId: number): string {
    const chains: Record<number, string> = {
      1: 'Ethereum',
      137: 'Polygon',
      501: 'Solana',
      8453: 'Base',
      42161: 'Arbitrum',
      10: 'Optimism',
    };

    return chains[chainId] || `Chain ${chainId}`;
  }
}

export const portfolioService = new PortfolioService();
