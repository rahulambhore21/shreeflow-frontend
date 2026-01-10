"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Droplets, Clock, Star, ShoppingCart } from "lucide-react";
import Image from "next/image";
import ProductCard from "@/components/product/ProductCard";

const Products = () => {
  // Product data
  const products = [
    {
      id: 1,
      name: 'Shree Flow Basic Water Level Controller',
      slug: 'shree-flow-basic',
      price: 2999,
      originalPrice: 3999,
      image: '/photo1.png',
      rating: 4.8,
      reviews: 342,
      description: 'The perfect water level controller for small to medium homes. Eliminate water wastage and protect your motor with our intelligent control system.',
      features: [
        'Smart Water Detection Technology',
        'Automatic Motor ON/OFF Control',
        'Built-in Voltage Protection',
        '24/7 Monitoring with LED Indicators',
        'Dry Run Protection',
        'Easy Installation'
      ]
    },
    {
      id: 2,
      name: 'Shree Flow Pro Water Level Controller',
      slug: 'shree-flow-pro',
      price: 4999,
      originalPrice: 6999,
      image: '/photo2.png',
      rating: 4.9,
      reviews: 189,
      description: 'Advanced water level controller with IoT connectivity and mobile app control for smart homes and commercial applications.',
      features: [
        'IoT Connectivity & Mobile App',
        'Smart Scheduling & Timer Functions',
        'Remote Monitoring & Control',
        'Advanced Multi-Tank Support',
        'Energy Efficiency Monitoring',
        'Cloud Data Analytics'
      ]
    }
  ];

  const keyFeatures = [
    {
      icon: Droplets,
      title: "Smart Water Detection",
      description: "Advanced sensors monitor water levels accurately",
      color: "text-blue-600"
    },
    {
      icon: Zap,
      title: "Auto ON/OFF",
      description: "Automatic motor control prevents overflow and dry run",
      color: "text-sky-600"
    },
    {
      icon: Shield,
      title: "Built-in Protection",
      description: "Voltage fluctuation and overload protection",
      color: "text-cyan-600"
    },
    {
      icon: Clock,
      title: "24/7 Monitoring",
      description: "Continuous operation with LED indicators",
      color: "text-blue-500"
    },
  ];

  const highlights = [
    "Works with both overhead & underground tanks",
    "Easy installation with simple wiring",
    "LED level indicators for instant status",
    "Dry run protection saves motor life",
    "1-3 year warranty based on model",
    "Made in India for Indian conditions",
  ];

  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="products" className="py-20 md:py-32 bg-gradient-to-b from-background to-blue-50 relative overflow-hidden water-pattern">
      {/* Blue water pattern background */}
      <div className="absolute inset-0 water-pattern opacity-30"></div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Shree Flow Water Level Controllers
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
            Choose from our range of intelligent water management solutions designed for your specific needs.
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-20">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Why Choose Section */}
        <div className="bg-gradient-to-br from-white/80 to-blue-50/80 rounded-2xl p-8 lg:p-12 border border-blue-200/30 shadow-lg backdrop-blur-sm">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Why Choose Shree Flow Controllers?
            </h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience the complete water management solution with cutting-edge technology
            </p>
          </div>

          {/* Key Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white/60 rounded-xl border border-blue-200/30 hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 bg-gradient-to-br from-blue-100 to-sky-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-200/40`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h4 className="font-semibold text-foreground mb-2">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Highlights */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-center gap-3 bg-white/40 rounded-lg p-4 border border-blue-200/20">
                <span className="text-blue-600 flex-shrink-0 text-lg">✓</span>
                <span className="text-muted-foreground">{highlight}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button
              size="lg"
              onClick={scrollToContact}
              className="bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:from-blue-700 hover:to-sky-700 gap-3 px-8 py-4 text-lg font-semibold shadow-lg shadow-blue-500/25"
            >
              Get Quote for All Products
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
