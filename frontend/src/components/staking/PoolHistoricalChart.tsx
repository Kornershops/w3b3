'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { format } from 'date-fns';

interface HistoricalDataPoint {
  timestamp: number;
  price: number;
}

interface PoolHistoricalChartProps {
  data: HistoricalDataPoint[];
  trend: 'BULLISH' | 'BEARISH' | 'STABLE';
}

export function PoolHistoricalChart({ data, trend }: PoolHistoricalChartProps) {
  const isBullish = trend === 'BULLISH';
  const isBearish = trend === 'BEARISH';
  const accentColor = isBullish ? '#4ade80' : isBearish ? '#f87171' : '#818cf8';

  // Format timestamps for the X-Axis
  const formattedData = data.map(d => ({
    ...d,
    time: format(new Date(d.timestamp), 'MMM dd, HH:mm')
  }));

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-black/20 rounded-2xl border border-white/5">
        <span className="text-slate-500 animate-pulse font-medium">Fetching verified market history...</span>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full bg-black/40 rounded-2xl p-4 border border-white/10 relative overflow-hidden group">
      <div className="absolute top-4 left-6 z-10">
        <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">7D Historical Trace</span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={accentColor} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={accentColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis 
            dataKey="time" 
            hide 
          />
          <YAxis 
            domain={['auto', 'auto']} 
            hide 
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-slate-900 border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-xl">
                    <p className="text-[10px] text-slate-500 mb-1 font-bold">{payload[0].payload.time}</p>
                    <p className="text-sm font-black text-white">
                      ${payload[0].value?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={accentColor} 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            isAnimationActive={true}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
