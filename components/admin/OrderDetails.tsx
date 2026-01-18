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
  Loader2,
  Copy,
  Check
} from 'lucide-react';

interface OrderDetailsProps {
  orderId: string;
}

interface OrderDetails {
  _id: string;
  orderId?: string;
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
  shipping_charges?: number;
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
  // Automatic shipment fields
  shiprocket_order_id?: string;
  shiprocket_shipment_id?: string;
  awb_code?: string;
  courier_name?: string;
}

export default function OrderDetailsComponent({ orderId }: OrderDetailsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast({
        title: "Copied!",
        description: `${field} copied to clipboard`,
        duration: 2000,
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

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

  const generateInvoice = async () => {
    try {
      setIsGeneratingInvoice(true);
      
      const response = await api.get(`/shiprocket/invoice/${orderId}`);
      
      if (response.data.type === 'success') {
        // Check if there's an invoice URL
        const invoiceUrl = response.data.data?.invoice_url;
        
        if (invoiceUrl) {
          // Open invoice in new tab
          window.open(invoiceUrl, '_blank');
          toast({
            title: 'Success',
            description: 'Invoice generated successfully',
          });
        } else {
          toast({
            title: 'Success',
            description: 'Invoice generated. Check your Shiprocket dashboard.',
          });
        }
      }
    } catch (error: any) {
      console.error('Error generating invoice:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to generate invoice',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingInvoice(false);
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
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900">Order #{order.orderId || order._id.slice(-8).toUpperCase()}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(order.orderId || order._id, 'Order ID')}
                className="h-8 w-8 p-0 hover:bg-gray-100"
                title="Copy Order ID"
              >
                {copiedField === 'Order ID' ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500" />
                )}
              </Button>
            </div>
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
              
              <div className="mt-6 pt-6 border-t space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>{formatCurrency((order.amount || 0) - (order.shipping_charges || 0))}</span>
                </div>
                {order.shipping_charges && order.shipping_charges > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping Charges</span>
                    <span>{formatCurrency(order.shipping_charges)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t">
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(order.customer.email, 'Email')}
                  className="h-6 w-6 p-0 hover:bg-gray-100 ml-auto"
                  title="Copy Email"
                >
                  {copiedField === 'Email' ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-500" />
                  )}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href={`tel:${order.customer.phone}`} className="text-sm text-blue-600 hover:underline">
                  {order.customer.phone}
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(order.customer.phone, 'Phone')}
                  className="h-6 w-6 p-0 hover:bg-gray-100 ml-auto"
                  title="Copy Phone Number"
                >
                  {copiedField === 'Phone' ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-500" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Shipment Status - Automatic */}
          <Card>
            <CardHeader>
              <CardTitle>Shipment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="w-4 h-4" />
                <span>
                  {order.shiprocket_order_id || order.awb_code ? (
                    <>
                      ✅ Shipment created automatically
                      {order.awb_code && <span className="block mt-1 font-mono text-xs">AWB: {order.awb_code}</span>}
                      {order.courier_name && <span className="block mt-1 text-xs">Courier: {order.courier_name}</span>}
                    </>
                  ) : (
                    'Shipment will be created automatically when order is processed'
                  )}
                </span>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Payment Method</p>
                <p className="font-semibold text-gray-900">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment'}
                </p>
              </div>
              {order.razorpayPaymentId && (
                <>
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
                </>
              )}
              
              {/* Invoice Generation Button */}
              {order.shiprocket_order_id && (
                <div className="pt-3 mt-3 border-t">
                  <Button
                    onClick={generateInvoice}
                    disabled={isGeneratingInvoice}
                    variant="outline"
                    className="w-full hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
                  >
                    {isGeneratingInvoice ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Generating Invoice...
                      </>
                    ) : (
                      <>
                        <Package className="w-4 h-4 mr-2" />
                        Download Invoice
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Generate and download invoice from Shiprocket
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

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
