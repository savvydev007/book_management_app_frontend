// Environment variables
export const API_URL = import.meta.env.VITE_API_URL;
export const APP_NAME = import.meta.env.VITE_APP_NAME;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },
  BOOKS: {
    LIST: '/books',
    CREATE: '/books',
    UPDATE: (id: string) => `/books/${id}`,
    DELETE: (id: string) => `/books/${id}`,
  },
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
};

// Route paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  BOOKS: {
    NEW: '/books/new',
    EDIT: (id: string) => `/books/${id}/edit`,
  },
};

// Error messages
export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    REGISTRATION_FAILED: 'Registration failed. Please try again.',
    PROFILE_LOAD_FAILED: 'Failed to load profile',
  },
  BOOKS: {
    LOAD_FAILED: 'Failed to load books',
    CREATE_FAILED: 'Failed to create book',
    UPDATE_FAILED: 'Failed to update book',
    DELETE_FAILED: 'Failed to delete book',
  },
}; 