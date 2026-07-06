import React from 'react';
import { useDashboardStats, StatisticsCards, LowStockTable, SalesChart } from '../../features/dashboard';
import { AlertCircle, LayoutDashboard, RefreshCw } from 'lucide-react';

// ---------------------------------------------------------------------------
// Skeleton primitives
// ---------------------------------------------------------------------------

const SkeletonBox: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800 ${className}`}
  />
);

const SkeletonStatCard: React.FC<{ delay?: string }> = ({ delay = '0s' }) => (
  <div
    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col gap-4 shadow-sm"
    style={{ animationDelay: delay }}
  >
    <div className="flex items-center justify-between">
      <SkeletonBox className="h-4 w-28" />
      <SkeletonBox className="h-9 w-9 rounded-xl" />
    </div>
    <SkeletonBox className="h-8 w-20" />
    <SkeletonBox className="h-3 w-36" />
  </div>
);

const SkeletonChartBox: React.FC<{ delay?: string }> = ({ delay = '0s' }) => (
  <div
    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col gap-4"
    style={{ animationDelay: delay }}
  >
    <div className="flex items-center justify-between">
      <SkeletonBox className="h-5 w-40" />
      <SkeletonBox className="h-7 w-20 rounded-full" />
    </div>
    <SkeletonBox className="h-52 w-full rounded-xl" />
  </div>
);

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-8">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-2">
        <SkeletonBox className="h-9 w-64" />
        <SkeletonBox className="h-4 w-48" />
      </div>
      <div className="flex items-center gap-2">
        <SkeletonBox className="h-10 w-56 rounded-xl" />
        <SkeletonBox className="h-9 w-9 rounded-lg" />
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {(['0s', '0.1s', '0.2s', '0.3s'] as const).map((d, i) => (
        <SkeletonStatCard key={i} delay={d} />
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <SkeletonChartBox delay="0.4s" />
      <SkeletonChartBox delay="0.5s" />
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Range options
// ---------------------------------------------------------------------------

const RANGE_OPTIONS = [
  { value: '7days',  label: '7 Days'  },
  { value: '30days', label: '30 Days' },
  { value: '90days', label: '90 Days' },
] as const;

export const DashboardPage: React.FC = () => {
  const [range, setRange] = React.useState('30days');
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const { stats, lowStock, chartData, isLoading, isError, refetch } =
    useDashboardStats(range);

  const handleRefetch = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const handleRangeChange = React.useCallback((value: string) => {
    setRange(value);
  }, []);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom duration-500">
        <LoadingSkeleton />
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="h-[70vh] flex items-center justify-center animate-in fade-in slide-in-from-bottom duration-500">
        <div className="max-w-sm w-full rounded-2xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-900 shadow-xl shadow-red-500/5 p-8 flex flex-col items-center gap-5 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 ring-8 ring-red-50/60 dark:ring-red-900/10">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>

          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
              Something went wrong
            </h2>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              We couldn&apos;t load your dashboard statistics. Please try again.
            </p>
          </div>

          <button
            onClick={handleRefetch}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-semibold shadow-md shadow-red-500/30 hover:opacity-90 active:scale-95 transition-all duration-200"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Happy path ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500">

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        style={{ animationDelay: '0s' }}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-500/30 shrink-0">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Real-time statistics &amp; inventory tracking
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Segmented pill range control */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {RANGE_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleRangeChange(value)}
                className={[
                  'px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                  range === value
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-700',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Refresh button */}
          <button
            onClick={handleRefetch}
            title="Refresh Data"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 shadow-sm"
          >
            <RefreshCw
              className={`w-4 h-4 transition-transform duration-300 ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* ── Statistics Cards ─────────────────────────────────────────────── */}
      <div
        className="animate-in fade-in slide-in-from-bottom duration-500"
        style={{ animationDelay: '0.1s' }}
      >
        <StatisticsCards stats={stats} />
      </div>

      {/* ── Charts & Tables ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          className="animate-in fade-in slide-in-from-bottom duration-500"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm shadow-slate-200/60 dark:shadow-slate-900/60 overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-800/50 hover:shadow-md hover:shadow-blue-500/5 transition-shadow duration-300">
            <SalesChart data={chartData} />
          </div>
        </div>

        <div
          className="animate-in fade-in slide-in-from-bottom duration-500"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm shadow-slate-200/60 dark:shadow-slate-900/60 overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-800/50 hover:shadow-md hover:shadow-amber-500/5 transition-shadow duration-300">
            <LowStockTable products={lowStock} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
