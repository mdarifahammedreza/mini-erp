import { apiClient } from '../../../services/api/axios';
import type { ApiResponse, PaginatedResponse } from '../../../types/api.types';
import type { Customer, CustomerQueryParams } from '../types/customer.types';

export const customerService = {
  getAll: async (params: CustomerQueryParams): Promise<PaginatedResponse<Customer>> => {
    const { data } = await apiClient.get('/customers', { params });
    return data;
  },

  getById: async (id: string): Promise<ApiResponse<Customer>> => {
    const { data } = await apiClient.get(`/customers/${id}`);
    return data;
  },

  create: async (customerData: Partial<Customer>): Promise<ApiResponse<Customer>> => {
    const { data } = await apiClient.post('/customers', customerData);
    return data;
  },

  update: async (id: string, customerData: Partial<Customer>): Promise<ApiResponse<Customer>> => {
    const { data } = await apiClient.patch(`/customers/${id}`, customerData);
    return data;
  },

  delete: async (id: string): Promise<ApiResponse<any>> => {
    const { data } = await apiClient.delete(`/customers/${id}`);
    return data;
  },
};
