import axios from 'axios';
import { API_URL, API_ENDPOINTS, STORAGE_KEYS } from '../config';

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

// Create a base API instance for auth endpoints (login/register)
const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a protected API instance for authenticated endpoints
const protectedApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists (only for protected endpoints)
protectedApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await authApi.post(API_ENDPOINTS.AUTH.REGISTER, data);
    const { token, user } = response.data;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    return { token, user };
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await authApi.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    const { token, user } = response.data;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    return { token, user };
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await protectedApi.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
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