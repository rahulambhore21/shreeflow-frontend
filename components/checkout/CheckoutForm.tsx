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
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [shippingCharge, setShippingCharge] = useState<number>(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingCourier, setShippingCourier] = useState<string>('');
  const [shippingEtd, setShippingEtd] = useState<string>('');
  
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

    // Auto-calculate shipping when zipCode changes and has 6 digits
    if (e.target.name === 'zipCode' && e.target.value.length === 6) {
      calculateShipping(e.target.value);
    }
  };

  const calculateShipping = async (zipCode: string) => {
    if (zipCode.length !== 6) return;

    setIsCalculatingShipping(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      
      // Calculate total weight (assume 0.5 kg per item)
      const totalWeight = cart.items.reduce((sum, item) => sum + (item.quantity * 0.5), 0);
      
      const response = await fetch(`${apiUrl}/shipping/calculate-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          delivery_postcode: zipCode,
          weight: totalWeight,
          cod: paymentMethod === 'cod',
          order_amount: cart.totalAmount
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.type === 'success' && result.data.available) {
          setShippingCharge(result.data.shipping_charge || 0);
          setShippingCourier(result.data.courier_name || '');
          setShippingEtd(result.data.estimated_delivery_days || '');
          
          if (result.data.shipping_charge > 0) {
            toast({
              title: 'Shipping Calculated',
              description: `Shipping charge: ₹${result.data.shipping_charge} via ${result.data.courier_name || 'courier'}`,
            });
          }
        } else {
          setShippingCharge(0);
          // Only show toast if there's an important message (not just unavailable)
          if (result.data.requiresReauth) {
            console.warn('Shiprocket requires re-authentication');
          }
          // Don't show error toast for normal unavailability
        }
      } else {
        setShippingCharge(0);
      }
    } catch (error) {
      console.error('Shipping calculation error:', error);
      setShippingCharge(0);
      // Set zero shipping silently - don't block checkout
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const handlePaymentMethodChange = (method: 'online' | 'cod') => {
    setPaymentMethod(method);
    // Recalculate shipping if zipCode is filled
    if (address.zipCode.length === 6) {
      calculateShipping(address.zipCode);
    }
  };

  const validateForm = () => {
    // Check if all customer fields are filled
    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all customer details.',
        variant: 'destructive',
      });
      return false;
    }

    // Validate name (minimum 2 characters, letters and spaces only)
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    if (!nameRegex.test(customer.name.trim())) {
      toast({
        title: 'Invalid Name',
        description: 'Please enter a valid name (minimum 2 characters, letters only).',
        variant: 'destructive',
      });
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email.trim())) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return false;
    }

    // Validate phone number (must be 10 digits)
    const phoneDigits = customer.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10 || !/^[6-9]\d{9}$/.test(phoneDigits)) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid 10-digit Indian mobile number.',
        variant: 'destructive',
      });
      return false;
    }

    // Check if all address fields are filled
    if (!address.street.trim() || !address.city.trim() || !address.state.trim() || !address.zipCode.trim()) {
      toast({
        title: 'Missing Address',
        description: 'Please fill in all address fields.',
        variant: 'destructive',
      });
      return false;
    }

    // Validate zipCode (must be 6 digits)
    if (!/^\d{6}$/.test(address.zipCode)) {
      toast({
        title: 'Invalid Pincode',
        description: 'Please enter a valid 6-digit pincode.',
        variant: 'destructive',
      });
      return false;
    }

    // Validate street address length
    if (address.street.trim().length < 10) {
      toast({
        title: 'Incomplete Address',
        description: 'Please provide a complete street address (minimum 10 characters).',
        variant: 'destructive',
      });
      return false;
    }

    // Check if shipping has been calculated
    if (shippingCharge === 0 && paymentMethod === 'online') {
      toast({
        title: 'Shipping Not Calculated',
        description: 'Please wait for shipping charges to be calculated.',
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
      // Calculate final amount with shipping
      const finalAmount = cart.totalAmount + shippingCharge;

      // Create order data
      const orderData = {
        customer: {
          name: customer.name.trim(),
          email: customer.email.trim().toLowerCase(),
          phone: customer.phone.trim(),
        },
        products: localCartService.getCartForOrder(),
        amount: finalAmount,
        shipping_charges: shippingCharge,
        address,
        paymentMethod, // Add payment method
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

      // If COD, skip Razorpay and redirect directly
      if (paymentMethod === 'cod') {
        clearCart();
        
        toast({
          title: 'Order Placed Successfully!',
          description: 'Your order has been placed. Pay on delivery.',
        });

        if (onClose) onClose();
        
        // Redirect to thank you page with shipping info
        const thankYouUrl = `/thank-you?orderId=${result.data.orderId || result.data._id}&amount=${finalAmount}&shippingCharge=${shippingCharge}&name=${encodeURIComponent(customer.name)}&email=${encodeURIComponent(customer.email)}&paymentMethod=cod`;
        router.push(thankYouUrl);
        return;
      }

      // For online payment, continue with Razorpay
      // Create Razorpay order for payment
      const razorpayOrderData = {
        amount: finalAmount,
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
        amount: finalAmount,
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
            const thankYouUrl = `/thank-you?orderId=${result.data.orderId || result.data._id}&amount=${finalAmount}&shippingCharge=${shippingCharge}&name=${encodeURIComponent(customer.name)}&email=${encodeURIComponent(customer.email)}`;
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
    <div className="max-w-2xl mx-auto space-y-6 ">
      {/* Order Summary */}
      <Card className='bg-blue-600 text-white'>
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
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{cart.totalAmount.toLocaleString()}</span>
            </div>
            {shippingCharge > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Shipping {shippingCourier && `(${shippingCourier})`}
                  {shippingEtd && ` - ${shippingEtd} days`}
                </span>
                <span>₹{shippingCharge.toLocaleString()}</span>
              </div>
            )}
            {isCalculatingShipping && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Calculating shipping...</span>
                <span>...</span>
              </div>
            )}
            <hr className="my-2" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{(cart.totalAmount + shippingCharge).toLocaleString()}</span>
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

        {/* Payment Method Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handlePaymentMethodChange('online')}>
                <input
                  type="radio"
                  id="online"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={() => handlePaymentMethodChange('online')}
                  className="w-4 h-4 text-blue-600"
                />
                <Label htmlFor="online" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Online Payment</div>
                  <div className="text-sm text-gray-500">Pay securely using Razorpay (Cards, UPI, Netbanking)</div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handlePaymentMethodChange('cod')}>
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => handlePaymentMethodChange('cod')}
                  className="w-4 h-4 text-blue-600"
                />
                <Label htmlFor="cod" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Cash on Delivery (COD)</div>
                  <div className="text-sm text-gray-500">Pay when you receive your order</div>
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex gap-4 ">
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isLoading || cart.items.length === 0}
            className="flex-1 bg-blue-600 text-white"
          >
            {isLoading ? 'Processing...' : paymentMethod === 'cod' ? `Place Order (COD) - ₹${(cart.totalAmount + shippingCharge).toLocaleString()}` : `Pay ₹${(cart.totalAmount + shippingCharge).toLocaleString()}`}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;