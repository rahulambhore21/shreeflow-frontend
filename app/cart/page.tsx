'use client';

import React, { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useLocalCart } from "@/context/LocalCartContext";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import Link from "next/link";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, isLoading } = useLocalCart();
  const [showCheckout, setShowCheckout] = useState(false);

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="py-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center">
              <p>Loading your cart...</p>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (showCheckout) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="py-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-8">
              <Button 
                variant="outline" 
                onClick={() => setShowCheckout(false)}
                className="mb-4 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                ← Back to Cart
              </Button>
              <h1 className="text-3xl font-bold">Checkout</h1>
            </div>
            <CheckoutForm onClose={() => setShowCheckout(false)} />
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (cart.items.length === 0) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="py-24 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="mb-8">
              <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-4" />
              <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
              <p className="text-muted-foreground mb-6">
                Start shopping to add items to your cart
              </p>
            </div>
            <div className="space-y-4">
              <Link href="/products">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:from-blue-700 hover:to-sky-700 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Header />
      <div className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {cart.itemCount} item{cart.itemCount !== 1 ? 's' : ''} in your cart
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <Card key={item.productId}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg flex items-center justify-center shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        <p className="text-muted-foreground mb-3">
                          ₹{(item.price || 0).toLocaleString()} each
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="font-semibold min-w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.productId)}
                            className="text-destructive hover:text-destructive transition-all duration-300 hover:scale-110 active:scale-95"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="font-semibold">
                          ₹{((item.price || 0) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span>Subtotal ({cart.itemCount} items)</span>
                      <span>₹{cart.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>₹{cart.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:from-blue-700 hover:to-sky-700 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                    size="lg"
                    onClick={() => setShowCheckout(true)}
                  >
                    Proceed to Checkout
                  </Button>

                  <div className="mt-4 text-center">
                    <Link 
                      href="/products" 
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}