import api from './api';

// Analytics interfaces
export interface DashboardAnalytics {
  overview: {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    totalArticles: number;
    totalRevenue: number;
  };
  ordersByStatus: Record<string, number>;
  dailyRevenue: Array<{
    _id: string;
    revenue: number;
    orders: number;
  }>;
  topProducts: Array<{
    _id: string;
    title: string;
    image: string;
    price: number;
    totalSold: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    _id: string;
    customer: {
      name: string;
      email: string;
    };
    amount: number;
    status: string;
    createdAt: string;
  }>;
  userGrowth: Array<{
    _id: string;
    newUsers: number;
  }>;
  topArticles: Array<{
    _id: string;
    title: string;
    views: number;
    likes: number;
    publishedAt: string;
  }>;
}

export interface SalesAnalytics {
  metrics: {
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
  };
  salesByPeriod: Array<{
    _id: string;
    sales: number;
    orders: number;
  }>;
  salesByCategory: Array<{
    _id: string;
    sales: number;
    quantity: number;
  }>;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  repeatCustomers: number;
  retentionRate: number;
  topCustomers: Array<{
    _id: string;
    customerName: string;
    totalSpent: number;
    orderCount: number;
  }>;
  customersByLocation: Array<{
    _id: string;
    state: string;
    city: string;
    uniqueCustomers: number;
    orders: number;
    revenue: number;
  }>;
  averageOrderValue: number;
}

class AnalyticsService {
  async getDashboardAnalytics(startDate?: string, endDate?: string): Promise<DashboardAnalytics> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/analytics/dashboard?${params}`);
    return response.data.data;
  }

  async getSalesAnalytics(period: 'week' | 'month' | 'year' | 'custom' = 'month', startDate?: string, endDate?: string): Promise<SalesAnalytics> {
    const params = new URLSearchParams();
    params.append('period', period);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/analytics/sales?${params}`);
    return response.data.data;
  }

  async getCustomerAnalytics(): Promise<CustomerAnalytics> {
    const response = await api.get('/analytics/customers');
    return response.data.data;
  }
}

export const analyticsService = new AnalyticsService();