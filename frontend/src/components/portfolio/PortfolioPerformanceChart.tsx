'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface PerformanceData {
  time: string;
  value: number;
  yield: number;
}

const mockData: PerformanceData[] = [
  { time: 'Day 1', value: 45000, yield: 120 },
  { time: 'Day 2', value: 45200, yield: 240 },
  { time: 'Day 3', value: 45800, yield: 380 },
  { time: 'Day 4', value: 46100, yield: 510 },
  { time: 'Day 5', value: 47500, yield: 680 },
  { time: 'Day 6', value: 48900, yield: 840 },
  { time: 'Day 7', value: 50200, yield: 1040 },
];

export function PortfolioPerformanceChart() {
  return (
    <div className="glass-panel p-6 rounded-3xl bg-slate-900/40 border-white/5 h-[350px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-bold text-lg mb-1 italic uppercase tracking-tighter">Performance Analysis</h3>
          <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest leading-none">Yield Growth: +14.2% (7D)</p>
        </div>
        <div className="flex gap-2">
           <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-bold">NET WORTH</span>
           <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">CUMULATIVE APY</span>
        </div>
      </div>

      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: '700' }}
            />
            <YAxis 
              hide={true}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontSize: '12px'
              }}
              itemStyle={{ color: '#fff' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
