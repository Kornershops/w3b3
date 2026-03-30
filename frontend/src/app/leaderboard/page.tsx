'use client';

import { useState, useEffect } from 'react';
import { Trophy, Compass, ArrowUpRight } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      // Mocking fetch locally before interceptors route globally
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/users/leaderboard`);
      const data = await response.json();
      setLeaders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-max py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold font-sans text-white mb-4 flex items-center gap-4">
            <Trophy color="#facc15" size={48} weight="fill" /> Global Leaderboard
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Invite friends to W3B3 and earn points organically. Higher tiered participants gain early access to native $W3B3 governance drops.
          </p>
        </motion.div>
        
        <div className="glass-card flex items-center gap-4 px-6 py-4">
           <div>
             <span className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Your Referral Link</span>
             <span className="text-indigo-300 font-mono select-all bg-black/40 px-3 py-1 rounded">w3b3.app/?ref=YOUR_CODE_HERE</span>
           </div>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/20 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Participant Address</th>
                <th className="px-6 py-4 text-right">Viral Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                   <td colSpan={3} className="px-6 py-8 text-center text-slate-500 animate-pulse">Scanning the ledger...</td>
                </tr>
              ) : leaders.length > 0 ? (
                leaders.map((user, index) => (
                  <motion.tr 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}
                    key={user.id} 
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4 text-slate-300 font-mono">
                      {index === 0 ? '🥇 1' : index === 1 ? '🥈 2' : index === 2 ? '🥉 3' : `#${index + 1}`}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                          {user.walletAddress.substring(2, 4)}
                        </div>
                        <span className="font-mono text-white group-hover:text-indigo-300 transition-colors">
                          {user.walletAddress.substring(0, 6)}...{user.walletAddress.substring(38)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 font-bold border border-green-500/20 rounded-lg">
                        <ArrowUpRight color="#4ade80" size={14} /> {user.points.toLocaleString()}
                      </span>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                   <td colSpan={3} className="px-6 py-12 text-center">
                     <div className="flex flex-col items-center justify-center text-slate-500">
                       <Compass size={32} color="currentColor" weight="regular" />
                       <p className="mt-4">The leaderboard is currently empty.</p>
                       <p className="text-sm">Be the first to invite a friend to rank #1.</p>
                     </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
