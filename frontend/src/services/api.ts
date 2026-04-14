import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { ApiResponse, StakingPool, UserStake, Portfolio, AuthResponse } from '../types';
import { API_BASE_URL } from '../utils/network';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Required for HttpOnly cookies
    });

    // Configure Retry Logic
    axiosRetry(this.client, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        // Retry on network errors or 5xx status codes
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 503;
      },
    });

    // Handle errors (Auth context relies on HttpOnly cookies now)
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Only redirect if we are not already on the login/landing page
          if (window.location.pathname !== '/') {
            window.location.href = '/';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async connectWallet(walletAddress: string, signature: string, message: string) {
    const response = await this.client.post<AuthResponse>('/auth/connect', {
      walletAddress,
      signature,
      message,
    });
    return response.data;
  }

  async logout() {
    await this.client.post('/auth/logout');
  }

  // Pools
  async getPools(chainId?: number, page = 1, limit = 20) {
    const params: { page: number; limit: number; chain?: number } = { page, limit };
    if (chainId !== undefined) {
      params.chain = chainId;
    }
    
    const response = await this.client.get<ApiResponse<StakingPool[]>>('/pools', {
      params,
    });
    return response.data.data || [];
  }

  async stake(poolId: string, amount: number, transactionHash: string) {
    const response = await this.client.post('/stakes', { poolId, amountStaked: amount, transactionHash });
    return response.data;
  }

  async getPoolById(poolId: string) {
    const response = await this.client.get<StakingPool>(`/pools/${poolId}`);
    return response.data;
  }

  async getPoolApy(poolId: string) {
    const response = await this.client.get(`/pools/${poolId}/apy`);
    return response.data;
  }

  // Stakes
  async getUserStakes(page = 1, limit = 20) {
    const response = await this.client.get<ApiResponse<UserStake[]>>('/stakes', {
      params: { page, limit },
    });
    return response.data;
  }

  async getStakeById(stakeId: string) {
    const response = await this.client.get<UserStake>(`/stakes/${stakeId}`);
    return response.data;
  }

  async claimRewards(stakeId: string) {
    const response = await this.client.post('/stakes/claim', { stakeId });
    return response.data;
  }

  // Portfolio
  async getPortfolio() {
    const response = await this.client.get<Portfolio>('/portfolio');
    return response.data;
  }

  async getPortfolioBreakdown() {
    const response = await this.client.get('/portfolio/breakdown');
    return response.data;
  }

  async getPortfolioHistory(page = 1, limit = 20) {
    const response = await this.client.get('/portfolio/history', {
      params: { page, limit },
    });
    return response.data;
  }

  // Global Protocol Stats
  async getTreasury() {
    const response = await this.client.get('/portfolio/treasury');
    return response.data;
  }

  async getYieldStats() {
    const response = await this.client.get('/yield/stats');
    return response.data;
  }

  // Treasury & Harvesting
  async getTreasuryStatus() {
    const response = await this.client.get('/treasury/status');
    return response.data;
  }

  async triggerHarvest() {
    const response = await this.client.post('/treasury/harvest');
    return response.data;
  }

  // Recursive Yield & Leverage
  async getRecursiveStrategies() {
    const response = await this.client.get('/recursive');
    return response.data;
  }

  async simulateRecursiveAction(strategyId: string, amount: string, leverage: number) {
    const response = await this.client.post('/recursive/simulate', { strategyId, amount, leverage });
    return response.data;
  }
}

export const apiService = new ApiService();
