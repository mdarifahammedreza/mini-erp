import React from 'react';
import { useDashboardStats, StatisticsCards, LowStockTable, SalesChart } from '../../features/dashboard';
import { Loader2, RefreshCw } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [range, setRange] = React.useState('30days');
  const { stats, lowStock, chartData, isLoading, isError, refetch } = useDashboardStats(range);

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading dashboard data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <p className="text-red-500">Failed to load dashboard statistics.</p>
        <button
          onClick={refetch}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Real-time statistics and inventory tracking</p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
          <button
            onClick={refetch}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <StatisticsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SalesChart data={chartData} />
        <LowStockTable products={lowStock} />
      </div>
    </div>
  );
};

export default DashboardPage;
