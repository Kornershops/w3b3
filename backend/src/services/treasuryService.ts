import { ethers } from 'ethers';
import logger from '../utils/logger';

// Example ERC20 ABI just for `balanceOf`
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)"
];

export class TreasuryService {
  private treasuryAddress: string;
  private provider: ethers.JsonRpcProvider;

  // In production, these would be indexed in Prisma/Redis.
  // For this architecture phase, we query the node dynamically.
  private trackedAssets = [
    { symbol: 'USDC', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', decimals: 6, mockPrice: 1.0 },
    { symbol: 'USDT', address: '0xdac17f958d2ee523a2206206994597c13d831ec7', decimals: 6, mockPrice: 1.0 },
    { symbol: 'stETH', address: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84', decimals: 18, mockPrice: 3500.0 }
  ];

  constructor() {
    // Inject the deployed treasury address from the environment
    this.treasuryAddress = process.env.TREASURY_ADDRESS || '0x0000000000000000000000000000000000000000';
    
    // Provide a fallback RPC for indexing on Ethereum Mainnet
    const rpcUrl = process.env.ALCHEMY_API_URL || 'https://eth-mainnet.g.alchemy.com/v2/demo';
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  /**
   * Scans the treasury contract and reward distributor for Real Yield metrics.
   */
  async getTreasuryHoldings(): Promise<{
    totalValuationUsd: string;
    assets: Array<{ symbol: string; balance: string; valueUsd: string }>;
    totalEthDistributed: string;
    lastUpdated: string;
  }> {
    try {
      if (this.treasuryAddress === '0x0000000000000000000000000000000000000000') {
        logger.warn('Treasury address is not set. Returning placeholders.');
        return { totalValuationUsd: '0', assets: [], totalEthDistributed: '0', lastUpdated: new Date().toISOString() };
      }

      let totalValuation = 0;
      const holdings: Array<{ symbol: string; balance: string; valueUsd: string }> = [];

      // 1. Query Treasury Native ETH balance
      const nativeBalance = await this.provider.getBalance(this.treasuryAddress);
      const ethPrice = 3500; // Mock ETH price for current valuation

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
      for (const asset of this.trackedAssets) {
        const contract = new ethers.Contract(asset.address, ERC20_ABI, this.provider);
        const balance = await contract.balanceOf(this.treasuryAddress);

        if (balance > 0n) {
          const formatted = parseFloat(ethers.formatUnits(balance, asset.decimals));
          const valueUsd = formatted * asset.mockPrice;
          totalValuation += valueUsd;

          holdings.push({
            symbol: asset.symbol,
            balance: formatted.toString(),
            valueUsd: valueUsd.toString()
          });
        }
      }

      // 3. Query Total Yield Distributed (from RewardDistributor)
      // For this phase, we mock the cumulative distribution tracker or read events.
      const totalEthDistributed = "125.4"; // Mock value for current implementation phase

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
