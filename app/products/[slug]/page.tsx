"use client";

import React, { use } from 'react';
import { notFound } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Zap, Droplets, Clock, Star, ShoppingCart, Phone, CheckCircle, Award, Truck, Headphones } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock product data - replace with actual API call
const getProductData = (slug: string) => {
  const products = {
    'shree-flow-basic': {
      id: 1,
      name: 'Shree Flow Basic Water Level Controller',
      slug: 'shree-flow-basic',
      price: 2999,
      originalPrice: 3999,
      image: '/photo1.png',
      gallery: ['/photo1.png', '/photo1.png', '/photo1.png'],
      rating: 4.8,
      reviews: 342,
      inStock: true,
      description: 'The perfect water level controller for small to medium homes. Eliminate water wastage and protect your motor with our intelligent control system.',
      longDescription: 'Our Shree Flow Basic Water Level Controller is designed specifically for Indian homes and buildings. With advanced sensor technology and robust protection features, it ensures your water tanks never overflow and your motors never run dry.',
      features: [
        'Smart Water Detection Technology',
        'Automatic Motor ON/OFF Control',
        'Built-in Voltage Protection',
        '24/7 Monitoring with LED Indicators',
        'Dry Run Protection',
        'Easy Installation'
      ],
      specifications: {
        'Power Supply': '230V AC, 50Hz',
        'Current Rating': '16A Max',
        'Sensor Type': 'Water Level Sensor',
        'Protection': 'IP55 Rated',
        'Warranty': '2 Years',
        'Installation': 'Wall Mount'
      },
      highlights: [
        'Works with both overhead & underground tanks',
        'Easy installation with simple wiring',
        'LED level indicators for instant status',
        'Made in India for Indian conditions',
        '500+ successful installations',
        'Free installation support available'
      ]
    },
    'shree-flow-pro': {
      id: 2,
      name: 'Shree Flow Pro Water Level Controller',
      slug: 'shree-flow-pro',
      price: 4999,
      originalPrice: 6999,
      image: '/photo2.png',
      gallery: ['/photo2.png', '/photo2.png', '/photo2.png'],
      rating: 4.9,
      reviews: 189,
      inStock: true,
      description: 'Advanced water level controller with mobile app connectivity and smart scheduling features for modern homes.',
      longDescription: 'The Shree Flow Pro takes water management to the next level with IoT connectivity, mobile app control, and advanced scheduling features. Perfect for smart homes and commercial applications.',
      features: [
        'IoT Connectivity & Mobile App',
        'Smart Scheduling & Timer Functions',
        'Remote Monitoring & Control',
        'Advanced Multi-Tank Support',
        'Energy Efficiency Monitoring',
        'Cloud Data Analytics'
      ],
      specifications: {
        'Power Supply': '230V AC, 50Hz',
        'Current Rating': '25A Max',
        'Connectivity': 'WiFi, Bluetooth',
        'App Support': 'iOS & Android',
        'Protection': 'IP65 Rated',
        'Warranty': '3 Years'
      },
      highlights: [
        'Control from anywhere via mobile app',
        'Multi-tank management capability',
        'Energy usage analytics',
        'Smart scheduling and automation',
        'Cloud backup of all data',
        'Professional installation included'
      ]
    }
  };

  return products[slug as keyof typeof products] || null;
};

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const product = getProductData(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const scrollToContact = () => {
    // For now, redirect to home page contact section
    window.location.href = '/#contact';
  };

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
              <span className="text-foreground">{product.name}</span>
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
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Gallery Thumbnails */}
              <div className="grid grid-cols-3 gap-4">
                {product.gallery.map((image, index) => (
                  <div key={index} className="aspect-square bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors">
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
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
                      className={`w-5 h-5 ${star <= Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
                {product.inStock && (
                  <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    In Stock
                  </span>
                )}
              </div>

              {/* Title and Price */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-blue-600">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xl text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Save ₹{(product.originalPrice - product.price).toLocaleString()}
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
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  size="lg"
                  onClick={scrollToContact}
                  className="bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:from-blue-700 hover:to-sky-700 gap-3 flex-1 py-4 text-lg font-semibold shadow-lg shadow-blue-500/25"
                >
                  Buy Now - ₹{product.price.toLocaleString()}
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
                {product.longDescription}
              </p>
            </div>

            {/* Specifications */}
            <div className="bg-gradient-to-br from-blue-50/50 to-sky-50/50 rounded-2xl p-8 border border-blue-200/30">
              <h2 className="text-2xl font-bold text-foreground mb-6">Technical Specifications</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value], index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-blue-200/30 last:border-b-0">
                    <span className="font-medium text-foreground">{key}:</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">Product Highlights</h2>
              <ul className="grid md:grid-cols-2 gap-4">
                {product.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}