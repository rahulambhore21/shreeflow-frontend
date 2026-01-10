"use client";

import { Phone, Mail, MapPin, Droplets, Waves, Shield, Zap } from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "Products", href: "#products" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Dealers", href: "#dealers" },
    { label: "Contact", href: "#contact" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950 text-white overflow-hidden">
      {/* Animated Water Wave Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-cyan-400/20 animate-pulse">
          <svg
            className="w-full h-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60 C200,20 400,100 600,60 C800,20 1000,100 1200,60 L1200,120 L0,120 Z"
              fill="currentColor"
              className="text-cyan-400/30 animate-bounce"
            ></path>
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10">
          <svg
            className="w-full h-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60 C300,80 600,40 900,60 C1000,70 1100,50 1200,60 L1200,0 L0,0 Z"
              fill="currentColor"
              className="text-blue-400/20"
            ></path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Droplets className="w-6 h-6 text-white animate-pulse" />
                <div className="absolute inset-0 bg-cyan-400/30 rounded-full animate-ping"></div>
              </div>
              <div>
                <span className="text-2xl font-bold text-white tracking-tight">
                  Shree Flow
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <Waves className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-cyan-200">Water Solutions</span>
                </div>
              </div>
            </div>
            <p className="text-blue-100/80 mb-6 max-w-md leading-relaxed">
              Shree Flow manufactures reliable automatic water level controllers
              for overhead and underground water tanks.
              <span className="text-cyan-300 font-medium">
                {" "}
                Trusted by homeowners and electricians across India.
              </span>
            </p>

            {/* Water-themed features */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2 bg-blue-800/50 px-3 py-1 rounded-full">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-blue-100">Waterproof</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-800/50 px-3 py-1 rounded-full">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-blue-100">Auto Control</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-800/50 px-3 py-1 rounded-full">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-blue-100">Pure Flow</span>
              </div>
            </div>

            <p className="text-sm text-cyan-300 flex items-center gap-2">
              <span>🇮🇳</span>
              <span className="font-medium">Proudly Made in India</span>
              <Waves className="w-4 h-4 animate-pulse" />
            </p>
          </div>

          {/* Quick Links */}
          <div className="relative">
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-cyan-400/20 rounded-full animate-ping"></div>
            <h4 className="font-semibold text-white mb-6 flex items-center gap-2">
              <Waves className="w-5 h-5 text-cyan-400" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li
                  key={link.label}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="group flex items-center gap-2 text-blue-100/70 hover:text-cyan-300 transition-all duration-300 text-sm py-1"
                  >
                    <div className="w-1 h-1 bg-cyan-400 rounded-full group-hover:w-2 transition-all duration-300"></div>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="relative">
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500/30 rounded-full animate-pulse"></div>
            <h4 className="font-semibold text-white mb-6 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-cyan-400" />
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 bg-blue-800/50 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors duration-300">
                  <Phone className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <a
                  href="tel:+919876543210"
                  className="text-blue-100/80 hover:text-cyan-300 transition-colors text-sm pt-1"
                >
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 bg-blue-800/50 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors duration-300">
                  <Mail className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <a
                  href="mailto:sales@shreeflow.com"
                  className="text-blue-100/80 hover:text-cyan-300 transition-colors text-sm pt-1"
                >
                  sales@shreeflow.com
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 bg-blue-800/50 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors duration-300">
                  <MapPin className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-blue-100/80 text-sm pt-1">
                  Industrial Area, Sector 5,
                  <br />
                  New Delhi, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative border-t border-cyan-400/20 mt-12 pt-8">
          {/* Flowing water animation */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse"></div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Waves className="w-4 h-4 text-cyan-400 animate-bounce" />
              <span className="text-cyan-300 font-medium text-sm">
                Flow with Quality
              </span>
              <Waves
                className="w-4 h-4 text-cyan-400 animate-bounce"
                style={{ animationDelay: "0.5s" }}
              />
            </div>
            <p className="text-blue-200/60 text-sm">
              © {new Date().getFullYear()} Shree Flow. All rights reserved.
              <span className="mx-2">•</span>
              <span className="text-cyan-300">
                Flowing Since Excellence
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Floating water droplets */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-cyan-400/30 rounded-full animate-ping"></div>
      <div
        className="absolute top-32 right-20 w-3 h-3 bg-blue-400/20 rounded-full animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-20 left-1/4 w-1 h-1 bg-cyan-300/40 rounded-full animate-bounce"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-32 right-1/3 w-2 h-2 bg-blue-300/30 rounded-full animate-pulse"
        style={{ animationDelay: "1.5s" }}
      ></div>
    </footer>
  );
};

export default Footer;
