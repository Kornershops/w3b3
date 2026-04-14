import React, { useEffect, useState } from 'react';
import { treasuryService, TreasuryStatus } from '../../services/treasuryService';
import { formatCurrency } from '../../utils/format';

/**
 * TreasuryDashboard
 * A high-fidelity, industrial-grade component for visualizing protocol-owned liquidity.
 */
const TreasuryDashboard: React.FC = () => {
  const [status, setStatus] = useState<TreasuryStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await treasuryService.getStatus();
        setStatus(data);
      } catch (error) {
        console.error('Error fetching treasury status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="animate-pulse h-64 bg-slate-800 rounded-2xl w-full"></div>;
  if (!status) return null;

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
      {/* Dynamic Background Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Protocol Treasury</h2>
          <p className="text-slate-400 font-medium">Enterprise Real-Yield Ecosystem Holdings</p>
        </div>
        <div className="mt-4 md:mt-0 px-5 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
          <span className="text-indigo-400 text-sm font-bold animate-pulse">● LIVE METRICS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Total Valuation Card */}
        <div className="lg:col-span-2 p-8 bg-slate-800/40 border border-slate-700/50 rounded-2xl hover:border-indigo-500/30 transition-all">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">Total Assets Under Management (AUM)</p>
          <div className="flex items-baseline space-x-3">
            <h3 className="text-5xl font-black text-white leading-none">
              {formatCurrency(parseFloat(status.totalValuationUsd))}
            </h3>
            <span className="text-emerald-400 font-bold text-lg">▲ 2.4%</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            {status.assets.map((asset) => (
              <div key={asset.symbol} className="px-4 py-2 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center text-xs font-bold text-indigo-400">
                  {asset.symbol[0]}
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-none">{asset.symbol}</p>
                  <p className="text-slate-500 text-[10px] font-bold mt-1">
                    {parseFloat(asset.balance).toFixed(2)} tokens
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real Yield Card */}
        <div className="p-8 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <svg width="64" height="64" viewBox="0 0 24 24" fill="white"><path d="M12 2L1 21h22L12 2zm0 3.45l8.15 14.1H3.85L12 5.45z"/></svg>
          </div>
          <p className="text-indigo-400 text-sm font-bold uppercase tracking-widest mb-4">Total Real Yield Distributed</p>
          <h3 className="text-5xl font-black text-white leading-none mb-2">
            {parseFloat(status.totalEthDistributed).toFixed(1)} ETH
          </h3>
          <p className="text-indigo-300/60 text-sm font-medium">Distributed to natively staked $W3B3 holders</p>
          
          <button className="mt-8 w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-black rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
            STAKE $W3B3 NOW
          </button>
        </div>
      </div>

      <div className="mt-10 flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-tighter">
        <p>Sync Strategy: Block-Deterministic Oracle Chain</p>
        <p>Last Precision Update: {new Date(status.lastUpdated).toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default TreasuryDashboard;
