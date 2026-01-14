"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminLogin from '@/components/admin/AdminLogin';
import { Loader2 } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated, isAdmin, isLoading, user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    console.log('AdminGuard - Auth state:', { isAuthenticated, isAdmin, isLoading, user });
    
    if (!isLoading) {
      if (!isAuthenticated || !isAdmin) {
        console.log('AdminGuard - Showing login, not authenticated or not admin');
        setShowLogin(true);
      } else {
        console.log('AdminGuard - User is authenticated admin, showing content');
        setShowLogin(false);
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, user]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated or not admin
  if (showLogin) {
    console.log('AdminGuard - Rendering AdminLogin component');
    return <AdminLogin />;
  }

  // Show admin content if authenticated and admin
  console.log('AdminGuard - Rendering admin content');
  return <>{children}</>;
}

// Hook for checking admin access in components
export function useAdminAccess() {
  const { isAuthenticated, isAdmin } = useAuth();
  return isAuthenticated && isAdmin;
}