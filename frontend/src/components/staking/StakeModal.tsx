'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Warning, CheckCircle, CircleNotch } from '@phosphor-icons/react';
import { useAccount, useChainId, useSwitchNetwork, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { apiService } from '@/services/api';
import { StakingPool } from '@/types';
import { CONTRACT_ADDRESSES, REWARD_DISTRIBUTOR_ABI, ERC20_ABI } from '@/config/contracts';
import { parseUnits } from 'viem';

interface StakeModalProps {
  pool: StakingPool;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function StakeModal({ pool, isOpen, onClose, onSuccess }: StakeModalProps) {
  useAccount();
  const chainId = useChainId();
  const { switchNetwork } = useSwitchNetwork();
  
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'input' | 'approving' | 'staking' | 'success'>('input');
  const [error, setError] = useState<string | null>(null);

  // 1. Prepare ERC-20 Approval (If needed)
  // Note: For production, we'd check allowance first. For Alpha, we trigger as part of the flow.
  const { config: approveConfig } = usePrepareContractWrite({
    address: pool.contractAddress as `0x${string}`, // Pool's token address
    abi: ERC20_ABI,
    functionName: 'approve',
    args: [CONTRACT_ADDRESSES.REWARD_DISTRIBUTOR as `0x${string}`, amount ? parseUnits(amount, pool.tokenDecimals) : BigInt(0)],
    enabled: step === 'approving' && !!amount,
  });

  const { write: approveWrite, data: approveData } = useContractWrite(approveConfig);

  useWaitForTransaction({
    hash: approveData?.hash,
    onSuccess: () => setStep('staking'),
    onError: () => {
      setError('Approval failed');
      setStep('input');
    }
  });

  // 2. Prepare Staking Transaction
  const { config: stakeConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESSES.REWARD_DISTRIBUTOR as `0x${string}`,
    abi: REWARD_DISTRIBUTOR_ABI,
    functionName: 'stake',
    args: [amount ? parseUnits(amount, pool.tokenDecimals) : BigInt(0)],
    enabled: step === 'staking' && !!amount,
  });

  const { write: stakeWrite, data: stakeData } = useContractWrite(stakeConfig);

  useWaitForTransaction({
    hash: stakeData?.hash,
    onSuccess: async (txData) => {
      try {
        await apiService.stake(pool.id, parseFloat(amount), txData.transactionHash);
        setStep('success');
      } catch (e) {
        setError('Failed to record stake on backend');
      }
    },
    onError: () => {
      setError('Staking transaction failed');
      setStep('input');
    }
  });

  if (!isOpen) return null;

  const isWrongNetwork = chainId !== pool.chainId;

  const handleAction = async () => {
    if (isWrongNetwork && switchNetwork) {
      switchNetwork(pool.chainId);
      return;
    }

    if (step === 'input') {
      const parsed = parseFloat(amount);
      if (isNaN(parsed) || parsed <= 0) {
        setError('Enter a valid amount');
        return;
      }
      
      setError(null);
      setStep('approving');
      approveWrite?.();
    } else if (step === 'staking') {
      stakeWrite?.();
    } else if (step === 'success') {
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card w-full max-w-md relative overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold font-sans text-white mb-2">Stake {pool.tokenSymbol}</h2>
          <p className="text-slate-400 text-sm mb-6">Deposit your assets to earn {pool.apyPercentage}% APY dynamically.</p>

          {isWrongNetwork ? (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
              <span className="shrink-0 mt-0.5">
                <Warning color="#fb923c" size={18} weight="fill" />
              </span>
              <p className="text-sm text-orange-200">You are on the wrong network. Switch your wallet to chain ID {pool.chainId} to interact with this pool.</p>
            </div>
          ) : (
             <AnimatePresence mode="wait">
               {step === 'input' && (
                 <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                   <div className="bg-black/30 rounded-xl border border-white/10 p-4 mb-2 flex justify-between items-center">
                     <input 
                       type="number" 
                       value={amount}
                       onChange={(e) => setAmount(e.target.value)}
                       placeholder="0.00" 
                       className="bg-transparent text-2xl font-mono text-white outline-none w-full"
                     />
                     <span className="text-slate-400 font-bold">{pool.tokenSymbol}</span>
                   </div>
                   {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
                 </motion.div>
               )}

               {(step === 'approving' || step === 'staking') && (
                 <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-8 space-y-4">
                   <span className="animate-spin inline-block">
                     <CircleNotch color="#818cf8" size={48} weight="bold" />
                   </span>
                   <div className="text-center">
                     <p className="text-white font-bold">{step === 'approving' ? 'Approving Spend...' : 'Staking Assets...'}</p>
                     <p className="text-slate-400 text-sm">Please confirm the pending transaction in your wallet.</p>
                   </div>
                 </motion.div>
               )}

               {step === 'success' && (
                 <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-8 space-y-4">
                   <CheckCircle color="#4ade80" size={48} weight="fill" />
                   <div className="text-center">
                     <p className="text-white font-bold text-lg">Stake Confirmed!</p>
                     <p className="text-slate-400 text-sm">Your {pool.tokenSymbol} is now earning yield.</p>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
          )}

          <button 
            disabled={step === 'approving' || step === 'staking'}
            onClick={handleAction}
            className={`w-full btn-primary py-4 text-lg mt-6 flex justify-center items-center gap-2 ${step === 'approving' || step === 'staking' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isWrongNetwork ? 'Switch Network' : 
             step === 'input' ? `Stake ${pool.tokenSymbol}` : 
             step === 'approving' ? 'Waiting...' : 
             step === 'staking' ? 'Processing...' : 
             'View Portfolio'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
