'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { apiService } from '@/services/api';
import { PoolCard } from '@/components/staking/PoolCard';
import { StakeModal } from '@/components/staking/StakeModal';
import { StakingPool } from '@/types';
import { motion } from 'framer-motion';

export default function ExplorePage() {
  const { isConnected } = useAccount();
  const [pools, setPools] = useState<StakingPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [stakePool, setStakePool] = useState<StakingPool | null>(null);

  useEffect(() => {
    loadPools();
  }, []);

  const loadPools = async () => {
    setLoading(true);
    try {
      const data = await apiService.getPools();
      console.log('API RESPONSE: Pools Loaded', data);
      setPools(data);
    } catch (error) {
      console.error('CRITICAL: Failed to load pools from server:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStake = (poolId: string) => {
    if (!isConnected) {
       alert('Please connect your wallet first!');
       return;
    }

    const pool = pools.find(p => p.id === poolId);
    if (pool) {
      setStakePool(pool);
    }
  };

  return (
    <div className="container-max py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold font-sans text-white mb-4">
          Explore <span className="text-gradient">Opportunities</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          Discover vetted staking pools, compare deep liquidity yields, and put your assets to work across multiple blockchains instantly.
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse border border-white/5"></div>
          ))}
        </div>
      ) : pools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pools.map((pool) => (
            <PoolCard key={pool.id} pool={pool} onStake={handleStake} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center glass-panel rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
             <span className="text-3xl">🔍</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No active pools found</h3>
          <p className="text-slate-400">Try adjusting your filters or checking back later.</p>
        </div>
      )}

      {stakePool && (
        <StakeModal 
          pool={stakePool} 
          isOpen={true} 
          onClose={() => setStakePool(null)} 
          onSuccess={loadPools} 
        />
      )}
    </div>
  );
}
