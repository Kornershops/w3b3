import { apiService as api } from './api';

export interface TreasuryAsset {
  symbol: string;
  balance: string;
  valueUsd: string;
}

export interface TreasuryStatus {
  totalValuationUsd: string;
  assets: TreasuryAsset[];
  totalEthDistributed: string;
  lastUpdated: string;
}

/**
 * Module 1: Institutional Alpha
 * TreasuryService - Frontend client for protocol health metrics.
 */
export const treasuryService = {
  /**
   * Fetches the high-fidelity protocol treasury holdings.
   */
  getStatus: async (): Promise<TreasuryStatus> => {
    return await api.getTreasuryStatus();
  },

  /**
   * Triggers the administrative fee harvesting cycle.
   */
  triggerHarvest: async () => {
    return await api.triggerHarvest();
  }
};
