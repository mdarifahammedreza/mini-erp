import { apiClient } from '../../../services/api/axios';
import type { ApiResponse } from '../../../types/api.types';
import type { Role, RolePermission } from '../types/settings.types';

export const settingsService = {
  getRoles: async (): Promise<ApiResponse<Role[]>> => {
    const { data } = await apiClient.get('/roles');
    return data;
  },

  getPermissions: async (): Promise<ApiResponse<RolePermission[]>> => {
    const { data } = await apiClient.get('/permissions');
    return data;
  },

  updateRole: async (id: string, data: { permissions: string[] }): Promise<ApiResponse<Role>> => {
    const { data: res } = await apiClient.patch(`/roles/${id}`, data);
    return res;
  },
};
