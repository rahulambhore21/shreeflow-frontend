"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Package,
  Grid3X3,
  List,
  SortAsc,
  SortDesc
} from "lucide-react";
import { productService, Product } from "@/lib/services/productService";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [categories, setCategories] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, selectedCategory, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productService.getAllProducts({ limit: 100 });
      setProducts(response.data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.map((p: Product) => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch products',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'price':
          aValue = a.price || 0;
          bValue = b.price || 0;
          break;
        case 'stock':
          aValue = a.stockQuantity || 0;
          bValue = b.stockQuantity || 0;
          break;
        case 'created':
          aValue = new Date(a.createdAt || 0).getTime();
          bValue = new Date(b.createdAt || 0).getTime();
          break;
        default:
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(productId);
        await fetchProducts();
        toast({
          title: 'Success',
          description: 'Product deleted successfully.',
        });
      } catch (error: any) {
        console.error('Error deleting product:', error);
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to delete product',
          variant: 'destructive',
        });
      }
    }
  };

  const handleToggleActive = async (productId: string, currentStatus: boolean) => {
    try {
      await productService.updateProduct(productId, { active: !currentStatus });
      await fetchProducts();
      toast({
        title: 'Success',
        description: `Product ${!currentStatus ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error: any) {
      console.error('Error toggling product status:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update product status',
        variant: 'destructive',
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <Button onClick={() => router.push('/admin/products/create')} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="stock">Sort by Stock</option>
                <option value="created">Sort by Date</option>
              </select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
            <span>Total: {filteredProducts.length} products</span>
            <span>In Stock: {filteredProducts.filter(p => (p.stockQuantity || 0) > 0).length}</span>
            <span>Out of Stock: {filteredProducts.filter(p => (p.stockQuantity || 0) === 0).length}</span>
          </div>
        </CardContent>
      </Card>

      {/* Products Display */}
      <Card>
        <CardContent className="p-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first product'
                }
              </p>
              <Button onClick={() => router.push('/admin/products/create')}>
                Add Product
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square">
                    <Image
                      src={product.images?.[0] || '/placeholder-product.jpg'}
                      alt={product.name || 'Product'}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button variant="secondary" size="sm" onClick={() => router.push(`/admin/products/${product._id}/edit`)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg">{formatCurrency(product.price || 0)}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        (product.stockQuantity || 0) > 10 
                          ? 'bg-green-100 text-green-800' 
                          : (product.stockQuantity || 0) > 0 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stockQuantity || 0} in stock
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // List View
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Categories</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.title || 'Product'}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Package className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.title}</p>
                            <p className="text-sm text-gray-500">{product.sku || 'No SKU'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {product.categories && product.categories.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {product.categories.map((cat, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {cat}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">No categories</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium">{formatCurrency(product.price || 0)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          (product.stock || 0) > 10 
                            ? 'bg-green-100 text-green-800' 
                            : (product.stock || 0) > 0 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock || 0} units
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleActive(product._id, product.active)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            product.active 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {product.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/products/${product._id}/edit`)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteProduct(product._id)}
                            className="text-red-600 hover:text-red-900 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}