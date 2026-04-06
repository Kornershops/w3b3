'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import { StakingPool } from '@/types';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, ShieldWarning } from '@phosphor-icons/react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { StakeModal } from '@/components/staking/StakeModal';

export default function PoolDetailPage({ params }: { params: { id: string } }) {
  const { isConnected } = useAccount();
  const [pool, setPool] = useState<StakingPool | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);

  const loadPool = useCallback(async () => {
    try {
      const data = await apiService.getPoolById(params.id);
      setPool(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadPool();
  }, [loadPool]);

  const handleDeposit = () => {
    if (!isConnected) {
       alert('Connect Wallet');
       return;
    }
    setIsStakeModalOpen(true);
  };

  if (loading) return <div className="container-max py-24 animate-pulse"><div className="h-64 glass-panel rounded-2xl w-full" /></div>;
  if (!pool) return <div className="text-center py-24 text-slate-400">Pool not found</div>;

  return (
    <div className="container-max py-12">
      <Link href="/explore" className="inline-flex items-center text-slate-400 hover:text-indigo-400 transition-colors mb-8 group gap-2">
        <span className="group-hover:-translate-x-1 transition-transform inline-block">
          <ArrowLeft size={16} />
        </span>
        Back to Pools
      </Link>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Detail Body */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card flex items-center gap-6">
             <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10 flex flex-col items-center justify-center p-2 shadow-inner">
               <span className="font-bold text-3xl text-white drop-shadow-lg">{pool.tokenSymbol.charAt(0)}</span>
             </div>
             <div>
                <h1 className="text-4xl font-bold text-white mb-2">{pool.name}</h1>
                <div className="flex gap-3">
                  <span className="px-3 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-sm font-semibold flex items-center gap-1">
                    <CheckCircle size={14} /> Verified Source
                  </span>
                  <span className="px-3 py-1 rounded bg-white/5 text-slate-300 border border-white/10 text-sm">
                    Chain: {pool.chainId}
                  </span>
                </div>
             </div>
          </div>

          <div className="glass-card">
            <h3 className="text-xl font-bold text-white mb-4">About this Pool</h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              This pool natively aggregates staking yield dynamically against {pool.tokenSymbol} liquidity on chain ID {pool.chainId}. 
              Returns are evaluated algorithmically and accrued millisecond by millisecond. Contract dependencies are vetted and actively Pausable via the protocol administrator.
            </p>

            <div className="bg-black/20 rounded-xl p-4 border border-white/5 flex gap-3 items-start">
               <span className="mt-1">
                 <ShieldWarning color="#eab308" size={20} weight="fill" />
               </span>
               <p className="text-sm text-slate-500">
                 Smart contracts carry intrinsic risk. While this pool carries a W3B3 verified signature, always evaluate your risk appetite before deploying capital on-chain.
               </p>
            </div>
          </div>
        </div>

        {/* Interaction Panel */}
        <div className="flex flex-col gap-6">
          <div className="glass-card space-y-4">
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 uppercase tracking-widest block">Live APY</span>
                <span className="text-green-400 font-bold text-lg drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
                  {pool.apyPercentage}%
                </span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 uppercase tracking-widest block">TVL</span>
                <span className="text-white font-bold text-lg">
                  ${Number(pool.tvlAmount).toLocaleString()}
                </span>
             </div>
             <hr className="border-white/10 my-4" />
             
             <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                <span className="text-xs text-slate-500 font-semibold mb-2 block uppercase tracking-wide">1 Year Earnings Estimator</span>
                <div className="text-2xl font-mono text-indigo-300">
                  ≈ $1,240 <span className="text-sm font-sans text-slate-500">/ 10k Limit</span>
                </div>
             </div>

             <button onClick={handleDeposit} className="w-full btn-primary text-center mt-2 py-4 text-lg">
                Deposit {pool.tokenSymbol}
             </button>
          </div>
        </div>
      </motion.div>

      {pool && (
        <StakeModal 
          pool={pool} 
          isOpen={isStakeModalOpen} 
          onClose={() => setIsStakeModalOpen(false)} 
          onSuccess={loadPool} 
        />
      )}
    </div>
  );
}
