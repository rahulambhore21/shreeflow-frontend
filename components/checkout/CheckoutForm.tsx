'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalCart } from '@/context/LocalCartContext';
import { localCartService } from '@/lib/services/localCartService';
import { paymentService } from '@/lib/services/paymentService';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

interface AddressInfo {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CheckoutFormProps {
  onClose?: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onClose }) => {
  const { cart, clearCart } = useLocalCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
  });

  const [address, setAddress] = useState<AddressInfo>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all customer details.',
        variant: 'destructive',
      });
      return false;
    }

    if (!address.street.trim() || !address.city.trim() || !address.state.trim() || !address.zipCode.trim()) {
      toast({
        title: 'Missing Address',
        description: 'Please fill in all address fields.',
        variant: 'destructive',
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return false;
    }

    if (customer.phone.length < 10) {
      toast({
        title: 'Invalid Phone',
        description: 'Please enter a valid phone number.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || cart.items.length === 0) {
      return;
    }

    setIsLoading(true);

    try {
      // Create order data
      const orderData = {
        customer: {
          name: customer.name.trim(),
          email: customer.email.trim().toLowerCase(),
          phone: customer.phone.trim(),
        },
        products: localCartService.getCartForOrder(),
        amount: cart.totalAmount,
        address,
      };

      // Use the backend API URL from environment or default
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

      // Create order
      const response = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Order API endpoint not found. Please ensure the backend server is running.');
        }
        
        let errorMessage = 'Failed to create order';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use default message
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      // Create Razorpay order for payment
      const razorpayOrderData = {
        amount: cart.totalAmount,
        currency: 'INR',
        receipt: `order_${result.data._id}`,
        notes: {
          orderId: result.data._id,
          customerEmail: customer.email,
        },
      };

      const razorpayResponse = await fetch(`${apiUrl}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(razorpayOrderData),
      });

      if (!razorpayResponse.ok) {
        if (razorpayResponse.status === 404) {
          throw new Error('Payment API endpoint not found. Please ensure the backend server is running.');
        }
        
        let errorMessage = 'Failed to create payment';
        try {
          const errorData = await razorpayResponse.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `Payment server error (${razorpayResponse.status}): ${razorpayResponse.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const razorpayResult = await razorpayResponse.json();

      // Initialize Razorpay payment
      await paymentService.initializePayment({
        amount: cart.totalAmount,
        orderId: result.data._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        onSuccess: async (paymentResponse: any) => {
          // Verify payment
          const verificationData = {
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
            order_id: result.data._id,
          };

          try {
            const verifyResponse = await fetch(`${apiUrl}/payments/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(verificationData),
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            // Clear cart and show success
            clearCart();
            
            toast({
              title: 'Order Successful!',
              description: 'Your order has been placed and payment confirmed.',
            });

            if (onClose) onClose();
            
            // Redirect to thank you page with order details
            const thankYouUrl = `/thank-you?orderId=${result.data._id}&amount=${cart.totalAmount}&name=${encodeURIComponent(customer.name)}&email=${encodeURIComponent(customer.email)}`;
            router.push(thankYouUrl);
          } catch (verifyError) {
            console.error('Payment verification error:', verifyError);
            toast({
              title: 'Payment Verification Failed',
              description: 'Please contact support with your order details.',
              variant: 'destructive',
            });
          }
        },
        onFailure: (error: any) => {
          console.error('Payment failed:', error);
          toast({
            title: 'Payment Failed',
            description: 'Your payment could not be processed. Please try again.',
            variant: 'destructive',
          });
        },
      });

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout Failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Button onClick={() => router.push('/products')}>
            Continue Shopping
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex justify-between">
                <span>{item.title} (x{item.quantity})</span>
                <span>₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <hr />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{cart.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={customer.name}
                onChange={handleCustomerChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={customer.email}
                onChange={handleCustomerChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={customer.phone}
                onChange={handleCustomerChange}
                placeholder="Enter your phone number"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                name="street"
                value={address.street}
                onChange={handleAddressChange}
                placeholder="Enter street address"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  placeholder="Enter city"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                  placeholder="Enter state"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={address.zipCode}
                  onChange={handleAddressChange}
                  placeholder="Enter ZIP code"
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  name="country"
                  value={address.country}
                  onChange={handleAddressChange}
                  placeholder="Enter country"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex gap-4">
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isLoading || cart.items.length === 0}
            className="flex-1"
          >
            {isLoading ? 'Processing...' : `Pay ₹${cart.totalAmount.toLocaleString()}`}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;