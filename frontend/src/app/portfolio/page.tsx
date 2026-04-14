'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { apiService } from '@/services/api';
import { UserStake } from '@/types';
import { motion } from 'framer-motion';
import { LiveRewardTicker } from '@/components/portfolio/LiveRewardTicker';
import { TreasuryDashboard } from '@/components/portfolio/TreasuryDashboard';
import { RealYieldVault } from '@/components/staking/RealYieldVault';
import { Wallet, ChartLineUp, Vault } from '@phosphor-icons/react';

import { PortfolioPerformanceChart } from '@/components/portfolio/PortfolioPerformanceChart';
import { Portfolio } from '@/types';

export default function PortfolioPage() {
  const { isConnected } = useAccount();
  const [stakes, setStakes] = useState<UserStake[]>([]);
  const [summary, setSummary] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected) loadPortfolioData();
    else setLoading(false);
  }, [isConnected]);

  const loadPortfolioData = async () => {
    try {
      const [stakesData, summaryData] = await Promise.all([
        apiService.getUserStakes(),
        apiService.getPortfolio()
      ]);
      
      setStakes(stakesData.data || []); 
      setSummary(summaryData);
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
      loadPortfolioData();
    } catch (e: any) {
      alert(e.message || 'Failed to claim');
    }
  };

  if (!isConnected) {
    return (
      <div className="container-max py-32 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
           <Wallet size={48} color="#64748b" weight="duotone" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Connect Wallet</h2>
        <p className="text-slate-400 max-w-md">
          Please interact with the wallet button above to synchronize and securely view your yield-bearing assets on W3B3.
        </p>
      </div>
    );
  }

  return (
    <div className="container-max py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-3xl md:text-5xl font-black text-white mb-8 italic tracking-tighter uppercase uppercase">
          Institutional <span className="text-indigo-400 text-shadow-glow">Portfolio</span>
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Global Net Worth Stat Card */}
          <div className="glass-panel p-8 bg-indigo-950/20 border-indigo-500/20 lg:col-span-2 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <ChartLineUp size={160} weight="duotone" />
            </div>
            <div className="flex items-center gap-2 mb-2">
               <span className="text-indigo-300 font-black uppercase tracking-widest text-[10px]">Net Value (Global Aggregate)</span>
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </div>
            <div className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter italic">
              ${Number(summary?.totalStaked || 0).toLocaleString()}
              <span className="text-2xl text-slate-500 ml-3 font-light non-italic font-mono">USD</span>
            </div>
            <div className="flex items-center gap-6 mt-8">
               <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">Projected Annual</p>
                  <p className="text-lg font-black text-white italic tracking-tighter">${Number(summary?.estimatedAnnual || 0).toLocaleString()}</p>
               </div>
               <div className="h-8 w-px bg-white/5" />
               <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">Total Rewards</p>
                  <p className="text-lg font-black text-green-400 italic tracking-tighter">${Number(summary?.totalRewards || 0).toLocaleString()}</p>
               </div>
            </div>
          </div>
          
          <div className="space-y-6">
             <div className="glass-panel p-8 rounded-3xl bg-slate-900/40 border-white/5 flex flex-col justify-between">
                <div>
                  <span className="text-slate-400 mb-2 block uppercase tracking-wider text-[10px] font-black">Active Vaults</span>
                  <h3 className="text-5xl font-black text-white italic tracking-tighter">{summary?.activeStakes || 0}</h3>
                </div>
                <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-6">
                   <Vault size={16} weight="duotone" />
                   SECURED & VERIFIED
                </div>
             </div>
             
             <div className="glass-panel p-8 rounded-3xl bg-slate-900/40 border-white/5">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 leading-none">Net Alpha Gain</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black text-green-400 italic tracking-tighter">+{summary?.netGain || '0'}%</h3>
                  <p className="text-[10px] text-slate-600 font-bold">VS MARKET AVG</p>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            <PortfolioPerformanceChart />
            <TreasuryDashboard />
        </div>

        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
                <Vault size={24} weight="duotone" />
             </div>
             <h3 className="text-2xl font-bold text-white">Native $W3B3 Staking</h3>
          </div>
          <RealYieldVault />
        </div>

        <h3 className="text-2xl font-bold text-white mb-6">Market Yield Positions</h3>

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
