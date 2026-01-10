"use client";

import { useState, useEffect } from "react";
import { Menu, X, Phone, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const handleNavigation = (href: string) => {
    // Check if it's a section ID (starts with #) or a route
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to the route
      router.push(href);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border/50"
          : "bg-gradient-to-r from-background via-background to-background/95"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo & Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 group transition-transform hover:scale-105 duration-300"
            aria-label="Shree Flow - Home"
          >
            <div className="relative">
              <Image
                src="/logo.png"
                alt="Shree Flow Logo"
                width={96}
                height={96}
                className="w-16 h-16 md:w-20 md:h-20 object-contain transition-transform group-hover:rotate-6 duration-300"
                priority
              />
              <div className="absolute inset-0 bg-primary/10 rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-foreground tracking-tight">
                Shree Flow
              </span>
              <span className="text-xs md:text-sm text-muted-foreground font-medium">
                Premium Water Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-1 lg:gap-2"
            role="navigation"
          >
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.href)}
                className="relative px-4 py-2 text-sm lg:text-base font-medium text-muted-foreground hover:text-foreground transition-all duration-300 group rounded-lg hover:bg-secondary/50"
                aria-label={`Navigate to ${item.label}`}
              >
                <span className="relative z-10">{item.label}</span>
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary group-hover:w-full group-hover:left-0 transition-all duration-300" />
              </button>
            ))}
          </nav>

          {/* CTA Section */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link
              href="tel:+919876543210"
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-300 rounded-lg hover:bg-secondary/50 group"
              aria-label="Call us at +91 98765 43210"
            >
              <Phone className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-medium">+91 98765 43210</span>
            </Link>
            <Button
              onClick={() => handleNavigation("/contact")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 font-medium px-6 py-2 group"
              aria-label="Buy Now - Contact us"
            >
              <span>Buy Now</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <div className="relative w-6 h-6">
              <Menu
                className={`absolute inset-0 w-6 h-6 text-foreground transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                }`}
              />
              <X
                className={`absolute inset-0 w-6 h-6 text-foreground transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-background/98 backdrop-blur-sm border-t border-border/50">
          <nav className="container mx-auto px-4 py-6 space-y-2" role="navigation">
            {navItems.map((item, index) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.href)}
                className="flex items-center justify-between py-3 px-4 text-foreground hover:bg-secondary rounded-lg transition-all duration-300 group w-full text-left"
                style={{ animationDelay: `${index * 50}ms` }}
                aria-label={`Navigate to ${item.label}`}
              >
                <span className="font-medium">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300" />
              </button>
            ))}

            <div className="pt-4 mt-4 border-t border-border/50 space-y-3">
              <Link
                href="tel:+919876543210"
                className="flex items-center gap-3 py-3 px-4 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-all duration-300"
                aria-label="Call us at +91 98765 43210"
              >
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </Link>

              <Button
                onClick={() => handleNavigation("/contact")}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg font-medium py-3 group"
                aria-label="Buy Now - Contact us"
              >
                <span>Buy Now</span>
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
