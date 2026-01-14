"use client";

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Edit, Trash2, Package, DollarSign, Archive } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { productService } from '@/lib/services/productService';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface Product {
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

export default function ProductViewPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [resolvedParams.id]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await productService.getProductById(resolvedParams.id);
      setProduct(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load product",
        variant: "destructive",
      });
      router.push('/admin/products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await productService.deleteProduct(resolvedParams.id);
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      
      router.push('/admin/products');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete product",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <AdminGuard>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading product...</p>
            </div>
          </div>
        </AdminLayout>
      </AdminGuard>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/admin/products')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
              <Badge variant={product.active ? "default" : "secondary"}>
                {product.active ? 'Active' : 'Inactive'}
              </Badge>
              {product.stock === 0 && (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/admin/products/${product._id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Image and Details */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{product.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Product Image */}
                  <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <Separator />

                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{product.description}</p>
                  </div>

                  {/* Categories */}
                  {product.categories.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.categories.map((category, index) => (
                          <Badge key={index} variant="outline">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Product Information Sidebar */}
            <div className="space-y-4">
              {/* Price & Stock Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Product Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm">Price</span>
                    </div>
                    <span className="text-lg font-bold">₹{product.price.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span className="text-sm">Stock</span>
                    </div>
                    <span className={`text-lg font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Archive className="h-4 w-4" />
                      <span className="text-sm">Status</span>
                    </div>
                    <Badge variant={product.active ? "default" : "secondary"}>
                      {product.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {product.sku && (
                    <div>
                      <span className="text-sm text-muted-foreground">SKU:</span>
                      <p className="font-medium">{product.sku}</p>
                    </div>
                  )}
                  
                  {product.size && (
                    <div>
                      <span className="text-sm text-muted-foreground">Size:</span>
                      <p className="font-medium">{product.size}</p>
                    </div>
                  )}
                  
                  {product.color && (
                    <div>
                      <span className="text-sm text-muted-foreground">Color:</span>
                      <p className="font-medium">{product.color}</p>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <span className="text-sm text-muted-foreground">Created:</span>
                    <p className="font-medium">{new Date(product.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">Last Updated:</span>
                    <p className="font-medium">{new Date(product.updatedAt).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the product "{product.title}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AdminLayout>
    </AdminGuard>
  );
}
