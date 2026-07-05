import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';

export const useDashboardStats = (range = '30days') => {
  const statsQuery = useQuery({
    queryKey: ['dashboard', 'stats', range],
    queryFn: () => dashboardService.getStats(range),
  });

  const lowStockQuery = useQuery({
    queryKey: ['dashboard', 'low-stock'],
    queryFn: () => dashboardService.getLowStock(),
  });

  const topSellingQuery = useQuery({
    queryKey: ['dashboard', 'top-selling'],
    queryFn: () => dashboardService.getTopSelling(),
  });

  const chartQuery = useQuery({
    queryKey: ['dashboard', 'chart', range],
    queryFn: () => dashboardService.getChartData(range),
  });

  return {
    stats: statsQuery.data?.data,
    lowStock: lowStockQuery.data?.data || [],
    topSelling: topSellingQuery.data?.data || [],
    chartData: chartQuery.data?.data || [],
    isLoading:
      statsQuery.isLoading ||
      lowStockQuery.isLoading ||
      topSellingQuery.isLoading ||
      chartQuery.isLoading,
    isError:
      statsQuery.isError ||
      lowStockQuery.isError ||
      topSellingQuery.isError ||
      chartQuery.isError,
    refetch: () => {
      statsQuery.refetch();
      lowStockQuery.refetch();
      topSellingQuery.refetch();
      chartQuery.refetch();
    },
  };
};
