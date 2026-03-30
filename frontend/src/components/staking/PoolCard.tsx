'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StakingPool } from '@/types';
import Link from 'next/link';
import { ArrowUpRight, Pulse, ShieldWarning, ShieldCheck } from '@phosphor-icons/react';

interface PoolCardProps {
  pool: StakingPool;
  onStake: (id: string) => void;
}

export function PoolCard({ pool, onStake }: PoolCardProps) {
  const parsedApy = parseFloat(pool.apyPercentage.toString());
  const isHighRisk = parsedApy > 20.0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="glass-card relative overflow-hidden group"
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-indigo-500/20 blur-3xl group-hover:bg-indigo-500/30 transition-all duration-500 pointer-events-none" />

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center p-2 shadow-inner">
             {/* Placeholder for Token Logo based on symbol */}
             <div className="font-bold text-lg text-white">{pool.tokenSymbol.charAt(0)}</div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
              {pool.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/10 text-slate-300 border border-white/5">
                Chain ID: {pool.chainId}
              </span>
              <span className="text-xs text-slate-400">
                {pool.tokenSymbol}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Moat Signals */}
      <div className="flex gap-2 mb-6 relative z-10 text-[10px] uppercase font-bold tracking-wider">
        {isHighRisk ? (
          <span className="flex items-center gap-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-1 rounded w-fit">
            <ShieldWarning size={12} weight="fill" /> Unverified Limit
          </span>
        ) : (
          <span className="flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded w-fit">
            <ShieldCheck size={12} /> Audited
          </span>
        )}
        <span className="bg-slate-800/50 text-slate-300 border border-white/5 px-2 py-1 rounded max-w-full truncate">
           Source: {pool.chainId === 1 ? 'Ethereum Mainnet Subnets' : pool.chainId === 137 ? 'Polygon PoS Validators' : 'Arbitrum Sequencer Yield'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
        <div className="bg-black/20 rounded-xl p-3 border border-white/5">
          <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wider">Est. APY</span>
          <span className="text-lg font-bold text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
            {pool.apyPercentage}%
          </span>
        </div>
        <div className="bg-black/20 rounded-xl p-3 border border-white/5">
          <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wider">TVL</span>
          <span className="text-lg font-bold text-white">
            ${Number(pool.tvlAmount).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 relative z-10">
        <button
          onClick={() => onStake(pool.id)}
          className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2 text-sm font-semibold"
        >
          <span>Stake Now</span>
          <ArrowUpRight size={16} />
        </button>
        <Link 
          href={`/pool/${pool.id}`} 
          className="btn-secondary py-2.5 px-4 flex items-center justify-center"
        >
          <Pulse size={18} />
        </Link>
      </div>
    </motion.div>
  );
}
