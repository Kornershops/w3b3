import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import { ApiResponse, StakingPool, UserStake, Portfolio, AuthResponse } from '../types';

const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  // Ensure we always end with /api for backend route matching
  return url.endsWith('/api') ? url : `${url}/api`;
};

const API_BASE_URL = getBaseUrl();

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
    const response = await this.client.get<ApiResponse<StakingPool[]>>('/pools', {
      params: { chain: chainId, page, limit },
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
}

export const apiService = new ApiService();
