'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowsClockwise, 
  Lightning, 
  TrendUp, 
  ShieldCheck, 
  Info,
  CaretRight,
  ChartLineUp
} from '@phosphor-icons/react';

/**
 * RecursiveStrategyDashboard
 * A high-end capital efficiency dashboard for Phase 13: Recursive Yield.
 * Allows users to review and execute leveraged LST looping strategies.
 */
export function RecursiveStrategyDashboard() {
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  const strategies = [
    { 
      id: 'strat-eth-001', 
      name: 'ETH LST Recursive Loop', 
      apy: '8.2%', 
      risk: 'MEDIUM', 
      leverage: 2.5, 
      details: 'Stakes ETH for stETH, borrows USDT to buy more stETH. Optimized for 3.5x cap.' 
    },
    { 
      id: 'strat-stable-001', 
      name: 'Delta-Neutral Stable Yield', 
      apy: '12.5%', 
      risk: 'LOW', 
      leverage: 1.0, 
      details: 'Market-neutral strategy utilizing the $w3USD peg stability and perp hedging.' 
    }
  ];

  return (
    <div className="space-y-8 pb-32">
      <header>
        <div className="flex items-center gap-3 mb-2">
           <div className="p-2 bg-amber-500/10 rounded-lg">
              <Lightning size={24} className="text-amber-400" weight="fill" />
           </div>
           <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Capital Efficiency</h1>
        </div>
        <p className="text-slate-500 text-sm font-medium">Deploy advanced recursive strategies to multiply your staking alpha.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {strategies.map((strat) => (
          <motion.div 
            key={strat.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`glass-card cursor-pointer border-2 transition-all ${
              selectedStrategy === strat.id ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/5 bg-white/[0.02] hover:border-white/20'
            }`}
            onClick={() => setSelectedStrategy(strat.id)}
          >
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="text-xl font-black text-white italic tracking-tighter">{strat.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                     <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                       strat.risk === 'LOW' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
                     }`}>
                       {strat.risk} RISK
                     </span>
                     <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                       MAX LEVERAGE: {strat.leverage}X
                     </span>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Estimated APY</p>
                  <p className="text-2xl font-black text-green-400 italic tracking-tighter leading-none">{strat.apy}</p>
               </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              {strat.details}
            </p>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-4 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                  <div className="flex items-center gap-1">
                     <ArrowsClockwise size={14} />
                     <span>AUTO-REBALANCE</span>
                  </div>
                  <div className="flex items-center gap-1">
                     <ShieldCheck size={14} className="text-indigo-400" />
                     <span>INSURED</span>
                  </div>
               </div>
               <CaretRight size={20} className="text-slate-600" />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedStrategy && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="glass-card bg-indigo-500/5 border-indigo-500/20"
          >
            <div className="flex items-center gap-3 mb-8">
               <ChartLineUp size={24} className="text-indigo-400" weight="fill" />
               <h2 className="text-lg font-black text-white italic tracking-tighter uppercase">Execution Simulator</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <div className="bg-black/40 rounded-2xl p-6 border border-white/5">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Net Health Factor</p>
                  <p className="text-2xl font-black text-white italic tracking-tighter">1.45</p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="w-[70%] h-full bg-green-500" />
                  </div>
               </div>
               <div className="bg-black/40 rounded-2xl p-6 border border-white/5">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Liquidation Entry</p>
                  <p className="text-2xl font-black text-red-400 italic tracking-tighter">$2,840.50</p>
                  <p className="text-[9px] text-slate-600 font-bold uppercase mt-1">ETH Mark Price</p>
               </div>
               <div className="bg-black/40 rounded-2xl p-6 border border-white/5">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Protocol Stability Fee</p>
                  <p className="text-2xl font-black text-white italic tracking-tighter">0.5%</p>
                  <p className="text-[9px] text-slate-600 font-bold uppercase mt-1">Deducted from Alpha</p>
               </div>
            </div>

            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm py-5 rounded-2xl shadow-xl shadow-indigo-600/20 uppercase tracking-[0.2em] transition-all active:scale-95">
              Confirm & Execute Recursive Loop
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
