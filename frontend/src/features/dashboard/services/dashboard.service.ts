import { apiClient } from '../../../services/api/axios';
import type { ApiResponse } from '../../../types/api.types';
import type { OverviewStats, TopProduct, ChartDataItem } from '../types/dashboard.types';

export const dashboardService = {
  getStats: async (range = '30days'): Promise<ApiResponse<OverviewStats>> => {
    const { data } = await apiClient.get('/dashboard/stats', { params: { range } });
    return data;
  },

  getLowStock: async (): Promise<ApiResponse<any[]>> => {
    const { data } = await apiClient.get('/dashboard/low-stock');
    return data;
  },

  getTopSelling: async (limit = 5): Promise<ApiResponse<TopProduct[]>> => {
    const { data } = await apiClient.get('/dashboard/top-selling', { params: { limit } });
    return data;
  },

  getChartData: async (range = '30days'): Promise<ApiResponse<ChartDataItem[]>> => {
    const { data } = await apiClient.get('/dashboard/chart', { params: { range } });
    return data;
  },
};
