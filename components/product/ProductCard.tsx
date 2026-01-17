"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ShoppingCart, Eye, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLocalCart } from "@/context/LocalCartContext";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
}

const ProductCard = ({
  id,
  name,
  slug,
  price,
  originalPrice,
  image,
  rating,
  reviews,
  description,
  features,
}: ProductCardProps) => {
  const { addToCart, isLoading } = useLocalCart();
  const router = useRouter();

  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAddToCart = async () => {
    await addToCart({
      productId: id.toString(),
      title: name,
      price: price,
      image: image,
      stock: 100 // Default stock value for ProductCard
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-blue-200/30 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Product Image */}
      <div className="aspect-square bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 p-8 relative group">
        <Link href={`/products/${slug}`}>
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-105 cursor-pointer"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Link>
        
        {originalPrice && originalPrice > price && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
            {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
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
                className={`w-4 h-4 ${star <= Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({reviews})</span>
        </div>

        {/* Title */}
        <Link href={`/products/${slug}`}>
          <h3 className="text-xl font-bold text-foreground hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
            {name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-blue-600">
            ₹{price.toLocaleString()}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-lg text-muted-foreground line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-muted-foreground line-clamp-2">
          {description}
        </p>

        {/* Key Features */}
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground text-sm">Key Features:</h4>
          <ul className="space-y-1">
            {features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-blue-600 mt-0.5 shrink-0">✓</span>
                <span className="line-clamp-1">{feature}</span>
              </li>
            ))}
            {features.length > 3 && (
              <li className="text-sm text-blue-600 font-medium">
                +{features.length - 3} more features
              </li>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
          <Link href={`/products/${slug}`}>
            <Button
              size="lg"
              variant="outline"
              className="w-full border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 gap-2 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Eye className="w-4 h-4" />
              View Details
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          
          <div className="flex gap-2">
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={isLoading}
              variant="outline"
              className="flex-1 border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 gap-2 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              {isLoading ? 'Adding...' : 'Add to Cart'}
            </Button>
            
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:from-blue-700 hover:to-sky-700 gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              {isLoading ? 'Adding...' : 'Buy Now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;