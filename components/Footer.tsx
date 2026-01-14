"use client";

import { Phone, Mail, MapPin } from "lucide-react";

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
    <footer className="bg-gradient-to-b from-foreground to-foreground/95 text-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-background to-background/80 rounded-lg flex items-center justify-center">
                <span className="text-foreground font-bold text-lg">SF</span>
              </div>
              <span className="text-xl font-semibold text-background">
                Shree Flow
              </span>
            </div>
            <p className="text-background/70 mb-4 max-w-md">
              Shree Flow manufactures reliable automatic water level controllers for overhead and underground water tanks. Trusted by homeowners and electricians across India.
            </p>
            <p className="text-sm text-background/50">
              🇮🇳 Proudly Made in India
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-background mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-background/70 hover:text-background transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-background mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-background/70 mt-0.5 flex-shrink-0" />
                <a href="tel:+919876543210" className="text-background/70 hover:text-background transition-colors text-sm">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-background/70 mt-0.5 flex-shrink-0" />
                <a href="mailto:sales@shreeflow.com" className="text-background/70 hover:text-background transition-colors text-sm">
                  sales@shreeflow.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-background/70 mt-0.5 flex-shrink-0" />
                <span className="text-background/70 text-sm">
                  Industrial Area, Sector 5,<br />
                  New Delhi, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 mt-12 pt-8 text-center">
          <p className="text-background/50 text-sm">
            © {new Date().getFullYear()} Shree Flow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
