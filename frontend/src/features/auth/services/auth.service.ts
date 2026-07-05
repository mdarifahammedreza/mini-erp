import { apiClient } from '../../../services/api/axios';
import type { LoginResponse } from '../../../types/auth.types';
import type { ApiResponse } from '../../../types/api.types';

export const authService = {
  login: async (credentials: any): Promise<ApiResponse<LoginResponse>> => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data;
  },

  register: async (credentials: any): Promise<ApiResponse<LoginResponse>> => {
    const { data } = await apiClient.post('/auth/register', credentials);
    return data;
  },

  logout: async (refreshToken: string): Promise<ApiResponse<any>> => {
    const { data } = await apiClient.post('/auth/logout', { refreshToken });
    return data;
  },
};
