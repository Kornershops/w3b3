'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StakingPool } from '@/types';
import Link from 'next/link';
import { 
  ArrowUpRight, 
  Pulse, 
  ShieldWarning, 
  ShieldCheck, 
  CaretUp, 
  CaretDown, 
  TrendUp, 
  TrendDown, 
  Info 
} from '@phosphor-icons/react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface PoolCardProps {
  pool: StakingPool;
  onStake: (id: string) => void;
}

export function PoolCard({ pool, onStake }: PoolCardProps) {
  const parsedApy = parseFloat(pool.apyPercentage.toString());
  const isHighRisk = parsedApy > 20.0;
  
  const analytics = pool.analytics;
  const isBullish = analytics?.trend === 'BULLISH';
  const isBearish = analytics?.trend === 'BEARISH';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="glass-card relative overflow-hidden group p-4 sm:p-6"
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-indigo-500/10 blur-3xl group-hover:bg-indigo-500/20 transition-all duration-500 pointer-events-none" />

      <div className="flex justify-between items-start mb-4 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center p-2 shadow-inner">
             <div className="font-black text-base sm:text-lg text-white">{pool.tokenSymbol.charAt(0)}</div>
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-black text-white group-hover:text-indigo-300 transition-colors truncate tracking-tighter">
              {pool.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5 uppercase tracking-wider">
                {pool.tokenSymbol}
              </span>
            </div>
          </div>
        </div>

        {/* Trend Indicator Badge */}
        {analytics && (
          <div className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] sm:text-[10px] font-black border uppercase tracking-widest ${
            isBullish ? 'bg-green-500/10 text-green-400 border-green-500/20' :
            isBearish ? 'bg-red-500/10 text-red-400 border-red-500/20' :
            'bg-slate-500/10 text-slate-400 border-slate-500/20'
          }`}>
            {isBullish ? <TrendUp size={12} weight="bold" /> : 
             isBearish ? <TrendDown size={12} weight="bold" /> : null}
            <span className="hidden xs:inline">{analytics.trend}</span>
          </div>
        )}
      </div>

      {/* Analytics Visualization (Sparkline) */}
      <div className="h-12 sm:h-16 w-full mb-4 bg-black/30 rounded-xl overflow-hidden relative border border-white/5">
        {analytics?.historicalTvl ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.historicalTvl}>
              <YAxis domain={['auto', 'auto']} hide />
              <Line 
                type="monotone" 
                dataKey="tvl" 
                stroke={isBullish ? '#4ade80' : isBearish ? '#f87171' : '#818cf8'} 
                strokeWidth={2} 
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Pulse size={16} className="text-slate-700 animate-pulse" />
          </div>
        )}
        <div className="absolute top-1 right-2 text-[7px] text-slate-500 font-black uppercase tracking-widest bg-black/40 px-1 rounded">7D TVL</div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-5 relative z-10">
        <div className="bg-white/5 rounded-xl p-3 border border-white/5 relative group/info">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-widest font-black">APY</span>
            {analytics && (
              <div className="text-slate-600">
                <Info size={12} weight="bold" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-2 bg-slate-900 border border-white/10 rounded-lg text-[9px] text-slate-300 opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                  Confidence: {Math.round(analytics.confidenceScore * 100)}%<br/>
                  Projected: {analytics.projected7DayApy}%
                </div>
              </div>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg sm:text-xl font-black text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.2)]">
              {pool.apyPercentage}%
            </span>
            {analytics && (
              <span className={`text-[9px] font-black flex items-center ${
                isBullish ? 'text-green-500' : isBearish ? 'text-red-500' : 'text-slate-500'
              }`}>
                {isBullish ? <CaretUp weight="bold" /> : isBearish ? <CaretDown weight="bold" /> : null}
                {Math.abs(analytics.projected7DayApy - parsedApy).toFixed(1)}%
              </span>
            )}
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-widest block mb-1 font-black">TVL</span>
          <span className="text-lg sm:text-xl font-black text-white tracking-tighter">
            ${(Number(pool.tvlAmount) / 1000000).toFixed(1)}M
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 relative z-10">
        <button
          onClick={() => onStake(pool.id)}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-2.5 sm:py-3 flex items-center justify-center gap-2 text-[11px] sm:text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/10 active:scale-95"
        >
          <span>Stake</span>
          <ArrowUpRight size={14} weight="bold" />
        </button>
        <Link 
          href={`/pool/${pool.id}`} 
          className="bg-slate-800/50 hover:bg-slate-700 text-slate-300 rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 flex items-center justify-center border border-white/5 transition-all"
        >
          <Pulse size={16} weight="bold" />
        </Link>
      </div>
    </motion.div>
  );
}
