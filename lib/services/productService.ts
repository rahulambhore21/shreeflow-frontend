import api from './api';

export interface Product {
  _id: string;
  title: string;
  description: string;
  image: string;
  categories: string[];
  size?: string;
  color?: string;
  price: number;
  stock: number;
  sku?: string;
  active: boolean;
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
      // Fetch all products and filter by slug (converting title to slug format)
      const response = await this.getAllProducts({ limit: 100 });
      const product = response.data.find(
        (p) => p.title.toLowerCase().replace(/\s+/g, '-') === slug
      );
      return product || null;
    } catch (error) {
      console.error('Error fetching product by slug:', error);
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
      slug: product.title.toLowerCase().replace(/\s+/g, '-'),
      price: product.price,
      originalPrice: undefined, // You can calculate this if you have discount logic
      image: product.image,
      rating: 4.8, // Default rating - you can add this to your backend model
      reviews: 100, // Default reviews - you can add this to your backend model
      description: product.description,
      features: [], // You can extract from description or add to backend model
      inStock: product.stock > 0,
      stock: product.stock,
      categories: product.categories,
      sku: product.sku,
    };
  }
}

export const productService = new ProductService();