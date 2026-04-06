import React from 'react';
import { motion } from 'framer-motion';
import { ArrowSquareOut, Swap } from '@phosphor-icons/react';

export const BuyW3B3Widget: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-900/40 to-indigo-900/20 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-400/30 transition-all duration-500" />
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-400">
              <Swap size={16} />
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(37,99,235,0.5)]">
               <span className="text-[10px] font-bold text-white">W3B3</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mt-4">Acquire $W3B3</h3>
          <p className="text-sm text-blue-200/70 mt-1 max-w-[200px]">
            Swap your ETH directly on Uniswap to start earning Real Yield.
          </p>
        </div>
        
        <a 
          href="https://app.uniswap.org/#/swap?outputCurrency=0xYOUR_TOKEN_ADDRESS" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center w-14 h-14 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition-colors"
        >
          <span className="text-white mb-1"><ArrowSquareOut size={24} weight="duotone"/></span>
        </a>
      </div>

      <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-500 font-medium uppercase tracking-widest">
        <span>Powered by</span>
        <span className="text-pink-500">Uniswap V3</span>
      </div>
    </motion.div>
  );
};
