import api from './api';

export interface OrderProduct {
  productId: string;
  quantity: number;
}

export interface OrderAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface Order {
  _id: string;
  userId: string;
  products: OrderProduct[];
  amount: number;
  address: OrderAddress;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod?: 'online' | 'cod';
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  payment_date?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderWithProducts {
  _id: string;
  userId: string;
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
  shipping_charges?: number;
  address: OrderAddress;
  status: string;
  paymentMethod?: 'online' | 'cod';
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  payment_date?: string;
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

export interface CreateOrderData {
  products: OrderProduct[];
  amount: number;
  address: OrderAddress;
}

class OrderService {
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    const response = await api.post('/orders', orderData);
    return response.data.data;
  }

  async getUserOrders(userId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<OrdersResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await api.get(`/orders/${userId}?${queryParams.toString()}`);
    return response.data;
  }

  async getOrderById(orderId: string): Promise<OrderWithProducts> {
    const response = await api.get(`/orders/${orderId}`);
    return response.data.data;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const response = await api.put(`/orders/${orderId}`, { status });
    return response.data.data;
  }

  async cancelOrder(orderId: string): Promise<Order> {
    const response = await api.put(`/orders/${orderId}`, { status: 'cancelled' });
    return response.data.data;
  }

  // Get all orders (admin only)
  async getAllOrders(params?: {
    page?: number;
    limit?: number;
  }): Promise<OrdersResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await api.get(`/orders?${queryParams.toString()}`);
    return response.data;
  }

  // Get order statistics (admin only)
  async getOrderStats(): Promise<any> {
    const response = await api.get('/orders/income');
    return response.data;
  }

  // Format order status for display
  formatOrderStatus(status: string): { label: string; color: string } {
    switch (status.toLowerCase()) {
      case 'pending':
        return { label: 'Pending', color: 'text-yellow-600' };
      case 'paid':
        return { label: 'Paid', color: 'text-blue-600' };
      case 'shipped':
        return { label: 'Shipped', color: 'text-purple-600' };
      case 'delivered':
        return { label: 'Delivered', color: 'text-green-600' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'text-red-600' };
      default:
        return { label: 'Unknown', color: 'text-gray-600' };
    }
  }
}

export const orderService = new OrderService();