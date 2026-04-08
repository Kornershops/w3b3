'use client';

import React, { useState, useEffect } from 'react';
import { governanceService } from '@/services/governanceService';
import { YieldHeatmap } from '@/components/dashboard/YieldHeatmap';
import { useAccount } from 'wagmi';

const DUMMY_POOLS = [
  { name: 'USDC-Stables', apy: 12.5, weight: 45, address: '0x123...' },
  { name: 'ETH-Alpha', apy: 22.4, weight: 30, address: '0x456...' },
  { name: 'BTC-Reserve', apy: 8.2, weight: 25, address: '0x789...' },
];

export default function GovernancePage() {
  const { address, isConnected } = useAccount();
  const [votingPower, setVotingPower] = useState("0");
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      // In production, this would fetch the user's total staked balances
      governanceService.refreshVotingPower(address, DUMMY_POOLS.map(p => p.address))
        .then(setVotingPower);
    }
  }, [isConnected, address]);

  const handleVote = async (poolAddress: string) => {
    setIsVoting(true);
    try {
      // Cast a vote with 100% weight allocation to the chosen gauge
      await governanceService.castVote(poolAddress, 100);
      alert('Community Vote Cast Successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to cast vote. Ensure your Smart Account is initialized.');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <header className="space-y-4">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Active Epoch: 14
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">Community Mandate</h1>
          <p className="text-xl text-white/50 max-w-2xl">
            Command the W3B3 Protocol. Direct yield harvests and influence reward compounding weights using your $W3B3 voting power.
          </p>
        </header>

        {/* Analytics Hub */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <YieldHeatmap data={DUMMY_POOLS} />
          </div>
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-8 flex flex-col justify-center space-y-4">
            <h4 className="text-white/40 uppercase tracking-widest text-xs font-bold">Your Voting Power</h4>
            <div className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
              {parseFloat(votingPower).toFixed(2)}
            </div>
            <p className="text-white/30 text-sm italic">Derived from total staked W3B3 across all gauges.</p>
          </div>
        </section>

        {/* Gauge Proposals */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Active Yield Gauges</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DUMMY_POOLS.map((pool) => (
              <div key={pool.address} className="group relative bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-3xl p-6 transition-all duration-500">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold">{pool.name}</h3>
                    <span className="text-emerald-400 font-mono">+{pool.apy}% APY</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${pool.weight}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-white/40 uppercase font-bold tracking-widest">
                    <span>Vote Weight</span>
                    <span>{pool.weight}%</span>
                  </div>
                  <button 
                    disabled={isVoting || !isConnected}
                    onClick={() => handleVote(pool.address)}
                    className="w-full py-4 rounded-2xl bg-white text-black font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVoting ? 'Broadcasting Mandate...' : 'Cast 100% Weight'}
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
