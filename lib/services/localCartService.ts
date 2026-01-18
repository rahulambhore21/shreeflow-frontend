'use client';

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface LocalCart {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
}

const CART_STORAGE_KEY = 'shreeflow_cart';

class LocalCartService {
  
  // Get cart from localStorage
  getCart(): LocalCart {
    if (typeof window === 'undefined') {
      return { items: [], totalAmount: 0, itemCount: 0 };
    }

    try {
      const cartData = localStorage.getItem(CART_STORAGE_KEY);
      if (!cartData) {
        return { items: [], totalAmount: 0, itemCount: 0 };
      }

      const cart: CartItem[] = JSON.parse(cartData);
      return this.calculateCartTotals(cart);
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return { items: [], totalAmount: 0, itemCount: 0 };
    }
  }

  // Save cart to localStorage
  saveCart(items: CartItem[]): LocalCart {
    if (typeof window === 'undefined') {
      return { items: [], totalAmount: 0, itemCount: 0 };
    }

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      return this.calculateCartTotals(items);
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
      return { items: [], totalAmount: 0, itemCount: 0 };
    }
  }

  // Add item to cart
  addToCart(product: Omit<CartItem, 'quantity'>, quantity: number = 1): LocalCart {
    // Validate product data
    if (!product.productId || !product.title || typeof product.price !== 'number') {
      console.error('Invalid product data:', product);
      throw new Error('Invalid product data');
    }

    const cart = this.getCart();
    const existingItemIndex = cart.items.findIndex(item => item.productId === product.productId);

    if (existingItemIndex !== -1) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      const newItem: CartItem = {
        productId: product.productId,
        title: product.title,
        price: product.price || 0,
        image: product.image || '',
        quantity: quantity
      };
      cart.items.push(newItem);
    }

    return this.saveCart(cart.items);
  }

  // Update item quantity
  updateQuantity(productId: string, quantity: number): LocalCart {
    const cart = this.getCart();
    const itemIndex = cart.items.findIndex(item => item.productId === productId);

    if (itemIndex !== -1) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        cart.items.splice(itemIndex, 1);
      } else {
        // Update quantity
        cart.items[itemIndex].quantity = quantity;
      }
    }

    return this.saveCart(cart.items);
  }

  // Remove item from cart
  removeFromCart(productId: string): LocalCart {
    const cart = this.getCart();
    const filteredItems = cart.items.filter(item => item.productId !== productId);
    return this.saveCart(filteredItems);
  }

  // Clear entire cart
  clearCart(): LocalCart {
    return this.saveCart([]);
  }

  // Calculate cart totals with validation
  private calculateCartTotals(items: CartItem[]): LocalCart {
    // Filter out invalid items
    const validItems = items.filter(item => 
      item.productId && 
      item.title && 
      typeof item.price === 'number' && 
      typeof item.quantity === 'number'
    );

    const totalAmount = validItems.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
    
    const itemCount = validItems.reduce((count, item) => count + (item.quantity || 0), 0);

    return {
      items: validItems,
      totalAmount,
      itemCount
    };
  }

  // Get item count
  getItemCount(): number {
    return this.getCart().itemCount;
  }

  // Check if cart has items
  hasItems(): boolean {
    return this.getCart().items.length > 0;
  }

  // Get cart for order creation
  getCartForOrder(): { productId: string; quantity: number }[] {
    const cart = this.getCart();
    return cart.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));
  }
}

export const localCartService = new LocalCartService();