"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, Phone, Droplets } from "lucide-react";
import Link from "next/link";
import { useLocalCart } from "@/context/LocalCartContext";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cart } = useLocalCart();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    // Add admin link - you can add authentication check here
    ...(typeof window !== 'undefined' && window.location.search.includes('admin=true') ? 
      [{ label: "Admin", href: "/admin" }] : [])
  ];

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== "/") {
      router.push(`/#${sectionId}`);
      return;
    }

    const element = document.querySelector(`#${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const handleCartClick = () => {
    router.push('/cart');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b"
          : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-sky-600 rounded-xl flex items-center justify-center shadow-lg">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
              Shree Flow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-foreground hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCartClick}
              className="relative gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Cart
              {cart.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.itemCount}
                </span>
              )}
            </Button>

            <Button
              onClick={() => scrollToSection("contact")}
              className="bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:from-blue-700 hover:to-sky-700"
            >
              <Phone className="w-4 h-4 mr-2" />
              Contact Us
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur-md">
            <nav className="py-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-md"
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="border-t pt-4 px-4 space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCartClick}
                  className="w-full justify-start gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Cart
                  {cart.itemCount > 0 && (
                    <span className="ml-auto bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cart.itemCount}
                    </span>
                  )}
                </Button>

                <Button
                  onClick={() => {
                    scrollToSection("contact");
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-start gap-2 bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:from-blue-700 hover:to-sky-700"
                >
                  <Phone className="w-4 h-4" />
                  Contact Us
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
