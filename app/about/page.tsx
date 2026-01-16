import React from 'react'
import Header from "@/components/Header";
import HowItWorks from "@/components/HowItWorks";
import Trust from "@/components/Trust";
import Dealers from "@/components/Dealers";
import Footer from "@/components/Footer";
import MobileActions from "@/components/MobileActions";

function AboutPage() {
  return (
    <main className="min-h-screen overflow-x-hidden w-full">
      <Header />
      <div className="py-8">
        <section className="container mx-auto px-4 py-8 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8">About Us</h1>
          <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Learn more about our company, our mission, and how we work to provide the best solutions for you.
          </p>
        </section>
        <HowItWorks />
        <Trust />
        <Dealers />
      </div>
      <Footer />
      <MobileActions />
    </main>
  );
}

export default AboutPage;