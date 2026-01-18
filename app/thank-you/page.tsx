"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Package, Truck, Phone, Mail, ArrowRight, Home, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState({
    orderId: searchParams.get('orderId') || 'SF' + Date.now(),
    amount: searchParams.get('amount') || '2999',
    shippingCharge: searchParams.get('shippingCharge') || '0',
    customerName: searchParams.get('name') || 'Customer',
    customerEmail: searchParams.get('email') || '',
    paymentMethod: searchParams.get('paymentMethod') || 'online',
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-blue-50 overflow-x-hidden w-full">
      <Header />
      
      <div className="pt-20 md:pt-24 pb-12 md:pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Success Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">
              Thank You for Your Order!
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {orderDetails.paymentMethod === 'cod' 
                ? 'Your order has been successfully placed. Pay when you receive your order!' 
                : 'Your order has been successfully placed and payment confirmed. We\'re excited to serve you!'}
            </p>
          </div>

          {/* Order Details Card */}
          <Card className="mb-8 border-green-200 bg-green-50/30">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Order Details</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order ID:</span>
                      <span className="font-semibold">#{orderDetails.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Customer:</span>
                      <span className="font-semibold">{orderDetails.customerName}</span>
                    </div>
                    {parseInt(orderDetails.shippingCharge) > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping Charges:</span>
                        <span>₹{parseInt(orderDetails.shippingCharge).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {orderDetails.paymentMethod === 'cod' ? 'Total Amount:' : 'Amount Paid:'}
                      </span>
                      <span className="font-semibold text-green-600">₹{parseInt(orderDetails.amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method:</span>
                      <span className="font-semibold">
                        {orderDetails.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Status:</span>
                      <span className={`font-semibold ${orderDetails.paymentMethod === 'cod' ? 'text-orange-600' : 'text-green-600'}`}>
                        {orderDetails.paymentMethod === 'cod' ? '○ Pay on Delivery' : '✓ Paid'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Date:</span>
                      <span className="font-semibold">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-4">What's Next?</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">Order Processing</p>
                        <p className="text-sm text-muted-foreground">We'll prepare your order within 1-2 business days</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">Shipping</p>
                        <p className="text-sm text-muted-foreground">Free shipping within 3-5 business days</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">Tracking Info</p>
                        <p className="text-sm text-muted-foreground">We'll send tracking details to {orderDetails.customerEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Installation Support */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-2">Free Installation Support</h3>
                    <p className="text-muted-foreground mb-4">
                      Need help with installation? Our technical team is ready to assist you.
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Support: +91 98765 43210
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Warranty Information */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-2">2-Year Warranty</h3>
                    <p className="text-muted-foreground mb-4">
                      Your product comes with comprehensive warranty coverage and 24/7 support.
                    </p>
                    <Button variant="outline">
                      Learn More About Warranty
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:from-blue-700 hover:to-sky-700 gap-2">
                <Home className="w-5 h-5" />
                Back to Home
              </Button>
            </Link>
            
            <Link href="/products">
              <Button size="lg" variant="outline" className="gap-2">
                <ShoppingBag className="w-5 h-5" />
                Continue Shopping
              </Button>
            </Link>

          
          </div>

          {/* Customer Service */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">Need Help?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our customer service team is available 24/7 to assist you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="gap-2">
                <Phone className="w-4 h-4" />
                Call: +91 98765 43210
              </Button>
              <Button variant="outline" className="gap-2">
                <Mail className="w-4 h-4" />
                Email: support@shreeflow.com
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
