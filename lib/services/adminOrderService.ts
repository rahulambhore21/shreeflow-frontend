import api from './api';

export interface OrderWithProducts {
  _id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  products: Array<{
    productId: {
      _id: string;
      title: string;
      price: number;
      image: string;
    };
    quantity: number;
  }>;
  amount: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  payment_date?: string;
  shipment_id?: string;
  awb?: string;
  courier_name?: string;
  tracking_url?: string;
  estimated_delivery?: string;
  shipping_charges: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  type: string;
  data: OrderWithProducts[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface OrderAnalytics {
  totalOrders: number;
  ordersByStatus: {
    pending: number;
    paid: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  totalRevenue: number;
  monthlyRevenue: Array<{
    _id: {
      year: number;
      month: number;
    };
    revenue: number;
    orders: number;
  }>;
  recentOrders: Array<{
    _id: string;
    customer: {
      name: string;
    };
    amount: number;
    status: string;
    createdAt: string;
  }>;
  topCustomers: Array<{
    _id: string;
    customerName: string;
    totalSpent: number;
    orderCount: number;
  }>;
}

class AdminOrderService {
  async getAllOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<OrdersResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);

    const response = await api.get(`/orders/admin/all?${queryParams}`);
    return response.data;
  }

  async updateOrderStatus(
    orderId: string, 
    data: {
      status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
      courier_name?: string;
      awb?: string;
      tracking_url?: string;
      estimated_delivery?: string;
    }
  ): Promise<OrderWithProducts> {
    const response = await api.put(`/orders/admin/${orderId}/status`, data);
    return response.data.data;
  }

  async getOrderAnalytics(): Promise<OrderAnalytics> {
    const response = await api.get('/orders/admin/analytics');
    return response.data.data;
  }
}

export const adminOrderService = new AdminOrderService();