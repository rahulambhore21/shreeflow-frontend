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
import FeaturedArticles from "@/components/articles/FeaturedArticles";
import "./globals.css";


function page() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Products />
      <ProductDescription />
      <Trust />
      <div className="container mx-auto px-4 py-16">
        <FeaturedArticles limit={3} />
      </div>
      <Dealers />
      <Contact />
      <Footer />
      <MobileActions />
    </main>
  );
}

export default page