import { Product } from './product.types';

export interface GetProductsQuery {
  q?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface ProductsListResponse {
  data: Product[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}
