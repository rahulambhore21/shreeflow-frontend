"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  Activity,
  DollarSign,
  FileText,
  TrendingDown
} from "lucide-react";
import { productService } from "@/lib/services/productService";
import { analyticsService } from "@/lib/services/analyticsService";
import { adminOrderService } from "@/lib/services/adminOrderService";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  newOrdersToday: number;
  revenueToday: number;
  topSellingProducts: any[];
  recentOrders: any[];
  monthlyRevenue: number[];
  orderStatusDistribution: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    newOrdersToday: 0,
    revenueToday: 0,
    topSellingProducts: [],
    recentOrders: [],
    monthlyRevenue: [],
    orderStatusDistribution: []
  });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch analytics data
      const [dashboardData, productsData, ordersData] = await Promise.all([
        analyticsService.getDashboardAnalytics(),
        productService.getAllProducts({ limit: 5 }),
        adminOrderService.getAllOrders({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' })
      ]);

      setStats({
        ...dashboardData.data,
        recentOrders: ordersData.data
      });
      
      setRecentProducts(productsData.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(productId);
        await fetchDashboardData(); // Refresh data
        toast({
          title: 'Success',
          description: 'Product deleted successfully.',
        });
      } catch (error: any) {
        console.error('Error deleting product:', error);
        let errorMessage = 'Failed to delete product';
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <Button onClick={() => router.push('/admin/products/create')} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  +12.5% from last month
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-lg">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                <p className="text-sm text-blue-600 mt-1">
                  <Activity className="w-4 h-4 inline mr-1" />
                  {stats.newOrdersToday} new today
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Products</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                <p className="text-sm text-purple-600 mt-1">
                  <Package className="w-4 h-4 inline mr-1" />
                  Active inventory
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
                <p className="text-sm text-orange-600 mt-1">
                  <Users className="w-4 h-4 inline mr-1" />
                  Registered users
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">Recent Products</CardTitle>
            <Button variant="outline" size="sm" onClick={() => router.push('/admin/products')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div key={product._id} className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    <Image
                      src={product.images?.[0] || '/placeholder-product.jpg'}
                      alt={product.name || 'Product image'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-500">{formatCurrency(product.price)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.stockQuantity > 10 
                        ? 'bg-green-100 text-green-800' 
                        : product.stockQuantity > 0 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stockQuantity} in stock
                    </span>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/products/${product._id}`)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
            <Button variant="outline" size="sm" onClick={() => router.push('/admin/orders')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">Order #{order.orderId}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500">{order.user?.email || 'Guest'}</p>
                      <p className="font-medium text-gray-900">{formatCurrency(order.totalAmount)}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center space-y-2"
              onClick={() => router.push('/admin/products/create')}
            >
              <Plus className="w-6 h-6" />
              <span>Add Product</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center space-y-2"
              onClick={() => router.push('/admin/orders')}
            >
              <ShoppingCart className="w-6 h-6" />
              <span>View Orders</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center space-y-2"
              onClick={() => router.push('/admin/articles/create')}
            >
              <FileText className="w-6 h-6" />
              <span>Write Article</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center space-y-2"
              onClick={() => router.push('/admin/analytics')}
            >
              <TrendingUp className="w-6 h-6" />
              <span>View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}