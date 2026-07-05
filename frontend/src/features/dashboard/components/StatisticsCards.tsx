import React from 'react';
import { DollarSign, ShoppingBag, AlertTriangle, Percent } from 'lucide-react';
import type { OverviewStats } from '../types/dashboard.types';

interface StatisticsCardsProps {
  stats?: OverviewStats;
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({ stats }) => {
  const cardData = [
    {
      title: 'Total Revenue',
      value: stats ? `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00',
      description: 'Accumulated total sales value',
      icon: DollarSign,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Sales Count',
      value: stats ? stats.salesCount.toLocaleString() : '0',
      description: 'Number of closed transactions',
      icon: ShoppingBag,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Average Order Value',
      value: stats ? `$${stats.avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00',
      description: 'Average spent per order',
      icon: Percent,
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    },
    {
      title: 'Low Stock Alerts',
      value: stats ? stats.lowStockCount.toLocaleString() : '0',
      description: 'Items below threshold limit',
      icon: AlertTriangle,
      color: stats && stats.lowStockCount > 0 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardData.map((card, idx) => (
        <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.title}</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{card.value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${card.color} transition-transform duration-300 group-hover:scale-110`}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4 flex items-center">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
};
