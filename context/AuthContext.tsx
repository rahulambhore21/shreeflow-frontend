'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User, LoginCredentials, RegisterCredentials } from '@/lib/services/authService';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on component mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('AuthContext - Initializing auth...');
        if (authService.isAuthenticated()) {
          console.log('AuthContext - User is authenticated');
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            console.log('AuthContext - Current user:', currentUser);
            setUser(currentUser);
            // Optionally refresh user profile from server
            try {
              const refreshedUser = await authService.getProfile();
              console.log('AuthContext - Refreshed user:', refreshedUser);
              setUser(refreshedUser);
            } catch (error) {
              // If refresh fails, use stored user data
              console.warn('Failed to refresh user profile:', error);
            }
          }
        } else {
          console.log('AuthContext - User is not authenticated');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.logout();
      } finally {
        console.log('AuthContext - Auth initialization complete, isLoading: false');
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      setUser(response.data.user);
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${response.data.user.username}!`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      
      toast({
        title: 'Login Failed',
        description: error.response?.data?.message || 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.register(credentials);
      setUser(response.data.user);
      
      toast({
        title: 'Registration Successful',
        description: `Welcome to Shree Flow, ${response.data.user.username}!`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      toast({
        title: 'Registration Failed',
        description: error.response?.data?.message || 'Registration failed. Please try again.',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };

  const refreshUser = async () => {
    try {
      if (authService.isAuthenticated()) {
        const refreshedUser = await authService.getProfile();
        setUser(refreshedUser);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      // If refresh fails, logout user
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: authService.isAdmin(),
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};