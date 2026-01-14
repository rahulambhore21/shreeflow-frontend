"use client";

import React, { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Zap, Droplets, Clock, Star, ShoppingCart, Phone, CheckCircle, Award, Truck, Headphones } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { productService, Product as BackendProduct } from "@/lib/services/productService";
import { useLocalCart } from "@/context/LocalCartContext";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<BackendProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart, isLoading: cartLoading } = useLocalCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await productService.getProductBySlug(resolvedParams.slug);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const handleAddToCart = async () => {
    await addToCart({
      productId: product._id,
      title: product.title,
      price: product.price,
      image: product.image,
      stock: product.stock
    });
  };

  const scrollToContact = () => {
    window.location.href = '/#contact';
  };

  // Extract features from description or categories
  const features = product.categories.length > 0 
    ? product.categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1))
    : ['Smart Water Detection', 'Automatic Control', 'Easy Installation', 'Durable Design'];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="bg-gradient-to-r from-blue-50 to-sky-50 py-8">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <span>/</span>
              <Link href="/#products" className="hover:text-blue-600">Products</Link>
              <span>/</span>
              <span className="text-foreground">{product.title}</span>
            </div>
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
          </div>
        </div>

        {/* Product Detail Section */}
        <div className="container mx-auto px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Product Images */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="aspect-square bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 rounded-2xl overflow-hidden p-10 border border-blue-200/50 relative shadow-lg">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Gallery Thumbnails - Using same image 3 times since backend has single image */}
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="aspect-square bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors">
                    <Image
                      src={product.image}
                      alt={`${product.title} view ${index}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Rating and Stock */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  4.5 (Reviews)
                </span>
                {product.stock > 0 && (
                  <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    In Stock ({product.stock} available)
                  </span>
                )}
              </div>

              {/* Title and Price */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {product.title}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-blue-600">
                    ₹{product.price.toLocaleString()}
                  </span>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Key Features */}
              <div className="grid gap-3">
                <h3 className="text-xl font-semibold text-foreground">Key Features</h3>
                <ul className="grid gap-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={cartLoading || product.stock === 0}
                  className="bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:from-blue-700 hover:to-sky-700 gap-3 flex-1 py-4 text-lg font-semibold shadow-lg shadow-blue-500/25 disabled:opacity-50"
                >
                  {cartLoading ? 'Adding...' : `Add to Cart - ₹${product.price.toLocaleString()}`}
                  <ShoppingCart className="w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 gap-3 py-4 text-lg font-semibold"
                  onClick={() => window.open('tel:+911234567890')}
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">2-3 Year Warranty</p>
                </div>
                <div className="text-center">
                  <Truck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Free Installation</p>
                </div>
                <div className="text-center">
                  <Headphones className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">24/7 Support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information Tabs */}
          <div className="mt-16 space-y-12">
            {/* Description */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">Product Description</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {product.description}
              </p>
              {product.categories.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-foreground mb-3">Categories:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((cat, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Specifications */}
            <div className="bg-gradient-to-br from-blue-50/50 to-sky-50/50 rounded-2xl p-8 border border-blue-200/30">
              <h2 className="text-2xl font-bold text-foreground mb-6">Product Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {product.sku && (
                  <div className="flex justify-between items-center py-3 border-b border-blue-200/30">
                    <span className="font-medium text-foreground">SKU:</span>
                    <span className="text-muted-foreground">{product.sku}</span>
                  </div>
                )}
                {product.size && (
                  <div className="flex justify-between items-center py-3 border-b border-blue-200/30">
                    <span className="font-medium text-foreground">Size:</span>
                    <span className="text-muted-foreground">{product.size}</span>
                  </div>
                )}
                {product.color && (
                  <div className="flex justify-between items-center py-3 border-b border-blue-200/30">
                    <span className="font-medium text-foreground">Color:</span>
                    <span className="text-muted-foreground">{product.color}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-3 border-b border-blue-200/30">
                  <span className="font-medium text-foreground">Stock:</span>
                  <span className="text-muted-foreground">{product.stock} units available</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-blue-200/30">
                  <span className="font-medium text-foreground">Price:</span>
                  <span className="text-muted-foreground">₹{product.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-blue-200/30 last:border-b-0">
                  <span className="font-medium text-foreground">Warranty:</span>
                  <span className="text-muted-foreground">2 Years</span>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">Why Choose Shree Flow?</h2>
              <ul className="grid md:grid-cols-2 gap-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Genuine product with manufacturer warranty</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Easy installation with professional support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Made in India for Indian conditions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">24/7 customer support available</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Fast and secure checkout process</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Free installation support included</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}