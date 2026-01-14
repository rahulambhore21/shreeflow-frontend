"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield, User, Lock } from 'lucide-react';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  console.log('AdminLogin - Auth state:', { isAuthenticated, isAdmin });

  // Redirect if already authenticated admin
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      console.log('AdminLogin - Already authenticated admin, redirecting to /admin');
      router.push('/admin');
    }
  }, [isAuthenticated, isAdmin, router]);

  // Don't render login form if already authenticated admin
  if (isAuthenticated && isAdmin) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login({
        username: formData.username,
        password: formData.password
      });

      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome to admin dashboard"
        });
        router.push('/admin');
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials or insufficient privileges",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-sky-600 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Admin Login
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Sign in to access the admin dashboard
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  disabled={isLoading}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className="h-12"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t text-center">
              <p className="text-xs text-gray-500">
                Shree Flow Admin Dashboard
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Secure access required
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}