import { create } from 'zustand';
import { StakingPool } from '../types';

interface PoolStore {
  pools: StakingPool[];
  selectedPool: StakingPool | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    chainId?: number;
    search?: string;
    sortBy?: 'apy' | 'tvl' | 'name';
  };

  setPools: (pools: StakingPool[]) => void;
  setSelectedPool: (pool: StakingPool | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: PoolStore['filters']) => void;
  addPool: (pool: StakingPool) => void;
  updatePool: (poolId: string, updates: Partial<StakingPool>) => void;
}

export const usePoolStore = create<PoolStore>((set) => ({
  pools: [],
  selectedPool: null,
  isLoading: false,
  error: null,
  filters: {},

  setPools: (pools) =>
    set({ pools }),

  setSelectedPool: (pool) =>
    set({ selectedPool: pool }),

  setIsLoading: (isLoading) =>
    set({ isLoading }),

  setError: (error) =>
    set({ error }),

  setFilters: (filters) =>
    set({ filters }),

  addPool: (pool) =>
    set((state) => ({
      pools: [...state.pools, pool],
    })),

  updatePool: (poolId, updates) =>
    set((state) => ({
      pools: state.pools.map((pool) =>
        pool.id === poolId ? { ...pool, ...updates } : pool
      ),
      selectedPool:
        state.selectedPool?.id === poolId
          ? { ...state.selectedPool, ...updates }
          : state.selectedPool,
    })),
}));
