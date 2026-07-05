import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { saleService } from '../services/sale.service';
import type { SaleQueryParams, CreateSaleInput } from '../types/sale.types';
import { toast } from 'sonner';

export const useSales = (params?: SaleQueryParams) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['sales', 'list', params],
    queryFn: () => saleService.getAll(params || {}),
  });

  const createMutation = useMutation({
    mutationFn: (saleData: CreateSaleInput) => saleService.create(saleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Sale transaction recorded successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to record sale.');
    },
  });

  return {
    sales: listQuery.data?.data || [],
    pagination: listQuery.data?.pagination,
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    refetch: listQuery.refetch,
    createSale: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
};

export const useSale = (id?: string) => {
  return useQuery({
    queryKey: ['sales', 'detail', id],
    queryFn: () => saleService.getById(id!),
    enabled: !!id,
  });
};
