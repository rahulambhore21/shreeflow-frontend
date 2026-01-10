"use client";

import { Droplets, Zap, Container, Power, Users, Building2, Home } from "lucide-react";
import WaveDecoration from "./WaveDecoration";

const ProductDescription = () => {
  const workingSteps = [
    {
      icon: Droplets,
      title: "Sensors Detect Water Level",
      description: "Sensor probes placed in your tank continuously monitor the water level.",
    },
    {
      icon: Power,
      title: "Motor Turns ON Automatically",
      description: "When water level drops below minimum, the motor starts automatically.",
    },
    {
      icon: Container,
      title: "Tank Fills Up",
      description: "Water fills your overhead or underground tank without any manual effort.",
    },
    {
      icon: Zap,
      title: "Motor Turns OFF When Full",
      description: "Once the tank is full, the motor stops automatically. No overflow, no wastage.",
    },
  ];

  const targetAudience = [
    {
      icon: Home,
      title: "Homeowners",
      description: "Perfect for residential buildings, apartments, and individual homes",
      problems: ["Water overflow wastage", "Manual tank monitoring", "Motor damage from dry running"]
    },
    {
      icon: Building2,
      title: "Commercial Buildings",
      description: "Ideal for offices, hotels, hospitals, and commercial complexes",
      problems: ["High water bills", "Maintenance costs", "Unreliable water supply"]
    },
    {
      icon: Users,
      title: "Electricians & Dealers",
      description: "Easy to install and maintain, building customer trust",
      problems: ["Complex installations", "Customer complaints", "Technical support needs"]
    }
  ];

  const benefits = [
    "Saves 20-30% on electricity bills",
    "Prevents water wastage and overflow",
    "Extends motor life by preventing dry running",
    "Reduces manual monitoring effort",
    "Works in all weather conditions",
    "No maintenance required for years"
  ];

  return (
    <section id="about" className="relative py-16 md:py-24 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <WaveDecoration className="top-0" flip />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-4">
            How Shree Flow Works
          </h2>
          <p className="text-blue-600/80 max-w-2xl mx-auto">
            Simple, reliable water level control that solves real problems for real people.
          </p>
        </div>

        {/* Working Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {workingSteps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line */}
              {index < workingSteps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-400/50 via-cyan-400/50 to-blue-300/30 -translate-x-1/2 z-0"></div>
              )}
              
              <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-200/50 h-full transition-all duration-300 hover:shadow-xl hover:shadow-blue-200/30 hover:-translate-y-1 hover:bg-white/90">
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-lg shadow-blue-400/40">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 via-cyan-50 to-teal-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-blue-200 group-hover:via-cyan-100 group-hover:to-teal-100 transition-all duration-300">
                  <step.icon className="w-6 h-6 text-blue-600 group-hover:text-cyan-600 transition-colors duration-300" />
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-blue-600/70">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Target Audience & Problems Solved */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {targetAudience.map((audience, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-200/50 hover:shadow-xl hover:shadow-blue-200/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                  <audience.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-800">
                  {audience.title}
                </h3>
              </div>
              <p className="text-blue-600/70 mb-4">
                {audience.description}
              </p>
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Problems We Solve:</h4>
                <ul className="space-y-1">
                  {audience.problems.map((problem, pIndex) => (
                    <li key={pIndex} className="text-sm text-blue-600/70 flex items-start gap-2">
                      <span className="text-cyan-500 mt-1">•</span>
                      {problem}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits & Use Cases */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-blue-200/50">
          <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent mb-6 text-center">
            Why Choose Shree Flow?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100/50 hover:from-blue-100 hover:to-cyan-100 hover:border-blue-200/50 transition-all duration-300">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex-shrink-0"></div>
                <span className="text-blue-800 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <WaveDecoration className="bottom-0" />
    </section>
  );
};

export default ProductDescription;
