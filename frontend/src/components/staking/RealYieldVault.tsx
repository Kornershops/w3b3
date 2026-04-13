import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '@/services/api';
import { BuyW3B3Widget } from './BuyW3B3Widget';

interface YieldStats {
  apr: string;
  baseToken: string;
  totalDistributedEth: string;
  lastHarvestAmount: string;
  nextEstimatedHarvest: string;
}

export const RealYieldVault: React.FC = () => {
  const [stats, setStats] = useState<YieldStats | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiService.getYieldStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching yield stats', error);
      }
    };
    fetchStats();
  }, []);

  const handleStake = () => {
     // Mocking the staking transaction
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6 px-1">
      {/* Dynamic Statistics Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
      >
        <div className="bg-indigo-900/10 border border-white/5 backdrop-blur-xl rounded-[24px] p-5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <div className="w-12 h-12 bg-indigo-500 rounded-full blur-xl" />
           </div>
           <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black mb-1 leading-none">Yield APR</p>
           <h4 className="text-2xl sm:text-3xl font-black text-white italic tracking-tighter">{stats?.apr || '0.00'}%</h4>
           <div className="flex items-center gap-1 mt-2">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[9px] text-green-400 font-black uppercase tracking-tighter">Native ETH</span>
           </div>
        </div>

        <div className="bg-indigo-900/10 border border-white/5 backdrop-blur-xl rounded-[24px] p-5">
           <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black mb-1 leading-none">Protocol Payout</p>
           <h4 className="text-2xl sm:text-3xl font-black text-indigo-400 tracking-tighter">{stats?.totalDistributedEth || '0.00'} ETH</h4>
           <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: '65%' }}
               className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
             />
           </div>
        </div>

        <div className="hidden lg:block bg-indigo-900/10 border border-white/5 backdrop-blur-xl rounded-[24px] p-5">
           <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black mb-1 leading-none">Sync Window</p>
           <h4 className="text-lg font-black text-white italic truncate uppercase tracking-tighter">
             {stats ? new Date(stats.nextEstimatedHarvest).toLocaleDateString() : 'PENDING'}
           </h4>
           <p className="text-[10px] text-slate-500 mt-2 font-black uppercase">Next Protocol Harvest</p>
        </div>
      </motion.div>

      {/* Primary Staking Terminal */}
      <div className="bg-[#0A0B0F]/80 border border-indigo-500/20 backdrop-blur-3xl rounded-[32px] p-6 sm:p-10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all hover:border-indigo-500/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/5 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tighter italic uppercase">Vault $W3B3</h2>
              <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-sm">Capture 100% of the cross-chain protocol revenue share by locking your $W3B3 governance assets.</p>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-[20px] px-6 py-4 flex flex-col items-start min-w-[160px]">
               <p className="text-indigo-400 text-[9px] font-black uppercase tracking-widest mb-1">Accumulated Rewards</p>
               <span className="text-xl sm:text-2xl font-black text-white tracking-tighter">0.00 <span className="text-xs text-slate-500 not-italic uppercase font-bold tracking-normal italic ml-1">ETH</span></span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <input 
                type="number" 
                placeholder="0.00"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-[22px] px-6 py-5 text-2xl font-black text-white italic placeholder:text-slate-800 focus:outline-none focus:border-indigo-500/50 transition-all focus:bg-white/[0.05]"
              />
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-[10px] font-black text-indigo-400 rounded-lg transition-all uppercase tracking-widest"
              >
                MAX
              </button>
            </div>

            <button 
              onClick={handleStake}
              className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:scale-[1.01] active:scale-[0.98] text-white font-black text-sm uppercase tracking-[0.2em] py-5 rounded-[22px] transition-all shadow-2xl shadow-indigo-600/20"
            >
              Initialize Vault Locking
            </button>

            <div className="flex items-center gap-3 justify-center px-4">
               <div className="h-px bg-white/5 flex-1" />
               <p className="text-center text-[9px] text-slate-600 font-black uppercase tracking-widest">Secure Institutional Settlement</p>
               <div className="h-px bg-white/5 flex-1" />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2">
         <BuyW3B3Widget />
      </div>
    </div>
  );
};
