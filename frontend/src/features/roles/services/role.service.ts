import { apiClient } from '../../../services/api/axios';

export const rolesService = {
  async getAll(): Promise<any> {
    const { data } = await apiClient.get('/roles');
    return data;
  },
};
