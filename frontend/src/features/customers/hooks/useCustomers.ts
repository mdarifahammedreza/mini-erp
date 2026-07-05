import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/customer.service';
import type { Customer, CustomerQueryParams } from '../types/customer.types';
import { toast } from 'sonner';

export const useCustomers = (params?: CustomerQueryParams) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['customers', 'list', params],
    queryFn: () => customerService.getAll(params || {}),
  });

  const createMutation = useMutation({
    mutationFn: (customerData: Partial<Customer>) => customerService.create(customerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create customer.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) =>
      customerService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update customer.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => customerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete customer.');
    },
  });

  return {
    customers: listQuery.data?.data || [],
    pagination: listQuery.data?.pagination,
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    refetch: listQuery.refetch,
    createCustomer: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateCustomer: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteCustomer: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};

export const useCustomer = (id?: string) => {
  return useQuery({
    queryKey: ['customers', 'detail', id],
    queryFn: () => customerService.getById(id!),
    enabled: !!id,
  });
};
