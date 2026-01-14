import React from 'react'
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import HowItWorks from "@/components/HowItWorks";
import ProductDescription from "@/components/ProductDescription";
import Trust from "@/components/Trust";
import Dealers from "@/components/Dealers";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MobileActions from "@/components/MobileActions";
import "./globals.css";


function page() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Products />
      <HowItWorks />
      <ProductDescription />
      <Trust />
      <Dealers />
      <Contact />
      <Footer />
      <MobileActions />
    </main>
  );
}

export default page