import axios, { AxiosError } from 'axios';
import { API_URL, API_ENDPOINTS, STORAGE_KEYS } from '../config';
import { ApiError } from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface UserProfile {
  name: string;
  email: string;
}

// Timeout configurations
const TIMEOUTS = {
  AUTH: 5000,     // 5 seconds for auth requests
  PROFILE: 10000, // 10 seconds for profile requests
} as const;

// Create a base API instance for auth endpoints (login/register)
const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: TIMEOUTS.AUTH,
});

// Create a protected API instance for authenticated endpoints
const protectedApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: TIMEOUTS.PROFILE,
});

// Add token to requests if it exists (only for protected endpoints)
protectedApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handler for auth endpoints
authApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.code === 'ECONNABORTED') {
      throw new ApiError('Login request timed out. Please try again.', 408);
    }
    
    if (!error.response) {
      throw new ApiError('Unable to connect to the server. Please check your internet connection.', 0);
    }

    const status = error.response.status;
    const message = (error.response.data as { message?: string })?.message || 'An error occurred';

    switch (status) {
      case 401:
        throw new ApiError('Invalid email or password.', status, error.response.data);
      case 400:
        throw new ApiError(message, status, error.response.data);
      case 500:
        throw new ApiError('Server error. Please try again later.', status, error.response.data);
      default:
        throw new ApiError(message, status, error.response.data);
    }
  }
);

// Global error handler for protected endpoints
protectedApi.interceptors.response.use(
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

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await authApi.post(API_ENDPOINTS.AUTH.REGISTER, data);
      const { token, user } = response.data;
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      return { token, user };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Registration failed. Please try again later.');
    }
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await authApi.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      const { token, user } = response.data;
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      return { token, user };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Login failed. Please try again later.');
    }
  },

  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await protectedApi.get(API_ENDPOINTS.AUTH.PROFILE);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to fetch profile. Please try again later.');
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },
}; 