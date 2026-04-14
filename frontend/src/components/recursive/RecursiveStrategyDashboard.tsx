'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowsClockwise, 
  Lightning, 
  ShieldCheck, 
  CaretRight,
  ChartLineUp
} from '@phosphor-icons/react';

/**
 * RecursiveStrategyDashboard
 * A high-end capital efficiency dashboard for Phase 13: Recursive Yield.
 * Allows users to review and execute leveraged LST looping strategies.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowsClockwise, 
  Lightning, 
  ShieldCheck, 
  CaretRight,
  ChartLineUp,
  Warning,
  CheckCircle,
  Pulse
} from '@phosphor-icons/react';
import { apiService } from '@/services/api';
import { RecursiveStrategy } from '@w3b3/shared';

export function RecursiveStrategyDashboard() {
  const [strategies, setStrategies] = useState<RecursiveStrategy[]>([]);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string | null>(null);
  const [leverage, setLeverage] = useState<number>(1);
  const [amount, setAmount] = useState<string>('1.0');
  const [simulation, setSimulation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedStrategy = strategies.find(s => s.id === selectedStrategyId);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const data = await apiService.getRecursiveStrategies();
        setStrategies(data);
      } catch (err) {
        console.error('Failed to load strategies', err);
      }
    };
    fetchStrategies();
  }, []);

  const runSimulation = useCallback(async () => {
    if (!selectedStrategyId) return;
    setIsLoading(true);
    try {
      const data = await apiService.simulateRecursiveAction(selectedStrategyId, amount, leverage);
      setSimulation(data);
    } catch (err) {
      console.error('Simulation failed', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStrategyId, amount, leverage]);

  useEffect(() => {
    if (selectedStrategyId) {
      runSimulation();
    }
  }, [selectedStrategyId, leverage, runSimulation]);

  const hfColor = simulation?.healthFactor > 1.5 ? 'bg-green-500' : simulation?.healthFactor > 1.2 ? 'bg-amber-500' : 'bg-red-500';

  const handleExecute = async () => {
    if (!selectedStrategy || !simulation?.canExecute) return;
    
    setIsLoading(true);
    try {
      // 1. Simulate Wallet Transaction Hash (In production, this comes from wagmi/viem)
      const mockHash = `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;
      
      // 2. Trigger the Backend Zap Orchestration
      await apiService.executeRecursiveZap({
        poolId: selectedStrategy.metadata?.poolId || '',
        strategyId: selectedStrategy.id,
        amount: amount,
        leverage: leverage,
        transactionHash: mockHash
      });

      alert(`🚀 Recursive Strategy [${selectedStrategy.name}] successfully initiated at ${leverage}x leverage!`);
      // Reset after success
      setSelectedStrategyId(null);
      setSimulation(null);
    } catch (err) {
      console.error('Execution failed', err);
      alert('Strategy execution failed. Please check your balance and try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
              selectedStrategyId === strat.id ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/5 bg-white/[0.02] hover:border-white/20'
            }`}
            onClick={() => {
              setSelectedStrategyId(strat.id);
              setLeverage(strat.currentLeverage);
            }}
          >
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="text-xl font-black text-white italic tracking-tighter">{strat.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                     <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                       strat.riskScore === 'LOW' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
                     }`}>
                       {strat.riskScore} RISK
                     </span>
                     <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                       MAX LEVERAGE: {strat.maxLeverage}X
                     </span>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Projected APY</p>
                  <p className="text-2xl font-black text-green-400 italic tracking-tighter leading-none">{strat.estimatedNetApy}%</p>
               </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Natively loop {strat.baseAsset} against {strat.targetAsset} liquidity. Optimized for target chain efficiency.
            </p>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                   <div className="flex items-center gap-1">
                      <ArrowsClockwise size={14} />
                      <span>AUTO-REBALANCE</span>
                   </div>
                   <div className="flex items-center gap-1 text-indigo-400">
                      <ShieldCheck size={14} weight="fill" />
                      <span>W3B3 CERTIFIED</span>
                   </div>
                </div>
                <CaretRight size={20} className="text-slate-600" />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedStrategyId && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="glass-card bg-indigo-500/5 border-indigo-500/20"
          >
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <ChartLineUp size={24} className="text-indigo-400" weight="fill" />
                  <h2 className="text-lg font-black text-white italic tracking-tighter uppercase">Execution Simulator</h2>
               </div>
               {isLoading && <Pulse size={20} className="text-indigo-400 animate-spin" />}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
               <div className="space-y-6">
                  <div>
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3 block">Strategy Leverage: {leverage}x</label>
                    <input 
                      type="range"
                      min="1"
                      max={selectedStrategy?.maxLeverage || 3.5}
                      step="0.1"
                      value={leverage}
                      onChange={(e) => setLeverage(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-[8px] text-slate-600 font-black mt-2">
                       <span>LOW RISK (1.0X)</span>
                       <span>DYNAMIC ALPHA MAX ({selectedStrategy?.maxLeverage}X)</span>
                    </div>
                  </div>

                  <div className="bg-black/40 rounded-2xl p-6 border border-white/5">
                     <div className="flex justify-between items-center mb-4">
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Simulation Output</p>
                        {simulation?.canExecute ? (
                           <span className="flex items-center gap-1 text-[10px] text-green-400 font-black italic tracking-tighter">
                             <CheckCircle size={12} weight="fill" /> SAFE TO DEPLOY
                           </span>
                        ) : (
                           <span className="flex items-center gap-1 text-[10px] text-red-500 font-black italic tracking-tighter text-shadow-glow-red">
                             <Warning size={12} weight="fill" /> HIGH LIQUIDATION RISK
                           </span>
                        )}
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <p className="text-[9px] text-slate-600 font-bold uppercase mb-1">Loop APY</p>
                           <p className="text-2xl font-black text-green-400 italic tracking-tighter">{simulation?.projectedApy || '0.0'}%</p>
                        </div>
                        <div>
                           <p className="text-[9px] text-slate-600 font-bold uppercase mb-1">Liquidation Mark</p>
                           <p className="text-2xl font-black text-white italic tracking-tighter">${simulation?.liquidationPrice?.toLocaleString() || '0.00'}</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="bg-black/40 rounded-2xl p-6 border border-white/5 h-full flex flex-col justify-center">
                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Simulated Health Factor</p>
                     <p className={`text-4xl font-black italic tracking-tighter ${simulation?.healthFactor > 1.2 ? 'text-white' : 'text-red-500'}`}>
                        {simulation?.healthFactor || '0.00'}
                     </p>
                     <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                       <motion.div 
                         animate={{ width: `${Math.min((simulation?.healthFactor / 2) * 100, 100)}%` }} 
                         className={`h-full ${hfColor} shadow-[0_0_10px_rgba(255,255,255,0.1)]`} 
                       />
                     </div>
                     <p className="text-[9px] text-slate-600 font-bold uppercase mt-3">Target Margin Buffer: 1.15</p>
                  </div>
               </div>
            </div>

            <button 
              disabled={!simulation?.canExecute || isLoading}
              onClick={handleExecute}
              className={`w-full font-black text-sm py-5 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-[0.2em] ${
                simulation?.canExecute 
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20' 
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed shadow-none'
              }`}
            >
              {isLoading ? (
                <Pulse size={20} className="animate-spin" />
              ) : simulation?.canExecute ? (
                <>
                  <Lightning size={18} weight="fill" className="text-amber-400" />
                  <span>Execute {leverage}x Recursive Loop</span>
                </>
              ) : (
                <span>Strategy Suspended (Risk Level Critical)</span>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
