import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { productService } from '../services/product.service';
import type { ProductQueryParams } from '../types/product.types';
import { toast } from 'sonner';

export const useProducts = (params?: ProductQueryParams) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['products', 'list', params],
    queryFn: () => productService.getAll(params || {}),
    placeholderData: keepPreviousData,
  });

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
  });

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => productService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create product.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      productService.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update product.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete product.');
    },
  });

  return {
    products: listQuery.data?.data || [],
    pagination: listQuery.data?.pagination,
    categories: categoriesQuery.data?.data || [],
    isLoading: listQuery.isLoading || categoriesQuery.isLoading,
    isError: listQuery.isError,
    refetch: listQuery.refetch,
    createProduct: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateProduct: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteProduct: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};

export const useProduct = (id?: string) => {
  return useQuery({
    queryKey: ['products', 'detail', id],
    queryFn: () => productService.getById(id!),
    enabled: !!id,
  });
};
