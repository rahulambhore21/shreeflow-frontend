import axios from 'axios';
import { toast } from '@/hooks/use-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        // Remove any existing "Bearer " prefix and send just the raw token
        const cleanToken = token.replace('Bearer ', '').trim();
        // Based on the backend error, it seems to expect just 'token' header
        config.headers.token = cleanToken;
        // Also try Authorization header as backup
        config.headers.Authorization = `Bearer ${cleanToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.response?.data?.error || 'Something went wrong';
    
    // Don't show toast for 404 cart errors or auth errors during login
    const isCartError = error.response?.status === 404 && error.config?.url?.includes('/carts/');
    const isAuthError = error.config?.url?.includes('/auth/');
    
    if (!isCartError && !isAuthError) {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }

    // Handle 401 and 403 Unauthorized/Forbidden
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Only redirect to auth if we're not already on the auth page and it's not a login attempt
        if (!window.location.pathname.includes('/auth') && !isAuthError) {
          window.location.href = '/auth';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;