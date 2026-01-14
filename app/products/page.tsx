"use client";

import React, { useEffect, useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileActions from "@/components/MobileActions";
import { Button } from "@/components/ui/button";
import { Star, Eye, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useLocalCart } from "@/context/LocalCartContext";
import { useRouter } from "next/navigation";
import { productService, Product } from "@/lib/services/productService";

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart, isLoading: cartLoading } = useLocalCart();
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await productService.getAllProducts({ limit: 20 });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product: Product) => {
    await addToCart({
      productId: product._id,
      title: product.title,
      price: product.price,
      image: product.image,
      stock: product.stock
    });
  };

  const handleViewProduct = (product: Product) => {
    const slug = product.title.toLowerCase().replace(/\s+/g, '-');
    router.push(`/products/${slug}`);
  };

  const scrollToContact = () => {
    window.location.href = '/#contact';
  };

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="pt-24 pb-16">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-blue-50 to-sky-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Our Products
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover our complete range of water level controllers designed for every need - 
                from basic home solutions to advanced commercial systems.
              </p>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                  <div key={product._id} className="bg-white rounded-2xl border border-blue-200/30 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    {/* Product Image */}
                    <div className="aspect-square bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 p-8 relative group cursor-pointer" onClick={() => handleViewProduct(product)}>
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Eye className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      {product.stock < 10 && product.stock > 0 && (
                        <div className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                          Low Stock
                        </div>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                          Out of Stock
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-6 space-y-4">
                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="w-4 h-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">(4.8)</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-foreground line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleViewProduct(product)}>
                        {product.title}
                      </h3>

                      {/* Price */}
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-blue-600">
                          ₹{product.price.toLocaleString()}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground line-clamp-3">
                        {product.description}
                      </p>

                      {/* Categories */}
                      <div className="flex flex-wrap gap-2">
                        {product.categories.slice(0, 3).map((category, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {category}
                          </span>
                        ))}
                      </div>

                      {/* Stock Status */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Stock: {product.stock} units</span>
                        {product.sku && (
                          <span className="text-muted-foreground">SKU: {product.sku}</span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                        <Button
                          size="sm"
                          onClick={() => handleViewProduct(product)}
                          variant="outline"
                          className="w-full border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                            disabled={cartLoading || product.stock === 0}
                            variant="outline"
                            className="flex-1 border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 gap-2 disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                            {cartLoading ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </Button>
                          
                          <Button
                            size="sm"
                            onClick={scrollToContact}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:from-blue-700 hover:to-sky-700 gap-2"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Buy Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-6">
                  <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-2">No Products Available</h3>
                  <p className="text-muted-foreground mb-6">
                    We're currently updating our product catalog. Please check back soon or contact us for availability.
                  </p>
                  <Button onClick={scrollToContact} className="bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:from-blue-700 hover:to-sky-700">
                    Contact Us
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      
      <Footer />
      <MobileActions />
    </main>
  );
}

export default ProductsPage;