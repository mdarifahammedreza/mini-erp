import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settings.service';
import { toast } from 'sonner';

export const useSettings = () => {
  const queryClient = useQueryClient();

  const rolesQuery = useQuery({
    queryKey: ['roles'],
    queryFn: () => settingsService.getRoles(),
  });

  const permissionsQuery = useQuery({
    queryKey: ['permissions'],
    queryFn: () => settingsService.getPermissions(),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, permissions }: { id: string; permissions: string[] }) =>
      settingsService.updateRole(id, { permissions }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role permissions updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update role permissions.');
    },
  });

  return {
    roles: rolesQuery.data?.data || [],
    permissions: permissionsQuery.data?.data || [],
    isLoading: rolesQuery.isLoading || permissionsQuery.isLoading,
    isError: rolesQuery.isError || permissionsQuery.isError,
    updateRolePermissions: updateRoleMutation.mutateAsync,
    isUpdating: updateRoleMutation.isPending,
  };
};
