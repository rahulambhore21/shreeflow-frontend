"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/services/api';
import { 
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  User,
  MapPin,
  CreditCard,
  Calendar,
  Mail,
  Phone,
  Loader2
} from 'lucide-react';

interface OrderDetailsProps {
  orderId: string;
}

interface OrderDetails {
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
      image?: string;
    };
    quantity: number;
  }>;
  amount: number;
  status: string;
  paymentStatus?: string;
  paymentMethod?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
}

export default function OrderDetailsComponent({ orderId }: OrderDetailsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/orders/admin/all`);
      
      if (response.data.type === 'success') {
        const orders = response.data.data || [];
        const foundOrder = orders.find((o: any) => o._id === orderId);
        
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          toast({
            title: 'Error',
            description: 'Order not found',
            variant: 'destructive',
          });
          router.push('/admin/orders');
        }
      }
    } catch (error: any) {
      console.error('Error loading order:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load order details',
        variant: 'destructive',
      });
      router.push('/admin/orders');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    try {
      setIsUpdating(true);
      const response = await api.put(`/orders/admin/${orderId}/status`, { status: newStatus });
      
      if (response.data.type === 'success') {
        setOrder(prev => prev ? { ...prev, status: newStatus } : null);
        toast({
          title: 'Success',
          description: 'Order status updated successfully',
        });
      }
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update order status',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-5 h-5" />;
      case 'shipped': return <Truck className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h3>
        <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
        <Button onClick={() => router.push('/admin/orders')}>
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2 hover:bg-gray-200 hover:shadow-sm transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</h2>
            <p className="text-gray-600 mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor(order.status)}`}>
          {getStatusIcon(order.status)}
          <span className="font-semibold capitalize">{order.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.products.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      {item.productId?.image ? (
                        <img 
                          src={item.productId.image} 
                          alt={item.productId.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {item.productId?.title || 'Product Unavailable'}
                      </h4>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency((item.productId?.price || 0) * item.quantity)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.productId?.price || 0)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(order.amount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-gray-900">{order.address.street}</p>
                <p className="text-gray-900">
                  {order.address.city}, {order.address.state} {order.address.zipCode}
                </p>
                {order.address.country && (
                  <p className="text-gray-900">{order.address.country}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{order.customer.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <a href={`mailto:${order.customer.email}`} className="text-sm text-blue-600 hover:underline">
                  {order.customer.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href={`tel:${order.customer.phone}`} className="text-sm text-blue-600 hover:underline">
                  {order.customer.phone}
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Order Status Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {order.status === 'pending' && (
                <Button 
                  onClick={() => updateOrderStatus('paid')} 
                  disabled={isUpdating}
                  className="w-full bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
                  Mark as Paid
                </Button>
              )}
              {order.status === 'paid' && (
                <Button 
                  onClick={() => updateOrderStatus('shipped')} 
                  disabled={isUpdating}
                  className="w-full bg-purple-600 hover:bg-purple-700 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Truck className="w-4 h-4 mr-2" />}
                  Mark as Shipped
                </Button>
              )}
              {order.status === 'shipped' && (
                <Button 
                  onClick={() => updateOrderStatus('delivered')} 
                  disabled={isUpdating}
                  className="w-full bg-green-600 hover:bg-green-700 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                  Mark as Delivered
                </Button>
              )}
              {(order.status === 'pending' || order.status === 'paid') && (
                <Button 
                  onClick={() => updateOrderStatus('cancelled')} 
                  disabled={isUpdating}
                  variant="destructive"
                  className="w-full hover:bg-red-700 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Cancel Order
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Payment Information */}
          {order.razorpayPaymentId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-500">Payment ID</p>
                  <p className="font-mono text-xs text-gray-900 break-all">{order.razorpayPaymentId}</p>
                </div>
                {order.razorpayOrderId && (
                  <div>
                    <p className="text-gray-500">Order ID</p>
                    <p className="font-mono text-xs text-gray-900 break-all">{order.razorpayOrderId}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Order Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(order.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
