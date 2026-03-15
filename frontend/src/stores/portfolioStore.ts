import { create } from 'zustand';
import { Portfolio, UserStake, Transaction } from '../types';

interface PortfolioStore {
  portfolio: Portfolio | null;
  stakes: UserStake[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;

  setPortfolio: (portfolio: Portfolio | null) => void;
  setStakes: (stakes: UserStake[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addStake: (stake: UserStake) => void;
  removeStake: (stakeId: string) => void;
  addTransaction: (transaction: Transaction) => void;
  updateStake: (stakeId: string, updates: Partial<UserStake>) => void;
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  portfolio: null,
  stakes: [],
  transactions: [],
  isLoading: false,
  error: null,

  setPortfolio: (portfolio) =>
    set({ portfolio }),

  setStakes: (stakes) =>
    set({ stakes }),

  setTransactions: (transactions) =>
    set({ transactions }),

  setIsLoading: (isLoading) =>
    set({ isLoading }),

  setError: (error) =>
    set({ error }),

  addStake: (stake) =>
    set((state) => ({
      stakes: [...state.stakes, stake],
    })),

  removeStake: (stakeId) =>
    set((state) => ({
      stakes: state.stakes.filter((stake) => stake.id !== stakeId),
    })),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),

  updateStake: (stakeId, updates) =>
    set((state) => ({
      stakes: state.stakes.map((stake) =>
        stake.id === stakeId ? { ...stake, ...updates } : stake
      ),
    })),
}));
