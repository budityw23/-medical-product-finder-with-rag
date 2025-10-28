import { api } from './api';
import { Product, GetProductsQuery, ProductsListResponse } from '@/types';

export const productsApi = {
  getProducts: async (query?: GetProductsQuery): Promise<ProductsListResponse> => {
    return api.get<ProductsListResponse>('/products', query);
  },

  getProductById: async (id: string): Promise<Product> => {
    return api.get<Product>(`/products/${id}`);
  },

  getCategories: async (): Promise<string[]> => {
    return api.get<string[]>('/products/categories/list');
  },
};
