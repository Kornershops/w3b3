'use client';

import React, { useState, useEffect } from 'react';

interface LiveRewardTickerProps {
  stakedAmount: number;
  apyPercentage: number;
  initialRewardsClaimed: number;
  stakedAt: string;
}

export function LiveRewardTicker({
  stakedAmount,
  apyPercentage,
  initialRewardsClaimed,
  stakedAt,
}: LiveRewardTickerProps) {
  const [currentRewards, setCurrentRewards] = useState<number>(0);

  useEffect(() => {
    // Math: Amount * APY% / 365 / 86400 = rewards per second
    const apyDecimal = apyPercentage / 100;
    const rewardsPerSecond = (stakedAmount * apyDecimal) / 365 / 86400;

    const startTime = new Date(stakedAt).getTime();

    const calculateYield = () => {
      const now = new Date().getTime();
      const secondsElapsed = (now - startTime) / 1000;
      
      const newYield = initialRewardsClaimed + (rewardsPerSecond * secondsElapsed);
      setCurrentRewards(newYield);
    };

    // Initialize immediately to avoid 0 flickers
    calculateYield();

    // 50ms interval ticking to look incredibly fluid
    const interval = setInterval(calculateYield, 50);

    return () => clearInterval(interval);
  }, [stakedAmount, apyPercentage, initialRewardsClaimed, stakedAt]);

  return (
    <div className="font-mono text-xl font-bold text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)] flex items-end gap-1">
      {currentRewards.toLocaleString(undefined, {
        minimumFractionDigits: 6,
        maximumFractionDigits: 6,
      })}
      <span className="text-xs text-slate-500 font-sans mb-1 uppercase tracking-wider"> Tokens</span>
    </div>
  );
}
