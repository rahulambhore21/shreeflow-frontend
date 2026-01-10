"use client";

import { Droplets, Zap, Container, Power } from "lucide-react";
import WaveDecoration from "./WaveDecoration";

const HowItWorks = () => {
  const steps = [
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

  return (
    <section id="how-it-works" className="relative py-20 md:py-32 bg-blue-50/30 water-pattern overflow-hidden">
      <WaveDecoration className="top-0" flip />
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg md:text-xl">
            Simple, reliable water level control in four easy steps. No complicated setup required.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-400/30 to-cyan-300/20 -translate-x-1/2 z-0"></div>
              )}
              
              <div className="relative bg-card rounded-2xl p-8 shadow-lg border border-blue-200/20 h-full">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg shadow-blue-500/30">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-200/30">
                  <step.icon className="w-8 h-8 text-blue-600" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <WaveDecoration className="bottom-0" />
    </section>
  );
};

export default HowItWorks;
