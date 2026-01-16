import React from 'react'
import Header from "@/components/Header";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MobileActions from "@/components/MobileActions";

function ContactPage() {
  return (
    <main className="min-h-screen overflow-x-hidden w-full">
      <Header />
      <div className="py-8">
        <section className="container mx-auto px-4 py-8 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8">Contact Us</h1>
          <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Get in touch with us for any questions, support, or business inquiries.
          </p>
        </section>
        <Contact />
      </div>
      <Footer />
      <MobileActions />
    </main>
  );
}

export default ContactPage;