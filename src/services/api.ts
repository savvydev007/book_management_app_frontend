import axios from 'axios';
import { API_URL, API_ENDPOINTS, STORAGE_KEYS } from '../config';
import { Book } from '../types/book';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const bookApi = {
  getAll: async (): Promise<Book[]> => {
    const response = await api.get(API_ENDPOINTS.BOOKS.LIST);
    return response.data;
  },

  getById: async (id: string): Promise<Book> => {
    const response = await api.get(API_ENDPOINTS.BOOKS.UPDATE(id));
    return response.data;
  },

  create: async (book: Omit<Book, 'id'>): Promise<Book> => {
    const response = await api.post(API_ENDPOINTS.BOOKS.CREATE, book);
    return response.data;
  },

  update: async (id: string, book: Partial<Book>): Promise<Book> => {
    const response = await api.put(API_ENDPOINTS.BOOKS.UPDATE(id), book);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.BOOKS.DELETE(id));
  },
}; 