import prisma from '../config/database';
import { ethers } from 'ethers';
import { Portfolio, PortfolioBreakdown, PortfolioTransaction, TreasuryHoldings } from '../types';
import logger from '../utils/logger';

export class PortfolioService {
  async getPortfolioSummary(userId: string): Promise<Portfolio> {
    try {
      // 1. Fetch Personal Stakes
      const personalStakes = await prisma.userStake.findMany({
        where: { userId },
        include: { pool: true },
      });

      // 2. Fetch User Context for Institutional Scan
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const walletAddress = user?.walletAddress;

      // 3. Fetch Institutional Vaults (Where user is owner or signer)
      const institutionalVaults = await prisma.institutionalVault.findMany({
        where: {
          OR: [
            { ownerId: userId },
            walletAddress ? { signers: { some: { address: walletAddress } } } : {}
          ]
        },
        include: {
          proposals: {
            where: { status: 'EXECUTED' } // Only count deployed capital
          }
        }
      });

      // --- AGGREGATION LOGIC ---
      
      // Personal Totals
      let totalStaked = personalStakes.reduce((sum, stake) => sum + parseFloat(stake.amountStaked.toString()), 0);
      let totalRewards = personalStakes.reduce((sum, stake) => sum + parseFloat(stake.rewardsClaimed.toString()), 0);
      let estimatedAnnual = personalStakes.reduce((sum, stake) => {
        if (!stake.pool) return sum;
        const apy = parseFloat(stake.pool.apyPercentage.toString());
        return sum + (parseFloat(stake.amountStaked.toString()) * apy) / 100;
      }, 0);

      // Institutional Totals
      institutionalVaults.forEach(vault => {
        // Here we'd ideally fetch real balance from on-chain, 
        // but for simulation, we aggregate 'Executed' proposal values (deployed capital)
        const vaultValue = vault.proposals.reduce((sum, prop) => {
           // Basic metadata parsing for simulation value
           return sum + 15000; // Mock increment per executed custody action for demo
        }, 0);
        
        totalStaked += vaultValue;
        estimatedAnnual += (vaultValue * 0.12); // Average 12% institutional yield
      });

      const netGain = totalStaked > 0 ? ((totalRewards / totalStaked) * 100).toFixed(2) : '0';
      const activeStakes = personalStakes.filter((s) => s.isActive).length;

      return {
        totalStaked: totalStaked.toFixed(2),
        totalRewards: totalRewards.toFixed(2),
        netGain,
        estimatedAnnual: estimatedAnnual.toFixed(2),
        activeStakes: activeStakes + institutionalVaults.length,
        totalStakes: personalStakes.length + institutionalVaults.length,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Error calculating global portfolio summary:', error);
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
    data: PortfolioTransaction[];
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
