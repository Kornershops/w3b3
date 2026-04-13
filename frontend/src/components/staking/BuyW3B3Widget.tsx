import React from 'react';
import { motion } from 'framer-motion';
import { ArrowSquareOut, Swap } from '@phosphor-icons/react';

export const BuyW3B3Widget: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-indigo-900/10 border border-indigo-500/20 backdrop-blur-xl rounded-[24px] p-5 sm:p-6 relative overflow-hidden group"
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 blur-[60px] pointer-events-none group-hover:bg-indigo-400/20 transition-all duration-700" />
      
      <div className="flex items-center justify-between relative z-10 gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center border border-white/10 shadow-[0_10px_20px_rgba(79,70,229,0.3)] shrink-0">
                <span className="text-[10px] font-black text-white italic tracking-tighter">W3</span>
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest leading-none">Token Alpha</span>
               <span className="text-white font-black text-lg sm:text-xl tracking-tighter italic italic">W3B3</span>
             </div>
          </div>
          <p className="text-xs sm:text-sm text-indigo-100/60 leading-relaxed max-w-[240px]">
            Swap native assets directly on Uniswap and fuel your Real Yield growth.
          </p>
        </div>
        
        <a 
          href="https://app.uniswap.org/#/swap?outputCurrency=0xYOUR_TOKEN_ADDRESS" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-white/5 hover:bg-white/10 rounded-[18px] border border-white/5 transition-all shadow-2xl active:scale-90 shrink-0"
        >
          <ArrowSquareOut size={28} weight="bold" className="text-white" />
          <span className="text-[8px] text-white/50 font-black uppercase tracking-tighter mt-1">SWAP</span>
        </a>
      </div>

      <div className="mt-6 flex items-center gap-2 text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">
        <span>Liquidity Engine</span>
        <div className="h-px bg-white/5 flex-1" />
        <span className="text-indigo-400">Uniswap Protocol</span>
      </div>
    </motion.div>
  );
};
