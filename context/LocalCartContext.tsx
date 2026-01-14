'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { localCartService, LocalCart, CartItem } from '@/lib/services/localCartService';
import { toast } from '@/hooks/use-toast';

interface LocalCartContextType {
  cart: LocalCart;
  isLoading: boolean;
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  refreshCart: () => void;
}

const LocalCartContext = createContext<LocalCartContextType | undefined>(undefined);

export const LocalCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<LocalCart>({ items: [], totalAmount: 0, itemCount: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const loadCart = () => {
      setIsLoading(true);
      const savedCart = localCartService.getCart();
      setCart(savedCart);
      setIsLoading(false);
    };

    loadCart();
  }, []);

  const refreshCart = () => {
    const updatedCart = localCartService.getCart();
    setCart(updatedCart);
  };

  const addToCart = (product: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    try {
      // Validate product data before adding
      if (!product.productId || !product.title || typeof product.price !== 'number') {
        throw new Error('Invalid product data');
      }

      const updatedCart = localCartService.addToCart(product, quantity);
      setCart(updatedCart);
      
      toast({
        title: 'Added to Cart',
        description: `${product.title} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Invalid product data.',
        variant: 'destructive',
      });
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    try {
      const updatedCart = localCartService.updateQuantity(productId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      toast({
        title: 'Error',
        description: 'Failed to update item quantity. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const removeFromCart = (productId: string) => {
    try {
      const updatedCart = localCartService.removeFromCart(productId);
      setCart(updatedCart);
      
      toast({
        title: 'Item Removed',
        description: 'Item has been removed from your cart.',
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item from cart. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const clearCart = () => {
    try {
      const updatedCart = localCartService.clearCart();
      setCart(updatedCart);
      
      toast({
        title: 'Cart Cleared',
        description: 'All items have been removed from your cart.',
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear cart. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const value: LocalCartContextType = {
    cart,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return (
    <LocalCartContext.Provider value={value}>
      {children}
    </LocalCartContext.Provider>
  );
};

export const useLocalCart = (): LocalCartContextType => {
  const context = useContext(LocalCartContext);
  if (context === undefined) {
    throw new Error('useLocalCart must be used within a LocalCartProvider');
  }
  return context;
};