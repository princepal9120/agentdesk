import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getAuthToken, clearAuth } from '../utils/auth-utils';

// Create Axios instance
const api = axios.create({
  baseURL: '/api/v1', // Proxy configured in vite.config.ts
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        // Clear auth and redirect to login if needed
        // Note: We avoid direct window.location here to allow
        // React Router or AuthContext to handle the redirect cleanly if possible,
        // but clearing storage is safe.
        clearAuth();
        // Optionally trigger an event or use a callback if we had access to store
      }
    }
    return Promise.reject(error);
  }
);

export default api;
