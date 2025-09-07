import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService, CreateProductPayload, UpdateProductPayload } from '../services/product';
import { ProductsQueryParams } from '../types/product';

export const useProducts = (params?: ProductsQueryParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const usePopularProducts = (limit: number = 10) => {
  return useProducts({ is_populer: true, limit });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => productService.createProduct(payload),
    onSuccess: () => {
      // Invalidate and refetch products queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      // Invalidate and refetch products queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductPayload }) => 
      productService.updateProduct(id, payload),
    onSuccess: () => {
      // Invalidate and refetch products queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};