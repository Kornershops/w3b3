'use client';

import { useState, useEffect } from 'react';
import { web3Service } from '@/services/web3';
import { apiService } from '@/services/api';

export default function Home() {
  const [address, setAddress] = useState<string>('');
  const [pools, setPools] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPools();
  }, []);

  const loadPools = async () => {
    try {
      const data = await apiService.getPools();
      setPools(data);
    } catch (error) {
      console.error('Failed to load pools:', error);
    }
  };

  const connectWallet = async () => {
    setLoading(true);
    try {
      const addr = await web3Service.connectWallet();
      setAddress(addr);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStake = async (poolId: string) => {
    const amount = prompt('Enter amount to stake:');
    if (!amount) return;

    try {
      await apiService.stake(poolId, parseFloat(amount));
      alert('Stake successful!');
      loadPools();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">W3B3 Staking Portal</h1>
          {!address ? (
            <button
              onClick={connectWallet}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          ) : (
            <div className="text-white">
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pools.map((pool) => (
            <div key={pool.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-2">{pool.name}</h3>
              <p className="text-slate-300 mb-4">{pool.chain}</p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">APY:</span>
                  <span className="text-green-400 font-bold">{pool.apy}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">TVL:</span>
                  <span className="text-white">${pool.tvl?.toLocaleString() || '0'}</span>
                </div>
              </div>
              <button
                onClick={() => handleStake(pool.id)}
                disabled={!address}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Stake
              </button>
            </div>
          ))}
        </div>

        {pools.length === 0 && (
          <div className="text-center text-slate-400 mt-12">
            <p>No staking pools available yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}
