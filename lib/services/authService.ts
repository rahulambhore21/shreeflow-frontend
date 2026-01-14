import api from './api';

export interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  type: string;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}

class AuthService {
  // Register new user
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/register', credentials);
    if (response.data.data.accessToken) {
      localStorage.setItem('token', response.data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    if (response.data.data.accessToken) {
      localStorage.setItem('token', response.data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Get current user from localStorage
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') {
      console.log('AuthService - isAuthenticated: false (server-side)');
      return false;
    }
    const token = localStorage.getItem('token');
    const isAuth = !!token;
    console.log('AuthService - isAuthenticated:', isAuth, 'token exists:', !!token);
    return isAuth;
  }

  // Check if user is admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.isAdmin || false;
  }

  // Get auth token
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  // Refresh user profile
  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile');
    const user = response.data.data;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await api.put('/auth/profile', userData);
    const user = response.data.data;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
}

export const authService = new AuthService();