'use client';

import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  data?: any[];
  trend?: string;
}

function TradingViewWidget({ symbol }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if the script is already added to avoid duplication
    const scriptId = 'tradingview-widget-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://s3.tradingview.com/tv.js";
      script.type = "text/javascript";
      script.async = true;
      document.head.appendChild(script);
    }

    const initWidget = () => {
      if (typeof window !== 'undefined' && (window as any).TradingView) {
        new (window as any).TradingView.widget({
          "autosize": true,
          "symbol": symbol.includes('BTC') ? `BINANCE:${symbol}USDT` : 
                    symbol.includes('SOL') ? `BINANCE:${symbol}USDT` : 
                    symbol === 'stETH' ? `LIDO:STETH` : `BINANCE:${symbol}USDT`,
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "3", // Area chart for that sleek W3B3 look
          "locale": "en",
          "toolbar_bg": "#f1f3f6",
          "enable_publishing": false,
          "hide_top_toolbar": true,
          "save_image": false,
          "container_id": container.current?.id,
          "backgroundColor": "rgba(0, 0, 0, 1)",
          "gridColor": "rgba(0, 0, 0, 0.06)",
        });
      }
    };

    if ((window as any).TradingView) {
      initWidget();
    } else {
      script.addEventListener('load', initWidget);
    }

    return () => {
      if (script) script.removeEventListener('load', initWidget);
    };
  }, [symbol]);

  return (
    <div className='tradingview-widget-container h-[400px] w-full bg-black/40 rounded-2xl border border-white/10 overflow-hidden'>
      <div id={`tradingview_${symbol}`} ref={container} className="h-full w-full" />
      <div className="absolute top-2 right-4 z-10">
         <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest bg-black/60 px-2 py-0.5 rounded border border-white/5">
           Live Market Source: TradingView
         </span>
      </div>
    </div>
  );
}

export const PoolHistoricalChart = memo(TradingViewWidget);
