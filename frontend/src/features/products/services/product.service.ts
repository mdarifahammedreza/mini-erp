import { apiClient } from '../../../services/api/axios';
import type { ApiResponse, PaginatedResponse } from '../../../types/api.types';
import type { Product, ProductQueryParams, Category } from '../types/product.types';

export const productService = {
  getAll: async (params: ProductQueryParams): Promise<PaginatedResponse<Product>> => {
    const { data } = await apiClient.get('/products', { params });
    return data;
  },

  getById: async (id: string): Promise<ApiResponse<Product>> => {
    const { data } = await apiClient.get(`/products/${id}`);
    return data;
  },

  create: async (formData: FormData): Promise<ApiResponse<Product>> => {
    const { data } = await apiClient.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  update: async (id: string, formData: FormData): Promise<ApiResponse<Product>> => {
    const { data } = await apiClient.patch(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  delete: async (id: string): Promise<ApiResponse<any>> => {
    const { data } = await apiClient.delete(`/products/${id}`);
    return data;
  },

  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    const { data } = await apiClient.get('/categories');
    return data;
  },
};
