/**
 * W3B3 Shared Data Transfer Objects (DTOs)
 * Standardized for full-stack type synchronization.
 */

export interface User {
  id: string;
  walletAddress: string;
  role: 'USER' | 'ADMIN';
  referralCode: string | null;
  referredById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StakingPool {
  id: string;
  name: string;
  chainId: number;
  contractAddress: string;
  tokenSymbol: string;
  tokenDecimals: number;
  apyPercentage: number;
  tvlAmount: string;     // Serialized Decimal
  minimumStake: string;  // Serialized Decimal
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserStake {
  id: string;
  userId: string;
  poolId: string;
  amountStaked: string;   // Serialized Decimal
  rewardsClaimed: string; // Serialized Decimal
  transactionHash: string | null;
  stakedAt: string;
  unstakedAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  pool?: StakingPool;
  user?: User;
}

export interface Reward {
  id: string;
  stakeId: string;
  userId: string;
  amount: string;         // Serialized Decimal
  tokenSymbol: string;
  transactionHash: string | null;
  claimedAt: string | null;
  createdAt: string;
}

export interface Portfolio {
  totalStaked: string;
  totalRewards: string;
  netGain: string;
  estimatedAnnual: string;
  activeStakes: number;
  totalStakes: number;
  lastUpdated: string;
}

export interface PortfolioBreakdown {
  byChain: Array<{
    chainId: number;
    chainName: string;
    totalStaked: string;
    totalRewards: string;
    percentage: number;
  }>;
  byAsset: Array<{
    symbol: string;
    totalStaked: string;
    totalRewards: string;
    percentage: number;
  }>;
}

export interface PortfolioTransaction {
  id: string;
  type: 'stake' | 'unstake' | 'claim';
  amount: string;
  token: string;
  chainId: number;
  transactionHash: string;
  status: 'confirmed' | 'pending' | 'failed';
  timestamp: string;
}

export interface TreasuryHoldings {
  totalValuationUsd: string;
  assets: Array<{ symbol: string; balance: string; valueUsd: string }>;
  totalEthDistributed: string;
  lastUpdated: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}
