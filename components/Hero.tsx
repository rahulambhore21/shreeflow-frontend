"use client";

import { Check, ArrowRight, Droplets, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import WaveDecoration from "./WaveDecoration";

const Hero = () => {
  const router = useRouter();
  
  const benefits = [
    "Automatic motor ON / OFF",
    "Works with overhead & underground tanks",
    "Easy installation · 1-year warranty",
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative pt-24 md:pt-32 pb-16 md:pb-24 bg-gradient-to-b from-blue-50/30 via-background to-sky-50/20 overflow-hidden ">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-sky-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200">
              <Droplets className="w-4 h-4 text-blue-600" />
              Smart Water Management Solution
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight mb-4">
              Never Run Out of <span className="text-transparent bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 bg-clip-text">Water</span> Again
            </h1>
            <h2 className="text-lg md:text-xl lg:text-2xl text-blue-600 font-semibold mb-4">
              Automatic Water Level Control - Save Water, Save Worry
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              Advanced water level controller that automatically manages your water tank, prevents overflow, and ensures continuous water supply.
            </p>

            {/* Benefits with blue accents */}
            <ul className="space-y-3 mb-8 max-w-md mx-auto lg:mx-0">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3 text-left">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-200/40 to-sky-200/30 flex items-center justify-center flex-shrink-0 border border-blue-300/40">
                    <Check className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={() => router.push('/products')}
                className="bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:from-blue-700 hover:to-sky-700 gap-2 shadow-lg shadow-blue-500/30 font-semibold px-8 py-3 relative overflow-hidden group"
              >
                Buy Now - ₹2,999
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("#products")}
                className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 gap-2 font-semibold px-8 py-3"
              >
                <ShoppingCart className="w-4 h-4" />
                View Products
              </Button>
            </div>
          </div>

          {/* Product Image */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative max-w-lg w-full">
              <div className="relative bg-gradient-to-br from-card via-blue-50/20 to-sky-50/20 rounded-2xl p-6 md:p-8 shadow-2xl shadow-blue-500/20 border border-blue-200/30">
                <div className="aspect-square relative">
                  <Image
                    src="/photo1.png"
                    alt="Shree Flow Automatic Water Level Controller - Smart Water Management Device"
                    fill
                    className="object-contain rounded-lg"
                    priority
                  />
                </div>
                {/* Product badge with blue theme */}
                <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-sky-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Best Seller
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced blue wave decoration */}
      <WaveDecoration className="bottom-0" />
    </section>
  );
};

export default Hero;
