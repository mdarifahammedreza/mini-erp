import { apiClient } from '../../../services/api/axios';
import type { ApiResponse, PaginatedResponse } from '../../../types/api.types';
import type { User, UserQueryParams } from '../types/user.types';
import type { CreateUserInput, UpdateUserInput } from '../schemas/user.schema';

export const usersService = {
  async getAll(params?: UserQueryParams): Promise<PaginatedResponse<User>> {
    const { data } = await apiClient.get('/users', { params });
    return data;
  },

  async getById(id: string): Promise<ApiResponse<User>> {
    const { data } = await apiClient.get(`/users/${id}`);
    return data;
  },

  async create(user: CreateUserInput): Promise<ApiResponse<User>> {
    const { data } = await apiClient.post('/users', user);
    return data;
  },

  async update(id: string, user: UpdateUserInput): Promise<ApiResponse<User>> {
    const { data } = await apiClient.patch(`/users/${id}`, user);
    return data;
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const { data } = await apiClient.delete(`/users/${id}`);
    return data;
  },
};
