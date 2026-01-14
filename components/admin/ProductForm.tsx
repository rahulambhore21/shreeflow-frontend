"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { productService, Product } from '@/lib/services/productService';
import ImageUpload from './ImageUpload';
import { 
  ArrowLeft,
  Save,
  Loader2,
  Upload,
  X
} from 'lucide-react';

interface ProductFormProps {
  mode: 'create' | 'edit';
  productId?: string;
}

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  categories: string[];
  sku?: string;
  size?: string;
  color?: string;
  active: boolean;
}

export default function ProductForm({ mode, productId }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(mode === 'edit');
  const [categoryInput, setCategoryInput] = useState('');

  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    categories: [],
    sku: '',
    size: '',
    color: '',
    active: true
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  useEffect(() => {
    if (mode === 'edit' && productId) {
      loadProduct();
    }
  }, [mode, productId]);

  const loadProduct = async () => {
    try {
      setIsFetching(true);
      const product = await productService.getProductById(productId!);
      
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image: product.image,
        categories: product.categories || [],
        sku: product.sku || '',
        size: product.size || '',
        color: product.color || '',
        active: product.active !== undefined ? product.active : true
      });
    } catch (error) {
      console.error('Error loading product:', error);
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive",
      });
      router.push('/admin/products');
    } finally {
      setIsFetching(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      if (mode === 'create') {
        await productService.createProduct(formData);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      } else {
        await productService.updateProduct(productId!, formData);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      }

      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || `Failed to ${mode} product`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = () => {
    if (categoryInput.trim() && !formData.categories.includes(categoryInput.trim())) {
      setFormData({
        ...formData,
        categories: [...formData.categories, categoryInput.trim()]
      });
      setCategoryInput('');
    }
  };

  const handleRemoveCategory = (category: string) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter(c => c !== category)
    });
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Create New Product' : 'Edit Product'}
          </h2>
          <p className="text-gray-600 mt-1">
            {mode === 'create' 
              ? 'Add a new product to your catalog'
              : 'Update product information'
            }
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">
                    Product Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Premium Water Level Controller"
                    className="mt-1"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your product in detail..."
                    rows={6}
                    className="mt-1"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">
                      Price (₹) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      className="mt-1"
                    />
                    {errors.price && (
                      <p className="text-sm text-red-600 mt-1">{errors.price}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="stock">
                      Stock Quantity <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="mt-1"
                    />
                    {errors.stock && (
                      <p className="text-sm text-red-600 mt-1">{errors.stock}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="sku">SKU (Optional)</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g., WLC-001"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  label="Product Image"
                  disabled={isLoading}
                />
                {errors.image && (
                  <p className="text-sm text-red-600 mt-2">{errors.image}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Add Category</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="category"
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCategory();
                        }
                      }}
                      placeholder="e.g., Controllers"
                    />
                    <Button
                      type="button"
                      onClick={handleAddCategory}
                      disabled={!categoryInput.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {formData.categories.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Current Categories:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.categories.map((category) => (
                        <div
                          key={category}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {category}
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(category)}
                            className="hover:text-blue-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="size">Size (Optional)</Label>
                  <Input
                    id="size"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="e.g., Medium, Large"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="color">Color (Optional)</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="e.g., Blue, White"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="active">Active Status</Label>
                    <p className="text-sm text-gray-500">
                      {formData.active 
                        ? 'Product is visible to customers' 
                        : 'Product is hidden from customers'
                      }
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.active}
                    onClick={() => setFormData({ ...formData, active: !formData.active })}
                    className={`${
                      formData.active ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
                  >
                    <span
                      aria-hidden="true"
                      className={`${
                        formData.active ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {mode === 'create' ? 'Create Product' : 'Update Product'}
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                  className="w-full"
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}