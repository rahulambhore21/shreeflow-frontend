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
      image: product.image
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
    <div className="min-h-screen bg-background overflow-x-hidden w-full">
      <Header />
      
      <main className="pt-16 md:pt-20">
        {/* Breadcrumb */}
        <div className="bg-gradient-to-r from-blue-50 to-sky-50 py-4 md:py-8">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-3 md:mb-4 flex-wrap">
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
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start overflow-hidden">
            {/* Product Images */}
            <div className="space-y-4 md:space-y-6 w-full max-w-full">
              {/* Main Image */}
              <div className="aspect-square bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 rounded-xl md:rounded-2xl overflow-hidden p-6 md:p-10 border border-blue-200/50 relative shadow-lg">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6 md:space-y-8 w-full max-w-full overflow-hidden">
              {/* Title and Price */}
              <div className="overflow-hidden">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4 break-words">
                  {product.title}
                </h1>
                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                    ₹{product.price.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed break-words">
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
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6 w-full">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  className="bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:from-blue-700 hover:to-sky-700 gap-2 md:gap-3 flex-1 py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold shadow-lg shadow-blue-500/25 disabled:opacity-50 w-full sm:w-auto">
                  <span className="truncate">{cartLoading ? 'Adding...' : 'Add to Cart'}</span>
                  <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 gap-2 md:gap-3 py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold w-full sm:w-auto"
                  onClick={() => window.open('tel:+917419346490')}
                >
                  <Phone className="w-4 h-4 md:w-5 md:h-5" />
                  Call Now
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-3 md:gap-4 pt-4 md:pt-6 border-t">
                <div className="text-center">
                  <Award className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mx-auto mb-1 md:mb-2" />
                  <p className="text-xs md:text-sm font-medium">2-3 Year Warranty</p>
                </div>
                <div className="text-center">
                  <Truck className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mx-auto mb-1 md:mb-2" />
                  <p className="text-xs md:text-sm font-medium">Free Installation</p>
                </div>
                <div className="text-center">
                  <Headphones className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mx-auto mb-1 md:mb-2" />
                  <p className="text-xs md:text-sm font-medium">24/7 Support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information Tabs */}
          <div className="mt-12 md:mt-16 space-y-8 md:space-y-12">
            {/* Description */}
            <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm overflow-hidden">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-6">Product Description</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base md:text-lg break-words overflow-wrap-anywhere">
                {product.description}
              </p>
              {product.categories.length > 0 && (
                <div className="mt-6 overflow-hidden">
                  <h3 className="font-semibold text-foreground mb-3">Categories:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((cat, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm break-words">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Specifications */}
            <div className="bg-gradient-to-br from-blue-50/50 to-sky-50/50 rounded-xl md:rounded-2xl p-6 md:p-8 border border-blue-200/30 overflow-hidden">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-6">Product Information</h2>
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                {product.sku && (
                  <div className="flex justify-between items-center py-3 border-b border-blue-200/30 gap-4">
                    <span className="font-medium text-foreground shrink-0">SKU:</span>
                    <span className="text-muted-foreground text-right break-words">{product.sku}</span>
                  </div>
                )}
                {product.size && (
                  <div className="flex justify-between items-center py-3 border-b border-blue-200/30 gap-4">
                    <span className="font-medium text-foreground shrink-0">Size:</span>
                    <span className="text-muted-foreground text-right break-words">{product.size}</span>
                  </div>
                )}
                {product.color && (
                  <div className="flex justify-between items-center py-3 border-b border-blue-200/30 gap-4">
                    <span className="font-medium text-foreground shrink-0">Color:</span>
                    <span className="text-muted-foreground text-right break-words">{product.color}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-3 border-b border-blue-200/30 gap-4">
                  <span className="font-medium text-foreground shrink-0">Price:</span>
                  <span className="text-muted-foreground text-right break-words">₹{product.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-blue-200/30 last:border-b-0 gap-4">
                  <span className="font-medium text-foreground shrink-0">Warranty:</span>
                  <span className="text-muted-foreground text-right break-words">2 Years</span>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm overflow-hidden">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-6">Why Choose Shree Flow?</h2>
              <ul className="grid md:grid-cols-2 gap-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground break-words text-sm sm:text-base">Genuine product with manufacturer warranty</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground break-words text-sm sm:text-base">Easy installation with professional support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground break-words text-sm sm:text-base">Made in India for Indian conditions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground break-words text-sm sm:text-base">24/7 customer support available</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground break-words text-sm sm:text-base">Fast and secure checkout process</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground break-words text-sm sm:text-base">Free installation support included</span>
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