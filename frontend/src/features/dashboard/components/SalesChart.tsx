import React from 'react';
import type { ChartDataItem } from '../types/dashboard.types';

interface SalesChartProps {
  data: ChartDataItem[];
}

export const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Revenue Trend (Last 30 Days)</h3>
        <div className="h-64 flex items-center justify-center text-slate-500">No chart data available.</div>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1000);
  const minRevenue = 0;
  const range = maxRevenue - minRevenue;

  const width = 500;
  const height = 200;
  const padding = 20;

  const points = data
    .map((d, index) => {
      const x = padding + (index / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((d.revenue - minRevenue) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-white">Revenue Trend (Last 30 Days)</h3>
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded dark:bg-blue-900/30 dark:text-blue-400">
          Max: ${maxRevenue.toLocaleString()}
        </span>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64 overflow-visible">
          <line
            x1={padding}
            y1={padding}
            x2={width - padding}
            y2={padding}
            stroke="#e2e8f0"
            className="dark:stroke-slate-800"
            strokeDasharray="4 4"
          />
          <line
            x1={padding}
            y1={height / 2}
            x2={width - padding}
            y2={height / 2}
            stroke="#e2e8f0"
            className="dark:stroke-slate-800"
            strokeDasharray="4 4"
          />
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#cbd5e1"
            className="dark:stroke-slate-700"
          />

          {points && (
            <polygon
              points={`${padding},${height - padding} ${points} ${width - padding},${height - padding}`}
              fill="url(#gradient)"
              opacity="0.15"
            />
          )}

          {points && (
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              points={points}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {data.map((d, index) => {
            const x = padding + (index / (data.length - 1)) * (width - padding * 2);
            const y = height - padding - ((d.revenue - minRevenue) / range) * (height - padding * 2);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="#3b82f6"
                stroke="#ffffff"
                strokeWidth="2"
                className="hover:r-6 cursor-pointer transition-all duration-150"
              />
            );
          })}

          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex justify-between text-[10px] text-slate-400 font-mono px-2">
        <span>{data[0]?._id ? new Date(data[0]._id).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : ''}</span>
        <span>{data[Math.floor(data.length / 2)]?._id ? new Date(data[Math.floor(data.length / 2)]._id).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : ''}</span>
        <span>{data[data.length - 1]?._id ? new Date(data[data.length - 1]._id).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : ''}</span>
      </div>
    </div>
  );
};
