"use client";

import { Building, Users, MapPin, Headphones, Waves, Shield, Award, Droplets } from "lucide-react";

const Trust = () => {
  const trustPoints = [
    {
      icon: Building,
      title: "500+ Installations",
      description: "Trusted by homeowners and builders across India with proven results.",
    },
    {
      icon: Users,
      title: "Electrician Approved",
      description: "Preferred by professionals for easy installation and reliable performance.",
    },
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description: "1-3 year warranty with 24/7 customer support and service.",
    },
    {
      icon: Award,
      title: "Made in India",
      description: "Proudly manufactured in India, designed for Indian conditions and climate.",
    },
  ];

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-blue-600 via-sky-600 to-cyan-600 text-white overflow-hidden">
      {/* Enhanced blue water pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <Waves className="absolute top-10 left-10 w-24 h-24 text-blue-200" />
        <Waves className="absolute bottom-20 right-20 w-32 h-32 text-sky-200" />
        <Waves className="absolute top-1/2 left-1/3 w-20 h-20 text-cyan-200" />
        
        {/* Blue water droplets */}
        <Droplets className="absolute top-1/4 right-1/4 w-8 h-8 text-blue-300" />
        <Droplets className="absolute bottom-1/4 left-1/4 w-6 h-6 text-sky-300" />
        <Droplets className="absolute top-3/4 right-1/2 w-5 h-5 text-cyan-300" />
        
        {/* Blue water flow lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-300/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-300/30 to-transparent"></div>
        
        {/* Blue bubble effects */}
        <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-blue-300/20 rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-sky-300/20 rounded-full"></div>
        <div className="absolute top-2/3 left-3/4 w-5 h-5 bg-cyan-300/20 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white">
            Trusted by Thousands
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg">
            Join the growing community of satisfied customers who trust Shree Flow for their water management needs.
          </p>
        </div>

        {/* Trust Points Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {trustPoints.map((point, index) => (
            <div
              key={index}
              className="text-center p-6 lg:p-8 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-900/20 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-200/20 to-cyan-200/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform border border-blue-200/30">
                <point.icon className="w-8 h-8 text-blue-100" />
              </div>
              <h3 className="text-lg lg:text-xl font-semibold mb-3 text-white">
                {point.title}
              </h3>
              <p className="text-sm text-blue-100 leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        {/* Customer Testimonial with blue theme */}
        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 lg:p-10 max-w-4xl mx-auto relative overflow-hidden">
            {/* Blue water decoration */}
            <div className="absolute top-4 left-4">
              <Droplets className="w-6 h-6 text-blue-200/40" />
            </div>
            <div className="absolute bottom-4 right-4">
              <Droplets className="w-4 h-4 text-sky-200/40" />
            </div>
            
            <blockquote className="text-lg lg:text-xl font-medium mb-4 italic text-white">
              "Installed Shree Flow controller 2 years ago. Never had water overflow since then. Best investment for my home!"
            </blockquote>
            <footer className="text-blue-100 font-medium">
              — Rajesh Kumar, Delhi
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trust;
