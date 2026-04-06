import { 
  User, 
  StakingPool, 
  UserStake, 
  Reward, 
  Portfolio, 
  PortfolioBreakdown, 
  AuthResponse,
  PortfolioTransaction,
  TreasuryHoldings
} from '@w3b3/shared';

// Re-export shared types for backend use
export { 
  User, 
  StakingPool, 
  UserStake, 
  Reward, 
  Portfolio, 
  PortfolioBreakdown, 
  AuthResponse,
  PortfolioTransaction,
  TreasuryHoldings
};

// Backend-specific application types
export interface ApiError {
  status: number;
  message: string;
  details?: Record<string, string>;
}

export interface JwtPayload {
  userId: string;
  walletAddress: string;
  role: string;
  iat: number;
  exp: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export interface PoolFilter {
  chainId?: number;
  isActive?: boolean;
  tokenSymbol?: string;
  minApy?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
