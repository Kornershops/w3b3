import axios, { AxiosInstance } from 'axios';
import { ApiResponse, StakingPool, UserStake, Portfolio, AuthResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/';
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
}

export const apiService = new ApiService();
