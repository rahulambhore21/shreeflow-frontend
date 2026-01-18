"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import api from '@/lib/services/api';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Download,
  ArrowUp,
  ArrowDown,
  Eye,
  Heart,
  FileText,
  BarChart3
} from 'lucide-react';

interface AnalyticsData {
  revenue: {
    total: number;
    growth: number;
    thisMonth: number;
    lastMonth: number;
  };
  orders: {
    total: number;
    growth: number;
    pending: number;
    completed: number;
  };
  customers: {
    total: number;
    growth: number;
    new: number;
    returning: number;
  };
  products: {
    total: number;
  };
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
  }>;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      
      // Calculate date range based on timeRange
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      // Make API call with date parameters
      const response = await api.get(`/analytics/dashboard?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
      
      if (response.data.type === 'success') {
        // Transform backend data to match our interface
        const data = response.data.data;
        setAnalyticsData({
          revenue: {
            total: data.totalRevenue || 0,
            growth: data.revenueGrowthPercentage || 0,
            thisMonth: data.currentMonthRevenue || 0,
            lastMonth: data.lastMonthRevenue || 0
          },
          orders: {
            total: data.totalOrders || 0,
            growth: data.orderGrowthPercentage || 0,
            pending: data.ordersByStatus?.pending || 0,
            completed: data.ordersByStatus?.delivered || data.ordersByStatus?.completed || 0
          },
          customers: {
            total: data.totalCustomers || 0,
            growth: data.customerGrowthPercentage || 0,
            new: data.newCustomersThisMonth || 0,
            returning: data.returningCustomers || 0
          },
          products: {
            total: data.totalProducts || 0,
          },
          topProducts: (data.topSellingProducts || []).map((p: any) => ({
            id: p._id,
            name: p.title || p.name,
            sales: p.totalSold || 0,
            revenue: p.totalRevenue || 0
          })),
          revenueByMonth: (data.monthlyRevenue || []).map((revenue: number, index: number) => ({
            month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index] || `M${index + 1}`,
            revenue: revenue || 0
          }))
        });
      } else {
        throw new Error(response.data.message || 'Failed to load analytics');
      }
    } catch (error: any) {
      console.error('Error loading analytics:', error);
      
      // Show error toast
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to load analytics data',
        variant: 'destructive'
      });
      
      // Set empty data on error
      setAnalyticsData({
        revenue: { total: 0, growth: 0, thisMonth: 0, lastMonth: 0 },
        orders: { total: 0, growth: 0, pending: 0, completed: 0 },
        customers: { total: 0, growth: 0, new: 0, returning: 0 },
        products: { total: 0 },
        topProducts: [],
        revenueByMonth: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportReport = () => {
    if (!analyticsData) return;
    
    // Prepare data for export
    const exportData = {
      exportDate: new Date().toISOString(),
      revenue: {
        total: analyticsData.revenue.total,
        growth: analyticsData.revenue.growth,
        thisMonth: analyticsData.revenue.thisMonth,
        lastMonth: analyticsData.revenue.lastMonth
      },
      orders: {
        total: analyticsData.orders.total,
        growth: analyticsData.orders.growth,
        pending: analyticsData.orders.pending,
        completed: analyticsData.orders.completed
      },
      customers: {
        total: analyticsData.customers.total,
        growth: analyticsData.customers.growth,
        new: analyticsData.customers.new,
        returning: analyticsData.customers.returning
      },
      products: {
        total: analyticsData.products.total,
      },
      topProducts: analyticsData.topProducts,
      revenueByMonth: analyticsData.revenueByMonth
    };

    // Convert to CSV format
    const csvContent = [
      // Header
      'Shree Flow Analytics Report',
      `Generated on: ${new Date().toLocaleString()}`,
      '',
      'REVENUE METRICS',
      `Total Revenue,₹${analyticsData.revenue.total.toLocaleString()}`,
      `Growth Rate,${analyticsData.revenue.growth}%`,
      `This Month,₹${analyticsData.revenue.thisMonth.toLocaleString()}`,
      `Last Month,₹${analyticsData.revenue.lastMonth.toLocaleString()}`,
      '',
      'ORDER METRICS',
      `Total Orders,${analyticsData.orders.total}`,
      `Growth Rate,${analyticsData.orders.growth}%`,
      `Pending Orders,${analyticsData.orders.pending}`,
      `Completed Orders,${analyticsData.orders.completed}`,
      '',
      'CUSTOMER METRICS',
      `Total Customers,${analyticsData.customers.total}`,
      `Growth Rate,${analyticsData.customers.growth}%`,
      `New Customers,${analyticsData.customers.new}`,
      `Returning Customers,${analyticsData.customers.returning}`,
      '',
      'PRODUCT METRICS',
      `Total Products,${analyticsData.products.total}`,
      '',
      'TOP SELLING PRODUCTS',
      'Rank,Product Name,Sales,Revenue',
      ...analyticsData.topProducts.map((product, index) => 
        `${index + 1},${product.name},${product.sales},₹${product.revenue.toLocaleString()}`
      ),
      '',
      'MONTHLY REVENUE',
      'Month,Revenue',
      ...analyticsData.revenueByMonth.map(data => 
        `${data.month},₹${data.revenue.toLocaleString()}`
      )
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `shreeflow-analytics-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Success',
      description: 'Analytics report exported successfully!'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Analytics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">Monitor your business performance and insights</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <Button 
            onClick={loadAnalytics} 
            variant="outline"
            disabled={isLoading}
          >
            <ArrowUp className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button 
            onClick={exportReport} 
            variant="outline"
            disabled={isLoading || !analyticsData}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                analyticsData.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {analyticsData.revenue.growth >= 0 ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
                {Math.abs(analyticsData.revenue.growth)}%
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              ₹{analyticsData.revenue.total.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              This month: ₹{analyticsData.revenue.thisMonth.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                analyticsData.orders.growth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {analyticsData.orders.growth >= 0 ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
                {Math.abs(analyticsData.orders.growth)}%
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {analyticsData.orders.total}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {analyticsData.orders.pending} pending · {analyticsData.orders.completed} completed
            </p>
          </CardContent>
        </Card>

        {/* Customers Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                analyticsData.customers.growth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {analyticsData.customers.growth >= 0 ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
                {Math.abs(analyticsData.customers.growth)}%
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Customers</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {analyticsData.customers.total}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {analyticsData.customers.new} new · {analyticsData.customers.returning} returning
            </p>
          </CardContent>
        </Card>

        {/* Products Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Products</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {analyticsData.products.total}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Total active products
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Revenue Trend - Last 12 Months
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analyticsData.revenueByMonth.length > 0 ? (
            <div className="space-y-4">
              {analyticsData.revenueByMonth.map((data, index) => (
                <div key={data.month} className="flex items-center gap-4">
                  <div className="w-16 text-sm font-medium text-gray-600">{data.month}</div>
                  <div className="flex-1">
                    <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-sky-600 flex items-center justify-end px-3 transition-all duration-500"
                        style={{
                          width: `${Math.max(
                            (data.revenue / Math.max(...analyticsData.revenueByMonth.map(d => d.revenue), 1)) * 100,
                            data.revenue > 0 ? 5 : 0
                          )}%`
                        }}
                      >
                        <span className="text-white text-xs font-semibold">
                          ₹{data.revenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No revenue data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Top Selling Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analyticsData.topProducts.length > 0 ? (
            <div className="space-y-4">
              {analyticsData.topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg font-bold text-blue-600">
                    #{index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {product.sales} sales · ₹{product.revenue.toLocaleString()} revenue
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{product.revenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">{product.sales} units</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No product sales data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Order Value</p>
                <p className="text-xl font-bold text-gray-900">
                  ₹{analyticsData.orders.total > 0 ? 
                    Math.round(analyticsData.revenue.total / analyticsData.orders.total).toLocaleString() : 
                    '0'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-xl font-bold text-gray-900">
                  {analyticsData.customers.total > 0 ? 
                    ((analyticsData.orders.total / analyticsData.customers.total) * 100).toFixed(1) :
                    '0.0'
                  }%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Customer Lifetime Value</p>
                <p className="text-xl font-bold text-gray-900">
                  ₹{analyticsData.customers.total > 0 ?
                    Math.round(analyticsData.revenue.total / analyticsData.customers.total).toLocaleString() :
                    '0'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}