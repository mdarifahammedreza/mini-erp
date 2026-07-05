import { apiClient } from '../../../services/api/axios';
import type { ApiResponse, PaginatedResponse } from '../../../types/api.types';
import type { Sale, SaleQueryParams, CreateSaleInput } from '../types/sale.types';

export const saleService = {
  getAll: async (params: SaleQueryParams): Promise<PaginatedResponse<Sale>> => {
    const { data } = await apiClient.get('/sales', { params });
    return data;
  },

  getById: async (id: string): Promise<ApiResponse<Sale>> => {
    const { data } = await apiClient.get(`/sales/${id}`);
    return data;
  },

  create: async (saleData: CreateSaleInput): Promise<ApiResponse<Sale>> => {
    const { data } = await apiClient.post('/sales', saleData);
    return data;
  },
};
