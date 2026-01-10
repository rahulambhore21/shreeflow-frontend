import React from 'react'
import Header from "@/components/Header";
import Products from "@/components/Products";
import ProductDescription from "@/components/ProductDescription";
import Footer from "@/components/Footer";
import MobileActions from "@/components/MobileActions";

function ProductsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="py-8">
        <Products />
        <ProductDescription />
      </div>
      <Footer />
      <MobileActions />
    </main>
  );
}

export default ProductsPage;