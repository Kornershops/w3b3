// Frontend TypeScript Types

export interface User {
  id: string;
  walletAddress: string;
  chainId?: number;
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
  apyPercentage: string;
  tvlAmount: string;
  minimumStake: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserStake {
  id: string;
  userId: string;
  poolId: string;
  amountStaked: string;
  rewardsClaimed: string;
  currentRewards?: string;
  transactionHash?: string;
  stakedAt: string;
  unstakedAt?: string;
  isActive: boolean;
  pool?: StakingPool;
}

export interface Reward {
  id: string;
  stakeId: string;
  userId: string;
  amount: string;
  claimedAt?: string;
  transactionHash?: string;
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
  byChain: ChainBreakdown[];
  byAsset: AssetBreakdown[];
}

export interface ChainBreakdown {
  chainId: number;
  chainName: string;
  totalStaked: string;
  totalRewards: string;
  percentage: number;
}

export interface AssetBreakdown {
  symbol: string;
  totalStaked: string;
  totalRewards: string;
  percentage: number;
}

export interface Transaction {
  id: string;
  type: 'stake' | 'unstake' | 'claim';
  amount: string;
  token: string;
  chainId: number;
  transactionHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface WalletConnectOptions {
  walletAddress: string;
  signature: string;
  message: string;
}
