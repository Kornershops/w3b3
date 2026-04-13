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
      className="glass-card relative overflow-hidden group"
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-indigo-500/20 blur-3xl group-hover:bg-indigo-500/30 transition-all duration-500 pointer-events-none" />

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center p-2 shadow-inner">
             <div className="font-bold text-lg text-white">{pool.tokenSymbol.charAt(0)}</div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
              {pool.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                {pool.tokenSymbol}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-tighter">
                ID: {pool.id.substring(0, 8)}
              </span>
            </div>
          </div>
        </div>

        {/* Trend Indicator Badge */}
        {analytics && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border ${
            isBullish ? 'bg-green-500/10 text-green-400 border-green-500/20' :
            isBearish ? 'bg-red-500/10 text-red-400 border-red-500/20' :
            'bg-slate-500/10 text-slate-400 border-slate-500/20'
          }`}>
            {isBullish ? <TrendUp size={12} weight="bold" /> : 
             isBearish ? <TrendDown size={12} weight="bold" /> : null}
            {analytics.trend}
          </div>
        )}
      </div>

      {/* Analytics Visualization (Sparkline) */}
      <div className="h-16 w-full mb-4 bg-black/10 rounded-lg overflow-hidden relative border border-white/5">
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
            <Pulse size={20} className="text-slate-600 animate-pulse" />
          </div>
        )}
        <div className="absolute bottom-1 right-2 text-[8px] text-slate-500 font-mono">7D TVL MOMENTUM</div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
        <div className="bg-black/20 rounded-xl p-3 border border-white/5 relative group/info">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Est. APY</span>
            {analytics && (
              <div className="text-slate-500">
                <Info size={12} />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-2 bg-slate-900 border border-white/10 rounded-lg text-[9px] text-slate-300 opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                  Confidence: {Math.round(analytics.confidenceScore * 100)}%<br/>
                  Projected: {analytics.projected7DayApy}%
                </div>
              </div>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.3)]">
              {pool.apyPercentage}%
            </span>
            {analytics && (
              <span className={`text-[10px] font-bold flex items-center ${
                isBullish ? 'text-green-400' : isBearish ? 'text-red-400' : 'text-slate-500'
              }`}>
                {isBullish ? <CaretUp /> : isBearish ? <CaretDown /> : null}
                {Math.abs(analytics.projected7DayApy - parsedApy).toFixed(1)}%
              </span>
            )}
          </div>
        </div>
        <div className="bg-black/20 rounded-xl p-3 border border-white/5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1 font-bold">TVL</span>
          <span className="text-xl font-bold text-white tracking-tight">
            ${(Number(pool.tvlAmount) / 1000000).toFixed(1)}M
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 relative z-10">
        <button
          onClick={() => onStake(pool.id)}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2.5 flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-lg active:scale-95"
        >
          <span>Stake Now</span>
          <ArrowUpRight size={14} weight="bold" />
        </button>
        <Link 
          href={`/pool/${pool.id}`} 
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg py-2.5 px-3 flex items-center justify-center border border-white/5 transition-all"
        >
          <Pulse size={16} weight="bold" />
        </Link>
      </div>
    </motion.div>
  );
}
