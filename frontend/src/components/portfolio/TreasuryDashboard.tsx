import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '@/services/api';

// Using basic type structures matching our backend
interface TreasuryAsset {
  symbol: string;
  balance: string;
  valueUsd: string;
}

interface TreasuryData {
  totalValuationUsd: string;
  totalEthDistributed: string; // New field from our refined backend
  assets: TreasuryAsset[];
  lastUpdated: string;
}

const formatCurrency = (val: string) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(val));
};

export const TreasuryDashboard: React.FC = () => {
  const [data, setData] = useState<TreasuryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTreasury = async () => {
      try {
        const treasury = await apiService.getTreasury();
        setData(treasury);
      } catch (error) {
        console.error('Failed to load treasury data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTreasury();
  }, []);

  if (loading) {
    return <div className="text-gray-400 p-8 text-center animate-pulse font-medium">Syncing Protocol Reserves...</div>;
  }

  if (!data || data.totalValuationUsd === "0") {
    return (
      <div className="w-full bg-[#1A1C23]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-8 text-center text-gray-500">
        Treasury data currently initializing. Protocol fees have not yet accumulated.
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full relative overflow-hidden bg-gradient-to-b from-[#1A1C23] to-[#12131A] rounded-2xl border border-[#3b82f6]/20 p-8 shadow-2xl"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent opacity-50" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">Protocol Reserves (POL)</h2>
          <h3 className="text-4xl font-light text-white tracking-tight">
            <span className="font-bold text-[#eff6ff]">{formatCurrency(data.totalValuationUsd)}</span>
          </h3>
          <p className="text-sm text-gray-400 mt-2">Asset-backed value across all supported chains.</p>
        </div>
        <div className="md:text-right">
          <h2 className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-2">Total Real Yield Paid</h2>
          <h3 className="text-4xl font-light text-white tracking-tight">
            <span className="font-bold text-green-400">{parseFloat(data.totalEthDistributed).toLocaleString()} ETH</span>
          </h3>
          <p className="text-sm text-gray-400 mt-2">Cumulative revenue distributed to $W3B3 stakers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.assets.map((asset) => (
          <div key={asset.symbol} className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors rounded-xl border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600/20 to-purple-600/20 flex items-center justify-center border border-white/10">
                <span className="text-[10px] font-bold text-white">{asset.symbol[0]}</span>
              </div>
              <span className="text-gray-300 text-sm font-medium">{asset.symbol}</span>
            </div>
            <div className="text-right">
              <div className="text-white text-xs font-medium">{parseFloat(asset.balance).toLocaleString()}</div>
              <div className="text-[10px] text-gray-500">{formatCurrency(asset.valueUsd)}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-xs text-gray-500 italic">
        <span>Real Yield payout triggered every 24h via RevenueRouter</span>
        <span>Last Update: {new Date(data.lastUpdated).toLocaleTimeString()}</span>
      </div>
    </motion.div>
  );
};
