'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService, CartWithProducts, CartItem } from '@/lib/services/cartService';
import { authService } from '@/lib/services/authService';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

interface CartContextType {
  cart: CartWithProducts | null;
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  getTotalAmount: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartWithProducts | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load cart when user authentication state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserCart();
    } else {
      setCart(null);
    }
  }, [user, isAuthenticated]);

  const loadUserCart = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const userCart = await cartService.getUserCart(user._id);
      setCart(userCart);
    } catch (error) {
      console.error('Error loading cart:', error);
      // If no cart exists, create one
      try {
        const newCart = await cartService.createCart(user._id);
        setCart(newCart);
      } catch (createError) {
        console.error('Error creating cart:', createError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to add items to cart.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      await cartService.addToCart(productId, quantity);
      await loadUserCart();
      
      toast({
        title: 'Added to Cart',
        description: 'Item has been added to your cart.',
      });
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add item to cart.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!cart || !user) return;

    try {
      setIsLoading(true);
      await cartService.updateCartItem(cart._id, productId, quantity);
      await loadUserCart();
    } catch (error: any) {
      console.error('Error updating cart:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update cart.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!cart || !user) return;

    try {
      setIsLoading(true);
      await cartService.removeFromCart(cart._id, productId);
      await loadUserCart();
      
      toast({
        title: 'Item Removed',
        description: 'Item has been removed from your cart.',
      });
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to remove item from cart.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!cart || !user) return;

    try {
      setIsLoading(true);
      await cartService.clearCart(cart._id);
      await loadUserCart();
      
      toast({
        title: 'Cart Cleared',
        description: 'All items have been removed from your cart.',
      });
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to clear cart.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCart = async () => {
    if (user) {
      await loadUserCart();
    }
  };

  const getTotalAmount = (): number => {
    if (!cart) return 0;
    return cartService.calculateCartTotal(cart);
  };

  const getItemCount = (): number => {
    if (!cart) return 0;
    return cartService.getCartItemCount(cart);
  };

  const value: CartContextType = {
    cart,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    getTotalAmount,
    getItemCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};