'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gear, 
  RocketLaunch, 
  Code, 
  Browsers, 
  Hammer,
  HardDrive
} from '@phosphor-icons/react';

/**
 * VaultFactoryUI
 * The "Infrastructure Layer" of W3B3 (Phase 14).
 * Enables permissionless deployment of W3B3-secured yield markets.
 */
export function VaultFactoryUI() {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({ name: '', asset: 'USDC', fee: 5 });

  const nextStep = () => setStep(s => s + 1);

  return (
    <div className="space-y-8 pb-32">
      <header>
        <div className="flex items-center gap-3 mb-2">
           <div className="p-2 bg-indigo-500/10 rounded-lg">
              <RocketLaunch size={24} className="text-indigo-400" weight="fill" />
           </div>
           <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Infrastructure Factory</h1>
        </div>
        <p className="text-slate-500 text-sm font-medium">Provision permissionless yield infrastructure secured by the W3B3 protocol.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Provisioning Stepper */}
        <div className="lg:col-span-12">
          <div className="flex items-center justify-between mb-10 px-4">
             {[1, 2, 3].map((i) => (
               <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black border-2 transition-all ${
                    step >= i ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-black/40 border-white/5 text-slate-700'
                  }`}>
                    {i}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${step >= i ? 'text-white' : 'text-slate-700'}`}>
                    {i === 1 ? 'Logic' : i === 2 ? 'Treasury' : 'Deploy'}
                  </span>
               </div>
             ))}
             <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -z-10" />
          </div>
        </div>

        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-card bg-indigo-500/5 h-full"
              >
                <div className="flex items-center gap-2 mb-6">
                   <Gear size={20} className="text-indigo-400" />
                   <h2 className="text-sm font-black text-white uppercase tracking-widest">Vault Parameters</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Market Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Polygon Alpha DAO Vault"
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-indigo-500/50"
                      value={config.name}
                      onChange={(e) => setConfig({...config, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Target Asset (LST/Token)</label>
                    <select className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold appearance-none">
                       <option>stETH (Ethereum)</option>
                       <option>maticX (Polygon)</option>
                       <option>cbETH (Base)</option>
                    </select>
                  </div>
                  <button 
                    onClick={nextStep}
                    disabled={!config.name}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-5 rounded-2xl uppercase tracking-widest transition-all mt-4"
                  >
                    Continue to Treasury
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-5">
          <div className="glass-card border-dashed">
             <div className="flex items-center gap-2 mb-6">
                <Browsers size={20} className="text-slate-500" />
                <h2 className="text-sm font-black text-white uppercase tracking-widest">SDK Preview</h2>
             </div>
             <div className="bg-black/60 rounded-xl p-4 font-mono text-[11px] text-indigo-300 leading-relaxed border border-indigo-500/10">
                <span className="text-indigo-500 font-bold">{"// Initialize SDK"}</span><br/>
                const sdk = new W3B3SDK({'{'}<br/>
                &nbsp;&nbsp;apiKey: &apos;..._alpha_v1&apos;,<br/>
                &nbsp;&nbsp;rpcUrl: &apos;https://rpc.w3b3.io&apos;<br/>
                {'}'});<br/><br/>
                <span className="text-indigo-500 font-bold">{"// Provision Market"}</span><br/>
                const vault = await sdk.deployVault({'{'}<br/>
                &nbsp;&nbsp;name: &apos;{config.name || "..."}&apos;,<br/>
                &nbsp;&nbsp;asset: &apos;stETH&apos;<br/>
                {'}'});
             </div>
             
             <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                      <Code size={16} className="text-slate-400" />
                   </div>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">White-Label React SDK Included</p>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                      <Hammer size={16} className="text-slate-400" />
                   </div>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Protocol-Level Slashing Insurance</p>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                      <HardDrive size={16} className="text-slate-400" />
                   </div>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">W3B3 L3 Settlement Optimized</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
