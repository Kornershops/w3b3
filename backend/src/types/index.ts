// Backend TypeScript Types

export interface User {
  id: string;
  walletAddress: string;
  chainId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StakingPool {
  id: string;
  name: string;
  chainId: number;
  contractAddress: string;
  tokenSymbol: string;
  tokenDecimals: number;
  apyPercentage: Decimal;
  tvlAmount: Decimal;
  minimumStake: Decimal;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStake {
  id: string;
  userId: string;
  poolId: string;
  amountStaked: Decimal;
  rewardsClaimed: Decimal;
  transactionHash: string | null;
  stakedAt: Date;
  unstakedAt: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reward {
  id: string;
  stakeId: string;
  userId: string;
  amount: Decimal;
  claimedAt?: Date;
  transactionHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  userId: string;
  walletAddress: string;
  iat: number;
  exp: number;
}

export interface AuthRequest {
  walletAddress: string;
  signature: string;
  message: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface ApiError {
  status: number;
  message: string;
  details?: Record<string, string>;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
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

export interface PoolFilter {
  chainId?: number;
  isActive?: boolean;
  minApy?: number;
  maxApy?: number;
}

export interface StakeFilter {
  userId: string;
  isActive?: boolean;
  poolId?: string;
}

export interface WebSocketMessage {
  type: string;
  data: Record<string, unknown>;
  timestamp: Date;
}

export interface PoolUpdateEvent {
  poolId: string;
  apy: string;
  tvl: string;
  timestamp: Date;
}

export interface RewardAccrualEvent {
  stakeId: string;
  amount: string;
  totalRewards: string;
  timestamp: Date;
}

export interface TransactionConfirmationEvent {
  transactionHash: string;
  type: 'stake' | 'unstake' | 'claim';
  status: 'confirmed' | 'failed';
  timestamp: Date;
}

export interface Portfolio {
  userId: string;
  totalStaked: string;
  totalRewards: string;
  activeStakes: number;
  totalStakes: number;
  breakdown: PortfolioBreakdown[];
}

export interface PortfolioBreakdown {
  poolId: string;
  poolName: string;
  amountStaked: string;
  rewardsClaimed: string;
  apy: string;
  isActive: boolean;
}

// Decimal type from Prisma
export type Decimal = any;
