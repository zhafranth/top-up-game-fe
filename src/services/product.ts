import { api } from '../lib/axios';
import { ProductResponse, ProductsQueryParams, Product } from '../types/product';

export interface CreateProductPayload {
  name: string;
  price: number;
  total_diamond: number;
  discount: number;
  is_populer: boolean;
}

export interface UpdateProductPayload {
  name: string;
  price: number;
  total_diamond: number;
  discount: number;
  is_populer: boolean;
}

export const productService = {
  getProducts: async (params?: ProductsQueryParams): Promise<ProductResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.is_populer !== undefined) queryParams.append('is_populer', params.is_populer.toString());
    
    const queryString = queryParams.toString();
    const url = queryString ? `/products?${queryString}` : '/products';
    
    const response = await api.get(url);
    return response.data;
  },

  createProduct: async (payload: CreateProductPayload): Promise<Product> => {
    const response = await api.post('/products', payload);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  updateProduct: async (id: string, payload: UpdateProductPayload): Promise<Product> => {
    const response = await api.put(`/products/${id}`, payload);
    return response.data;
  },
};