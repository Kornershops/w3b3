'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Activity, BarChart4 } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[90vh]">
      
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <main className="container-max z-10 flex flex-col items-center text-center px-4 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/10 mb-8 select-none">
             <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
             <span className="text-sm font-semibold text-slate-300">Phase 2 V2 Alpha Live</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
             Stake. Aggregate. <br className="hidden md:block"/> 
             <span className="text-gradient">Dominate Yield.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            The multi-chain liquid aggregator built for absolute transparency. Track yields second-by-second, skip network fragmentation, and secure your wealth directly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link 
               href="/explore" 
               className="btn-primary w-full sm:w-auto px-8 py-4 text-lg flex items-center justify-center gap-2 group"
             >
               Launch App 
               <ArrowRight className="group-hover:translate-x-1 transition-transform" />
             </Link>
             <Link 
               href="#features" 
               className="btn-secondary w-full sm:w-auto px-8 py-4 text-lg"
             >
               View Documentation
             </Link>
          </div>
        </motion.div>

        {/* Feature Trays */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full max-w-5xl">
          {[
             { 
               icon: Activity, 
               title: 'Live Reward Ticking', 
               desc: 'Watch your wealth scale in absolute real-time down to the micro-cent. Never calculate intervals again.' 
             },
             { 
               icon: BarChart4, 
               title: 'Dynamic Aggregation', 
               desc: 'Cross-reference pools by real algorithmic performance metrics across Ethereum, Arbitrum, and more.' 
             },
             { 
               icon: ShieldCheck, 
               title: 'Pre-Audited Security', 
               desc: 'Deposits interact with verified tier-1 Pausable smart-contracts shielding against rug pulls.' 
             }
          ].map((feat, i) => {
             const Icon = feat.icon;
             return (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.2 }}
                 className="glass-card hover:bg-white/10 text-left"
               >
                 <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
                   <Icon />
                 </div>
                 <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                 <p className="text-slate-400">{feat.desc}</p>
               </motion.div>
             )
          })}
        </div>
      </main>
    </div>
  );
}
