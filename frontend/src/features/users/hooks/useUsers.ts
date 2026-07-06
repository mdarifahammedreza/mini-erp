import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersService } from '../services/user.service';
import type { UserQueryParams } from '../types/user.types';
import type { CreateUserInput, UpdateUserInput } from '../schemas/user.schema';

export const useUsers = (params?: UserQueryParams) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['users', params],
    queryFn: () => usersService.getAll(params),
  });

  const createUser = useMutation({
    mutationFn: (data: CreateUserInput) => usersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create user');
    },
  });

  const updateUser = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) => usersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user');
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => usersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    },
  });

  return {
    users: (query.data as any)?.data || [],
    pagination: (query.data as any)?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    createUser,
    updateUser,
    deleteUser,
  };
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usersService.getById(id),
    enabled: !!id,
  });
};
