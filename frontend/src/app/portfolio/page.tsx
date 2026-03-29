'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { apiService } from '@/services/api';
import { UserStake } from '@/types';
import { motion } from 'framer-motion';
import { LiveRewardTicker } from '@/components/portfolio/LiveRewardTicker';
import { WalletCards } from 'lucide-react';

export default function PortfolioPage() {
  const { address, isConnected } = useAccount();
  const [stakes, setStakes] = useState<UserStake[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected) loadStakes();
    else setLoading(false);
  }, [isConnected]);

  const loadStakes = async () => {
    try {
      const data = await apiService.getUserStakes();
      // data may be paginated Api response depending on API 
      setStakes(data.data || []); 
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (stakeId: string) => {
    try {
      await apiService.claimRewards(stakeId);
      alert('Rewards claimed successfully');
      loadStakes();
    } catch (e: any) {
      alert(e.message || 'Failed to claim');
    }
  };

  if (!isConnected) {
    return (
      <div className="container-max py-32 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
           <WalletCards className="w-12 h-12 text-slate-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Connect Wallet</h2>
        <p className="text-slate-400 max-w-md">
          Please interact with the wallet button above to synchronize and securely view your yield-bearing assets on W3B3.
        </p>
      </div>
    );
  }

  // Aggregate stats
  const totalStaked = stakes.reduce((acc, s) => acc + parseFloat(s.amountStaked.toString()), 0);

  return (
    <div className="container-max py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
          Your <span className="text-gradient">Portfolio</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Main Stat Card */}
          <div className="glass-card bg-indigo-900/10 border-indigo-500/20 md:col-span-2">
            <span className="text-indigo-300 font-semibold mb-2 block uppercase tracking-wider text-sm">Total Value Secured</span>
            <div className="text-5xl font-bold text-white mb-4">
              ${totalStaked.toLocaleString()}
              <span className="text-2xl text-slate-500 ml-2">USD</span>
            </div>
            <div className="w-full bg-indigo-900/30 rounded-full h-1 mt-6">
               <div className="bg-indigo-500 w-full h-full rounded-full animate-pulse" />
            </div>
          </div>
          
          <div className="glass-card">
            <span className="text-slate-400 mb-2 block uppercase tracking-wider text-sm">Active Positions</span>
            <h3 className="text-4xl font-bold text-white">{stakes.length}</h3>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-6">Active Yield</h3>

        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="h-32 glass-panel rounded-2xl animate-pulse" />
          ) : stakes.length === 0 ? (
            <p className="text-slate-400 py-8 px-4 text-center glass-panel rounded-2xl">
              No active stakes located. Head to the Explore page to secure yield.
            </p>
          ) : (
            stakes.map(stake => (
              <motion.div key={stake.id} initial={{opacity:0}} animate={{opacity:1}} className="glass-card flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                   <h4 className="text-xl font-bold text-white mb-1">
                     {stake.pool?.name || 'Unknown Pool'}
                   </h4>
                   <p className="text-slate-400 text-sm">
                     Staked: {parseFloat(stake.amountStaked.toString())} 
                   </p>
                </div>
                
                <div className="flex-1 md:text-center w-full bg-black/20 p-4 rounded-xl border border-white/5">
                   <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wider">Live Accumulation</span>
                   <LiveRewardTicker 
                     stakedAmount={parseFloat(stake.amountStaked.toString())}
                     apyPercentage={parseFloat(stake.pool?.apyPercentage?.toString() || '0')}
                     initialRewardsClaimed={parseFloat(stake.rewardsClaimed.toString())}
                     stakedAt={stake.stakedAt}
                   />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                   <button 
                     onClick={() => handleClaim(stake.id)}
                     className="btn-primary flex-1"
                   >
                     Claim
                   </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
