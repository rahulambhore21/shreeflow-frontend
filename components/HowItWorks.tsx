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
    <section id="how-it-works" className="relative py-16 md:py-24 bg-primary/5 water-pattern overflow-hidden">
      <WaveDecoration className="top-0" flip />
      
      {/* Floating water elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Droplets className="absolute top-20 left-10 w-6 h-6 text-blue-400/20 animate-[water-drop_4s_ease-in-out_infinite]" />
        <Droplets className="absolute bottom-32 right-20 w-5 h-5 text-sky-400/20 animate-[water-drop_5s_ease-in-out_infinite]" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-blue-400/15 rounded-full animate-[bubble-float_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-cyan-400/15 rounded-full animate-[bubble-float_4s_ease-in-out_infinite]" style={{ animationDelay: "3s" }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple, reliable water level control in four easy steps. No complicated setup required.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-primary/10 -translate-x-1/2 z-0"></div>
              )}
              
              <div className="relative bg-card rounded-xl p-6 shadow-md border border-primary/10 h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold shadow-lg shadow-primary/30">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-primary/15 to-primary/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-6 h-6 text-primary animate-[wave-float_3s_ease-in-out_infinite]" style={{ animationDelay: `${index * 0.5}s` }} />
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
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
