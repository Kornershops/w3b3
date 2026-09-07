import { ethers } from 'ethers';
import { TreasuryHoldings } from '../types';
import logger from '../utils/logger';
import { priceService } from './priceService';
import config from '../config/env';
import prisma from '../config/database';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// Example ERC20 ABI just for `balanceOf`
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)'
];

export class TreasuryService {
  private treasuryAddress: string;
  private provider: ethers.JsonRpcProvider;

  constructor() {
    this.treasuryAddress = process.env.TREASURY_ADDRESS || '';

    // Production must use an explicitly configured RPC. Development may use localhost.
    this.provider = new ethers.JsonRpcProvider(config.web3.rpcUrl);
  }

  /**
   * Scans the treasury contract and reward distributor for Real Yield metrics.
   * Missing configuration is an operational failure, never a financial zero.
   */
  async getTreasuryHoldings(): Promise<TreasuryHoldings> {
    try {
      if (!this.treasuryAddress || this.treasuryAddress === ZERO_ADDRESS) {
        throw new Error('TREASURY_ADDRESS is not configured with a non-zero address');
      }

      if (!ethers.isAddress(this.treasuryAddress)) {
        throw new Error('TREASURY_ADDRESS is invalid');
      }

      if (!config.web3.rpcUrl || config.web3.rpcUrl === 'http://127.0.0.1:8545') {
        throw new Error('WEB3_RPC_URL is not configured for authoritative treasury reads');
      }

      let totalValuation = 0;
      const holdings: Array<{ symbol: string; balance: string; valueUsd: string }> = [];

      // 1. Query Treasury Native ETH balance
      const nativeBalance = await this.provider.getBalance(this.treasuryAddress);
      const ethPrice = await priceService.getPrice('ethereum');

      if (nativeBalance > 0n) {
        const formatted = parseFloat(ethers.formatEther(nativeBalance));
        const valueUsd = formatted * ethPrice;
        totalValuation += valueUsd;
        holdings.push({
          symbol: 'ETH',
          balance: formatted.toString(),
          valueUsd: valueUsd.toString()
        });
      }

      // 2. Query Treasury ERC20s (Accumulating Protocol Fees)
      const trackedAssets = await prisma.treasuryAsset.findMany({
        where: { isActive: true }
      });

      for (const asset of trackedAssets) {
        const contract = new ethers.Contract(asset.address, ERC20_ABI, this.provider);
        const balance = await contract.balanceOf(this.treasuryAddress);

        if (balance > 0n) {
          const coinId = asset.oracleId || asset.symbol.toLowerCase();
          const assetPrice = await priceService.getPrice(coinId);
          const formatted = parseFloat(ethers.formatUnits(balance, asset.decimals));
          const valueUsd = formatted * assetPrice;
          totalValuation += valueUsd;

          holdings.push({
            symbol: asset.symbol,
            balance: formatted.toString(),
            valueUsd: valueUsd.toString()
          });
        }
      }

      // 3. Query Total Yield Distributed (Aggregated from Reward table)
      const rewardAggregation = await prisma.reward.aggregate({
        _sum: { amount: true }
      });
      const totalEthDistributed = rewardAggregation._sum.amount?.toString() || '0';

      return {
        totalValuationUsd: totalValuation.toString(),
        assets: holdings,
        totalEthDistributed,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error fetching treasury holdings:', error);
      throw new Error('Failed to index authoritative treasury holdings on-chain');
    }
  }
}

export const treasuryService = new TreasuryService();
