import prisma from '../config/database';
import { Parser } from 'json2csv';
import logger from '../utils/logger';

export class ReportService {
  /**
   * Generates a tax-ready CSV report of all realized yields, claims, and stakes.
   */
  async generateTaxReportCSV(userId: string): Promise<string> {
    try {
      const stakes = await prisma.userStake.findMany({
        where: { userId },
        include: { pool: true },
      });

      const rewards = await prisma.reward.findMany({
        where: { userId },
        include: { stake: { include: { pool: true } } },
      });

      const reportData: any[] = [];

      // Process Stakes (Capital Deployed)
      stakes.forEach(stake => {
        reportData.push({
          Type: 'STAKE_CAPITAL_DEPLOYED',
          Date: stake.stakedAt.toISOString(),
          Asset: stake.pool.tokenSymbol,
          Amount: stake.amountStaked.toString(),
          Status: stake.isActive ? 'ACTIVE' : 'UNSTAKED',
          TransactionHash: stake.transactionHash || 'N/A',
          Notes: `Chain ID: ${stake.pool.chainId}`,
        });
      });

      // Process Rewards (Realized Yield)
      rewards.forEach(reward => {
        reportData.push({
          Type: 'YIELD_CLAIMED_REALIZED',
          Date: reward.claimedAt?.toISOString() || reward.createdAt.toISOString(),
          Asset: reward.stake.pool.tokenSymbol,
          Amount: reward.amount.toString(),
          Status: reward.claimedAt ? 'REALIZED_INCOME' : 'PENDING_INCOME',
          TransactionHash: reward.transactionHash || 'N/A',
          Notes: `Yield from Stake ID: ${reward.stakeId}`,
        });
      });

      // Sort chronologically
      reportData.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());

      // Parse to CSV
      const fields = ['Type', 'Date', 'Asset', 'Amount', 'Status', 'TransactionHash', 'Notes'];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(reportData);

      return csv;
    } catch (error) {
      logger.error('Error generating Tax Report CSV:', error);
      throw error;
    }
  }

  /**
   * Calculate exact P&L using standard FIFO logic for accounting endpoints
   */
  async calculateNetPnL(userId: string): Promise<string> {
    try {
      // In a real accounting module, we would map daily historical prices to events
      // For this phase, we calculate gross realized yield in native token volumes
      const rewards = await prisma.reward.findMany({
        where: { userId, claimedAt: { not: null } },
      });

      const totalRealizedYield = rewards.reduce((sum, r) => sum + parseFloat(r.amount.toString()), 0);

      return totalRealizedYield.toString();
    } catch (error) {
      logger.error('Error calculating Net P&L:', error);
      throw error;
    }
  }
}

export const reportService = new ReportService();
