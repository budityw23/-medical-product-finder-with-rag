import axios, { AxiosError } from 'axios';
import { ApiError } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      statusCode: error.response?.status,
      error: error.response?.data?.error,
    };
    return Promise.reject(apiError);
  }
);

export const api = {
  get: async <T>(endpoint: string, params?: Record<string, any>): Promise<T> => {
    const response = await apiClient.get<T>(endpoint, { params });
    return response.data;
  },

  post: async <T>(endpoint: string, data?: any): Promise<T> => {
    const response = await apiClient.post<T>(endpoint, data);
    return response.data;
  },

  put: async <T>(endpoint: string, data?: any): Promise<T> => {
    const response = await apiClient.put<T>(endpoint, data);
    return response.data;
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await apiClient.delete<T>(endpoint);
    return response.data;
  },
};
