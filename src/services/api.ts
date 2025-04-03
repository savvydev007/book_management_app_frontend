import axios, { AxiosError } from 'axios';
import { API_URL, API_ENDPOINTS, STORAGE_KEYS } from '../config';
import { Book } from '../types/book';

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Timeout configurations
const TIMEOUTS = {
  DEFAULT: 10000, // 10 seconds
  AUTH: 5000,     // 5 seconds for auth requests
  LONG: 30000,    // 30 seconds for long-running operations
} as const;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: TIMEOUTS.DEFAULT,
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handler
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.code === 'ECONNABORTED') {
      throw new ApiError('Request timed out. Please try again.', 408);
    }
    
    if (!error.response) {
      throw new ApiError('Unable to connect to the server. Please check your internet connection.', 0);
    }

    const status = error.response.status;
    const message = (error.response.data as { message?: string })?.message || 'An error occurred';

    switch (status) {
      case 401:
        throw new ApiError('Your session has expired. Please log in again.', status, error.response.data);
      case 403:
        throw new ApiError('You do not have permission to perform this action.', status, error.response.data);
      case 404:
        throw new ApiError('The requested resource was not found.', status, error.response.data);
      case 500:
        throw new ApiError('Server error. Please try again later.', status, error.response.data);
      default:
        throw new ApiError(message, status, error.response.data);
    }
  }
);

export const bookApi = {
  getAll: async (): Promise<Book[]> => {
    try {
      const response = await api.get(API_ENDPOINTS.BOOKS.LIST, {
        timeout: TIMEOUTS.LONG,
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch books. Please try again later.');
    }
  },

  getById: async (id: string): Promise<Book> => {
    try {
      const response = await api.get(API_ENDPOINTS.BOOKS.UPDATE(id), {
        timeout: TIMEOUTS.DEFAULT,
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch book details. Please try again later.');
    }
  },

  create: async (book: Omit<Book, 'id'>): Promise<Book> => {
    try {
      const response = await api.post(API_ENDPOINTS.BOOKS.CREATE, book, {
        timeout: TIMEOUTS.DEFAULT,
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to create book. Please try again later.');
    }
  },

  update: async (id: string, book: Partial<Book>): Promise<Book> => {
    try {
      const response = await api.put(API_ENDPOINTS.BOOKS.UPDATE(id), book, {
        timeout: TIMEOUTS.DEFAULT,
      });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to update book. Please try again later.');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(API_ENDPOINTS.BOOKS.DELETE(id), {
        timeout: TIMEOUTS.DEFAULT,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to delete book. Please try again later.');
    }
  },
}; 