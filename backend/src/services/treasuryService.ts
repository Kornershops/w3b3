import { ethers } from 'ethers';
import { TreasuryHoldings } from '../types';
import logger from '../utils/logger';
import { priceService } from './priceService';
import config from '../config/env';
import prisma from '../config/database';

// Example ERC20 ABI just for `balanceOf`
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)"
];

export class TreasuryService {
  private treasuryAddress: string;
  private provider: ethers.JsonRpcProvider;

  constructor() {
    this.treasuryAddress = process.env.TREASURY_ADDRESS || '0x0000000000000000000000000000000000000000';
    
    // Multi-provider fallback strategy:
    const alchemyUrl = `https://eth-mainnet.g.alchemy.com/v2/${config.web3.alchemyApiKey}`;
    const infuraUrl = `https://mainnet.infura.io/v3/${config.web3.infuraApiKey}`;
    const rpcUrl = config.web3.alchemyApiKey ? alchemyUrl : (config.web3.infuraApiKey ? infuraUrl : 'https://eth.llamarpc.com');

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  /**
   * Scans the treasury contract and reward distributor for Real Yield metrics.
   */
  async getTreasuryHoldings(): Promise<TreasuryHoldings> {
    try {
      if (this.treasuryAddress === '0x0000000000000000000000000000000000000000') {
        logger.warn('Treasury address is not set. Returning placeholders.');
        return { totalValuationUsd: '0', assets: [], totalEthDistributed: '0', lastUpdated: new Date().toISOString() };
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
      const totalEthDistributed = rewardAggregation._sum.amount?.toString() || "0";

      return {
        totalValuationUsd: totalValuation.toString(),
        assets: holdings,
        totalEthDistributed,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error fetching treasury holdings:', error);
      throw new Error('Failed to index treasury holdings on-chain');
    }
  }
}

export const treasuryService = new TreasuryService();
