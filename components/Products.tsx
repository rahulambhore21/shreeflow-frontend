"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Droplets, Clock, Waves, Plus, Star, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useLocalCart } from "@/context/LocalCartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { productService, Product } from "@/lib/services/productService";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const { addToCart, cart } = useLocalCart();
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await productService.getAllProducts({ limit: 8 });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Use fallback data if API fails
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  const handleAddToCart = async (product: Product) => {
    try {
      setCartLoading(true);
      await addToCart({
        productId: product._id,
        title: product.title,
        price: product.price || 0,
        image: product.image || '/photo1.png',
        stock: product.stock || 0
      });
    } catch (error) {
      console.error('Error adding product to cart:', error);
    } finally {
      setCartLoading(false);
    }
  };

  const handleViewProduct = (product: Product) => {
    const slug = product.title.toLowerCase().replace(/\s+/g, '-');
    router.push(`/products/${slug}`);
  };

  if (isLoading) {
    return (
      <section id="products" className="py-16 md:py-24 bg-gradient-to-b from-background to-blue-50 relative overflow-hidden water-pattern">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Our Products
            </h2>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-16 md:py-24 bg-gradient-to-b from-background to-blue-50 relative overflow-hidden water-pattern">
      {/* Blue water pattern background */}
      <div className="absolute inset-0 water-pattern opacity-30"></div>
      
      {/* Floating blue waves decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Waves className="absolute top-20 right-10 w-16 h-16 text-blue-400/20 animate-[wave-float_4s_ease-in-out_infinite]" />
        <Waves className="absolute bottom-20 left-10 w-20 h-20 text-sky-400/20 animate-[wave-float_6s_ease-in-out_infinite]" style={{ animationDelay: "2s" }} />
        <Droplets className="absolute top-32 left-1/3 w-8 h-8 text-cyan-400/15 animate-[water-drop_3s_ease-in-out_infinite]" />
        <Droplets className="absolute bottom-40 right-1/4 w-6 h-6 text-blue-400/15 animate-[water-drop_4s_ease-in-out_infinite]" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Our Products
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Complete water management solutions for your home and business needs.
          </p>
        </div>

        {products.length > 0 ? (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-16">
              {products.map((product) => (
                <div 
                  key={product._id} 
                  onClick={() => handleViewProduct(product)}
                  className="bg-white rounded-2xl border border-blue-200/30 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 p-6 relative group">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-6 space-y-4">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-foreground line-clamp-2">
                      {product.title}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-blue-600">
                        ₹{product.price.toLocaleString()}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-1">
                      {product.categories.slice(0, 2).map((category, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {category}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-gray-100">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        disabled={cartLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:from-blue-700 hover:to-sky-700 gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        {cartLoading ? 'Adding...' : 'Add to Cart'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Fallback Content */
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Product Images Gallery */}
            <div className="space-y-6">
              {/* Main Product Image with blue accents */}
              <div className="aspect-square bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 rounded-xl overflow-hidden p-8 border border-blue-200/50 relative">
                {/* Blue water droplet decorations */}
                <div className="absolute top-4 right-4">
                  <Droplets className="w-6 h-6 text-blue-400/40 animate-[water-drop_3s_ease-in-out_infinite]" />
                </div>
                <div className="absolute bottom-4 left-4">
                  <Droplets className="w-4 h-4 text-sky-400/40 animate-[water-drop_4s_ease-in-out_infinite]" style={{ animationDelay: "1s" }} />
                </div>
                
                <div className="w-full h-full relative">
                  <Image
                    src="/photo1.png"
                    alt="Shree Flow Water Level Controller"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              
              {/* Feature Icons with blue theme */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-sky-100 rounded-lg p-4 text-center border border-blue-200/30 hover:border-blue-300/50 transition-colors group">
                  <Droplets className="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform animate-[wave-float_3s_ease-in-out_infinite]" />
                  <p className="text-sm font-medium text-foreground">Smart Detection</p>
                </div>
                <div className="bg-gradient-to-br from-sky-50 to-cyan-100 rounded-lg p-4 text-center border border-sky-200/30 hover:border-sky-300/50 transition-colors group">
                  <Shield className="w-8 h-8 text-sky-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-foreground">Protected</p>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  (500+ installations)
                </span>
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Advanced Water Level Controller
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Eliminate water wastage and prevent motor damage with our intelligent
                  water level controller. Designed specifically for Indian homes and
                  commercial buildings.
                </p>
              </div>

              {/* Key Features with blue color scheme */}
              <div className="grid sm:grid-cols-2 gap-6">
                {keyFeatures.map((feature, index) => (
                  <div key={index} className="flex gap-3 group">
                    <div className={`w-10 h-10 bg-gradient-to-br from-blue-100 to-sky-100 rounded-lg flex items-center justify-center shrink-0 border border-blue-200/40 group-hover:scale-110 transition-transform`}>
                      <feature.icon className={`w-5 h-5 ${feature.color}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Highlights with blue accents */}
              <div className="bg-gradient-to-br from-blue-50/70 to-sky-50/70 rounded-lg p-6 border border-blue-200/30">
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Waves className="w-5 h-5 text-blue-600" />
                  Product Highlights
                </h4>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1 shrink-0">✓</span>
                      <span className="text-muted-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons with blue gradient */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={scrollToContact}
                  className="bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:from-blue-700 hover:to-sky-700 gap-2 flex-1 py-3 shadow-lg shadow-blue-500/25 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  Buy Now - ₹2,999
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={scrollToContact}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 gap-2 flex-1 py-3"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* View All Products Button */}
        {products.length > 0 && (
          <div className="text-center">
            <Button
              size="lg"
              onClick={() => router.push('/products')}
              variant="outline"
              className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 gap-2"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
