import api from './api';
import { generateSlug } from '../slug';

export interface Product {
  _id: string;
  title: string;
  description: string;
  image: string;
  categories: string[];
  size?: string;
  color?: string;
  price: number;
  sku?: string;
  active: boolean;
  weight?: number;
  length?: number;
  breadth?: number;
  height?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  type: string;
  data: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

class ProductService {
  async getAllProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    new?: boolean;
  }): Promise<ProductsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.new) queryParams.append('new', 'true');

    const response = await api.get(`/products?${queryParams.toString()}`);
    return response.data;
  }

  async getProductById(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      // Use the backend endpoint directly - it handles slug-to-title conversion
      console.log(`[ProductService] Fetching product by slug: ${slug}`);
      const response = await api.get(`/products/${slug}`);
      console.log(`[ProductService] Successfully fetched product: ${response.data.data?.title}`);
      return response.data.data;
    } catch (error: any) {
      // Return null if product not found (404) or other errors
      if (error.response?.status === 404) {
        console.log(`[ProductService] Product not found for slug: ${slug}`);
      } else {
        console.error('[ProductService] Error fetching product by slug:', {
          slug,
          error: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url,
          baseURL: error.config?.baseURL
        });
      }
      return null;
    }
  }

  async createProduct(productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      console.log('Creating product with data:', productData);
      const response = await api.post('/products', productData);
      console.log('Product creation response:', response.data);
      return response.data.data || response.data.savedProduct;
    } catch (error: any) {
      console.error('Error in createProduct service:', error);
      throw error;
    }
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    const response = await api.put(`/products/${id}`, productData);
    return response.data.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  }

  // Convert backend product to frontend format
  convertToFrontendProduct(product: Product) {
    return {
      id: product._id,
      name: product.title,
      slug: generateSlug(product.title),
      price: product.price,
      originalPrice: undefined, // You can calculate this if you have discount logic
      image: product.image,
      rating: 4.8, // Default rating - you can add this to your backend model
      reviews: 100, // Default reviews - you can add this to your backend model
      description: product.description,
      features: [], // You can extract from description or add to backend model
      inStock: true, // Always in stock since we removed inventory tracking
      categories: product.categories,
      sku: product.sku,
    };
  }
}

export const productService = new ProductService();