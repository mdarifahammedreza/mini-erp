import { useQuery } from '@tanstack/react-query';
import { rolesService } from '../services/role.service';

export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => rolesService.getAll(),
  });
};
