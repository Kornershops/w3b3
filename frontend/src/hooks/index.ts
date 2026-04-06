import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { web3Service } from '../services/web3';
import { apiService } from '../services/api';
import { useUserStore } from '../stores/userStore';

// Hook for wallet connection
export function useWalletConnection() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser, setToken } = useUserStore();

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Connect wallet
      const walletAddress = await web3Service.connectWallet();

      // Sign message
      const message = `Sign this message to connect to W3B3: ${Date.now()}`;
      const signature = await web3Service.signMessage(message);

      // Authenticate with backend
      const response = await apiService.connectWallet(walletAddress, signature, message);

      // Store token internally in state (but safely offloaded to cookies)
      setToken(response.token);
      setUser(response.user);

      return response.user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [setUser, setToken]);

  return { connect, isConnecting, error };
}

// Hook for fetching pools
export function usePools(chainId?: number) {
  return useQuery({
    queryKey: ['pools', chainId],
    queryFn: () => apiService.getPools(chainId),
    staleTime: 60000, // 1 minute
  });
}

// Hook for fetching single pool
export function usePool(poolId: string) {
  return useQuery({
    queryKey: ['pool', poolId],
    queryFn: () => apiService.getPoolById(poolId),
    enabled: !!poolId,
  });
}

// Hook for fetching user stakes
export function useUserStakes() {
  return useQuery({
    queryKey: ['stakes'],
    queryFn: () => apiService.getUserStakes(),
    staleTime: 30000, // 30 seconds
  });
}

// Hook for fetching portfolio
export function usePortfolio() {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: () => apiService.getPortfolio(),
    staleTime: 30000, // 30 seconds
  });
}

// Hook for claiming rewards
export function useClaimRewards() {
  return useMutation({
    mutationFn: (stakeId: string) => apiService.claimRewards(stakeId),
  });
}

// Hook for staking tokens
export function useStakeTokens() {
  const [isStaking, setIsStaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stake = useCallback(
    async (poolAddress: string, amount: string, tokenAddress: string) => {
      try {
        setIsStaking(true);
        setError(null);

        // Approve tokens
        await web3Service.approveToken(tokenAddress, poolAddress, amount);

        // Stake tokens
        const abi = ['function stake(uint256 amount)'];
        const tx = await web3Service.stakeTokens(poolAddress, amount, abi);

        return tx;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to stake tokens';
        setError(errorMessage);
        throw err;
      } finally {
        setIsStaking(false);
      }
    },
    []
  );

  return { stake, isStaking, error };
}

// Hook for unstaking tokens
export function useUnstakeTokens() {
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unstake = useCallback(async (poolAddress: string, amount: string) => {
    try {
      setIsUnstaking(true);
      setError(null);

      const abi = ['function withdraw(uint256 amount)'];
      const tx = await web3Service.unstakeTokens(poolAddress, amount, abi);

      return tx;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unstake tokens';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUnstaking(false);
    }
  }, []);

  return { unstake, isUnstaking, error };
}

// Hook for claiming rewards from contract
export function useClaimContractRewards() {
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const claim = useCallback(async (poolAddress: string) => {
    try {
      setIsClaiming(true);
      setError(null);

      const abi = ['function claimReward()'];
      const tx = await web3Service.claimRewards(poolAddress, abi);

      return tx;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to claim rewards';
      setError(errorMessage);
      throw err;
    } finally {
      setIsClaiming(false);
    }
  }, []);

  return { claim, isClaiming, error };
}

// Hook for getting wallet balance
export function useWalletBalance(address?: string) {
  return useQuery({
    queryKey: ['balance', address],
    queryFn: async () => {
      if (!address) return null;
      return web3Service.getBalance(address);
    },
    enabled: !!address,
    staleTime: 10000, // 10 seconds
  });
}

// Hook for getting token balance
export function useTokenBalance(tokenAddress: string, userAddress?: string) {
  return useQuery({
    queryKey: ['tokenBalance', tokenAddress, userAddress],
    queryFn: async () => {
      if (!userAddress) return null;
      return web3Service.getTokenBalance(tokenAddress, userAddress);
    },
    enabled: !!userAddress && !!tokenAddress,
    staleTime: 10000, // 10 seconds
  });
}
