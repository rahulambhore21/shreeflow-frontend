import api from './api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOrderData {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, any>;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface PaymentVerificationData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  order_id: string;
}

class PaymentService {
  private razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  // Load Razorpay script dynamically
  loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  // Create Razorpay order
  async createRazorpayOrder(orderData: RazorpayOrderData): Promise<RazorpayOrder> {
    const response = await api.post('/payments/create-order', orderData);
    return response.data.order;
  }

  // Verify payment
  async verifyPayment(verificationData: PaymentVerificationData): Promise<any> {
    const response = await api.post('/payments/verify-payment', verificationData);
    return response.data;
  }

  // Get payment details (admin only)
  async getPaymentDetails(paymentId: string): Promise<any> {
    const response = await api.get(`/payments/payment-details/${paymentId}`);
    return response.data;
  }

  // Initialize Razorpay payment
  async initializePayment(options: {
    amount: number;
    orderId: string;
    name: string;
    email: string;
    phone: string;
    onSuccess: (response: any) => void;
    onFailure: (error: any) => void;
  }): Promise<void> {
    const isLoaded = await this.loadRazorpayScript();
    
    if (!isLoaded) {
      throw new Error('Failed to load Razorpay script');
    }

    // Create Razorpay order
    const razorpayOrder = await this.createRazorpayOrder({
      amount: options.amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        order_id: options.orderId
      }
    });

    const razorpayOptions = {
      key: this.razorpayKeyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      order_id: razorpayOrder.id,
      name: 'Shree Flow',
      description: 'Water Level Controller',
      image: '/logo.png', // Add your logo
      handler: async (response: any) => {
        try {
          // Verify payment
          const verificationData: PaymentVerificationData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            order_id: options.orderId
          };

          const verificationResult = await this.verifyPayment(verificationData);
          options.onSuccess({
            ...response,
            verification: verificationResult
          });
        } catch (error) {
          options.onFailure(error);
        }
      },
      prefill: {
        name: options.name,
        email: options.email,
        contact: options.phone
      },
      theme: {
        color: '#2563eb' // Blue theme matching your site
      },
      modal: {
        ondismiss: () => {
          options.onFailure(new Error('Payment cancelled by user'));
        }
      }
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  }
}

export const paymentService = new PaymentService();