'use client';

import React, { useState, useEffect } from 'react';
import { YieldHeatmap } from '@/components/dashboard/YieldHeatmap';
import { useAccount } from 'wagmi';
import { Vault } from '@phosphor-icons/react';
import { apiService } from '@/services/api';
import { StakingPool } from '@/types';

export default function GovernancePage() {
  const { isConnected } = useAccount();
  const [pools, setPools] = useState<StakingPool[]>([]);
  const [votingPower, setVotingPower] = useState(0);
  const [multiplier, setMultiplier] = useState(1.0);
  const [isVoting, setIsVoting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGovData = async () => {
      try {
        const [poolsData, govData] = await Promise.all([
          apiService.getPools(),
          apiService.getGovernancePower()
        ]);
        setPools(poolsData.slice(0, 6)); // Top 6 gauges for the UI
        setVotingPower(govData.power);
        setMultiplier(govData.multiplier);
      } catch (err) {
        console.error('Failed to load governance data', err);
      } finally {
        setLoading(false);
      }
    };

    if (isConnected) loadGovData();
  }, [isConnected]);

  const handleVote = async (poolId: string) => {
    setIsVoting(true);
    try {
      await apiService.castGovernanceVote(poolId, 100);
      alert('Community Mandate Recorded Successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to broadcast mandate. Institutional lock may be in effect.');
    } finally {
      setIsVoting(false);
    }
  };

  const getTierName = (m: number) => {
    if (m >= 1.5) return 'INSTITUTIONAL';
    if (m >= 1.25) return 'PLATINUM';
    if (m >= 1.1) return 'ALPHA';
    return 'BASE';
  };

  if (loading && isConnected) return <div className="min-h-screen bg-black flex items-center justify-center text-indigo-400 font-black italic tracking-tighter">SYNCHRONIZING MANDATE...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <header className="space-y-4">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Active Epoch: 18 (Certified)
          </div>
          <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
            Protocol <span className="text-white/20">Mandate</span>
          </h1>
          <p className="text-lg text-white/50 max-w-2xl font-medium">
             Command the W3B3 Institution. Direct yield harvests and influence reward compounding weights using your verified protocol voting power.
          </p>
        </header>

        {/* Analytics Hub */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <YieldHeatmap data={pools.map(p => ({ 
               name: p.tokenSymbol, 
               apy: parseFloat(p.apyPercentage || '0'), 
               weight: 25, 
               address: p.id 
            }))} />
          </div>
          <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border border-indigo-500/20 rounded-3xl p-10 flex flex-col justify-center space-y-6 relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity">
               <Vault size={200} weight="fill" />
            </div>
            <div className="space-y-1">
               <h4 className="text-indigo-400 uppercase tracking-widest text-[10px] font-black italic underline decoration-indigo-500/50 underline-offset-4">Your Voting Power</h4>
               <div className="text-8xl font-black italic tracking-tighter text-white drop-shadow-2xl">
                 {votingPower.toFixed(2)}
               </div>
            </div>
            
            <div className="pt-6 border-t border-white/5">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">Active Multiplier Tier</p>
                <div className="flex items-center gap-2">
                   <h3 className="text-2xl font-black text-indigo-400 italic tracking-tighter">{getTierName(multiplier)}</h3>
                   <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded font-black italic tracking-tighter">
                     {multiplier}X BOOST
                   </span>
                </div>
            </div>
          </div>
        </section>

        {/* Gauge Proposals */}
        <section className="space-y-8">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">Active Yield Gauges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pools.map((pool) => (
              <div key={pool.id} className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-black italic tracking-tighter">{pool.name}</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{pool.tokenSymbol} GAUGE</p>
                    </div>
                    <span className="text-green-400 font-black italic tracking-tighter text-lg">{pool.apyPercentage}% APY</span>
                  </div>
                  
                  <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                    <div className="flex justify-between text-[10px] text-white/40 uppercase font-black tracking-widest mb-2">
                      <span>Mandate Weight</span>
                      <span>{Math.floor(Math.random() * 40 + 10)}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: '30%' }}></div>
                    </div>
                  </div>

                  <button 
                    disabled={isVoting || !isConnected}
                    onClick={() => handleVote(pool.id)}
                    className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-[0.2em] transition-all disabled:opacity-50 active:scale-95 shadow-xl shadow-indigo-600/10"
                  >
                    {isVoting ? 'Broadcasting Mandate...' : 'Cast Protocol Weight'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
