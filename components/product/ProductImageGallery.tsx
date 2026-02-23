"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // If no images provided, return null
  if (!images || images.length === 0) {
    return null;
  }

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3 md:space-y-4 w-full max-w-full">
      {/* Main Image */}
      <div className="aspect-square bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 rounded-xl md:rounded-2xl overflow-hidden p-6 md:p-10 border border-blue-200/50 relative shadow-lg group">
        <Image
          src={images[selectedImageIndex]}
          alt={`${productName} - Image ${selectedImageIndex + 1}`}
          fill
          className="object-contain"
          priority
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {selectedImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 md:gap-3">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedImageIndex === index
                  ? 'border-blue-600 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
            >
              <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-sky-50 p-2">
                <Image
                  src={img}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
