import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
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
        const response = await axios.get('http://localhost:3001/api/yield/stats');
        setStats(response.data);
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
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Hero Stats Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-[#1A1C23] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <div className="w-12 h-12 bg-blue-500 rounded-full blur-xl" />
           </div>
           <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Current APR</p>
           <h4 className="text-3xl font-bold text-white">{stats?.apr || '0.00'}%</h4>
           <p className="text-[10px] text-blue-400 mt-2 font-medium">Paid in native ETH</p>
        </div>

        <div className="bg-[#1A1C23] border border-white/5 rounded-2xl p-6">
           <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Total ETH Distributed</p>
           <h4 className="text-3xl font-bold text-green-400">{stats?.totalDistributedEth || '0.00'}</h4>
           <div className="w-full bg-white/5 h-1 rounded-full mt-3 overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: '65%' }}
               className="h-full bg-green-500"
             />
           </div>
        </div>

        <div className="bg-[#1A1C23] border border-white/5 rounded-2xl p-6">
           <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Next Harvest</p>
           <h4 className="text-xl font-medium text-white">
             {stats ? new Date(stats.nextEstimatedHarvest).toLocaleDateString() : '--'}
           </h4>
           <p className="text-[10px] text-gray-500 mt-2">Estimated processing time</p>
        </div>
      </motion.div>

      {/* Main Staking Interface */}
      <div className="bg-[#12131A] border border-[#3b82f6]/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Stake $W3B3</h2>
              <p className="text-gray-400 text-sm">Lock your tokens to earn a share of 100% of protocol revenue.</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl px-6 py-4">
               <p className="text-blue-400 text-xs font-semibold uppercase tracking-tighter mb-1">Your ETH Rewards</p>
               <span className="text-2xl font-bold text-white">0.0000 <span className="text-sm text-gray-500">ETH</span></span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input 
                type="number" 
                placeholder="0.00"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-xl font-medium text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-bold text-white rounded-xl transition-colors"
              >
                MAX
              </button>
            </div>

            <button 
              onClick={handleStake}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-5 rounded-2xl transition-all shadow-lg shadow-blue-900/20 transform active:scale-[0.98]"
            >
              Approve & Stake $W3B3
            </button>

            <p className="text-center text-xs text-gray-500 px-4">
              By staking, you enter the Real Yield distribution cycle. Rewards are claimable in ETH every 24 hours after the protocol harvest.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-white/5">
         <BuyW3B3Widget />
      </div>
    </div>
  );
};
