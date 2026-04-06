import * as Shared from '@w3b3/shared';

// Re-export shared models for application use
export type User = Shared.User;
export type StakingPool = Shared.StakingPool;
export type UserStake = Shared.UserStake;
export type Reward = Shared.Reward;
export type Portfolio = Shared.Portfolio;
export type PortfolioBreakdown = Shared.PortfolioBreakdown;

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
