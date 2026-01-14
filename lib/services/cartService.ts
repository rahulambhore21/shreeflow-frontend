import api from './api';

export interface CartItem {
  productId: {
    _id: string;
    title: string;
    price: number;
    image: string;
    stock: number;
  };
  quantity: number;
}

export interface CartWithProducts {
  _id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  type: string;
  data: CartWithProducts;
}

class CartService {
  async getUserCart(userId: string): Promise<CartWithProducts> {
    const response = await api.get(`/cart/${userId}`);
    return response.data.data;
  }

  async getCart(userId: string): Promise<CartWithProducts> {
    return this.getUserCart(userId);
  }

  async createCart(userId: string): Promise<CartWithProducts> {
    const response = await api.post('/cart', { userId });
    return response.data.data;
  }

  async addToCart(userId: string, productId: string, quantity: number = 1): Promise<CartWithProducts> {
    const response = await api.post(`/cart/${userId}`, {
      productId,
      quantity
    });
    return response.data.data;
  }

  async updateCartItem(cartId: string, productId: string, quantity: number): Promise<CartWithProducts> {
    const response = await api.put(`/cart/${cartId}/items/${productId}`, {
      quantity
    });
    return response.data.data;
  }

  async removeFromCart(cartId: string, productId: string): Promise<CartWithProducts> {
    const response = await api.delete(`/cart/${cartId}/items/${productId}`);
    return response.data.data;
  }

  async clearCart(userId: string): Promise<void> {
    await api.delete(`/cart/${userId}`);
  }

  // Calculate cart totals
  calculateCartTotal(cart: CartWithProducts): number {
    return cart.items.reduce((total, item) => {
      return total + (item.productId.price * item.quantity);
    }, 0);
  }

  // Calculate total item count
  calculateItemCount(cart: CartWithProducts): number {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  }

  getCartItemCount(cart: CartWithProducts): number {
    return this.calculateItemCount(cart);
  }
}

export const cartService = new CartService();