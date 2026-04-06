import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

// Using basic type structures matching our backend
interface TreasuryAsset {
  symbol: string;
  balance: string;
  valueUsd: string;
}

interface TreasuryData {
  totalValuationUsd: string;
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
        const response = await axios.get('http://localhost:3001/api/portfolio/treasury', {
          withCredentials: true
        });
        setData(response.data);
      } catch (error) {
        console.error('Failed to load treasury data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTreasury();
  }, []);

  if (loading) {
    return <div className="text-gray-400 p-8 text-center animate-pulse">Syncing Protocol Treasury...</div>;
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
      
      <h2 className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">Protocol-Owned Liquidity</h2>
      <h3 className="text-3xl font-light text-white tracking-tight mb-8">
        Total Backing: <span className="font-bold text-[#eff6ff]">{formatCurrency(data.totalValuationUsd)}</span>
      </h3>

      <div className="space-y-4">
        {data.assets.map((asset) => (
          <div key={asset.symbol} className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors rounded-xl border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600/20 to-purple-600/20 flex items-center justify-center border border-white/10">
                <span className="text-sm font-medium text-white">{asset.symbol[0]}</span>
              </div>
              <span className="text-gray-300 font-medium">{asset.symbol} Reserve</span>
            </div>
            <div className="text-right">
              <div className="text-white font-medium">{parseFloat(asset.balance).toLocaleString()} {asset.symbol}</div>
              <div className="text-xs text-green-400">{formatCurrency(asset.valueUsd)}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-sm text-gray-500">
        <span>Deflationary Buy-Backs: Active via RevenueRouter</span>
        <span>Last Sync: {new Date(data.lastUpdated).toLocaleTimeString()}</span>
      </div>
    </motion.div>
  );
};
