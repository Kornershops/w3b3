import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';

interface HeatmapData {
  name: string;
  apy: number;
  weight: number; // Governance weight %
}

interface YieldHeatmapProps {
  data: HeatmapData[];
}

/**
 * Yield Heatmap Component
 * Visualizes protocol yield performance vs community governance weights.
 */
export const YieldHeatmap: React.FC<YieldHeatmapProps> = ({ data }) => {
  // Helper to determine color intensity based on APY
  const getCellColor = (apy: number) => {
    if (apy > 20) return '#10b981'; // Vivid Emerald for high yield
    if (apy > 10) return '#059669'; // Emerald
    if (apy > 5) return '#047857'; // Deep Emerald
    return '#064e3b'; // Darkest forest green
  };

  return (
    <div className="w-full h-[400px] bg-black/40 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white tracking-tight">Real-Yield Heatmap</h3>
        <p className="text-white/50 text-sm">Visualizing APY vs. Community Governance Weight</p>
      </div>
      
      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={true} vertical={false} />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            stroke="#ffffff50" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            cursor={{ fill: '#ffffff08' }}
            contentStyle={{ 
              backgroundColor: '#000', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              color: '#fff'
            }}
          />
          <Bar dataKey="apy" radius={[0, 8, 8, 0]} barSize={40}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getCellColor(entry.apy)} />
            ))}
            <LabelList dataKey="weight" position="insideRight" formatter={(w: number) => `${w}% Weight`} fill="#fff" fontSize={10} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
