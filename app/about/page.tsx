import React from 'react'
import Header from "@/components/Header";
import HowItWorks from "@/components/HowItWorks";
import Trust from "@/components/Trust";
import Dealers from "@/components/Dealers";
import Footer from "@/components/Footer";
import MobileActions from "@/components/MobileActions";

function AboutPage() {
  return (
    <main className="min-h-screen overflow-x-hidden w-full bg-gradient-to-b from-white to-gray-50">
      <Header />
      <div className="py-8">
        <section className="container mx-auto px-4 py-8 md:py-16">
          {/* Hero Section */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              About Us
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">
            {/* Introduction */}
            <div className="text-center bg-white p-8 md:p-10 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Shree Flow Company is a trusted name in delivering reliable and innovative water management solutions. 
                With a strong focus on quality, efficiency, and sustainability, we specialize in designing and supplying 
                systems that help control, manage, and optimize water flow for residential, commercial, and industrial applications.
              </p>
            </div>

            {/* Who We Are */}
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-2 h-12 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full mr-4"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Who We Are</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                Founded with the vision of providing practical solutions to real-world water challenges, Shree Flow Company 
                has grown into a dependable partner for customers seeking effective water control systems. Our expertise lies 
                in understanding water behavior and developing solutions that prevent wastage, overflow, and structural damage.
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border-l-4 border-blue-600">
                <p className="text-gray-800 leading-relaxed italic text-lg font-medium">
                  "We believe that efficient water management is the foundation of sustainable development."
                </p>
              </div>
            </div>

            {/* What We Do */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 md:p-10 rounded-2xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-2 h-12 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full mr-4"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">What We Do</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                We deal in a wide range of water solutions, including but not limited to:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-blue-500">
                  <p className="text-gray-800 font-medium">💧 Water Overflow Systems</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-cyan-500">
                  <p className="text-gray-800 font-medium">🚰 Water Tank Overflow Control Solutions</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-blue-500">
                  <p className="text-gray-800 font-medium">🌊 Drainage and Flow Management Systems</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-cyan-500">
                  <p className="text-gray-800 font-medium">⚙️ Customized Water Control Solutions</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-blue-500 md:col-span-2">
                  <p className="text-gray-800 font-medium">🛡️ Water Safety and Protection Systems</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                Our solutions are designed to ensure safe water levels, smooth flow, and long-term durability.
              </p>
            </div>

            {/* Mission & Vision Grid */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {/* Mission */}
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-blue-600">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Our Mission</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Our mission is to deliver high-quality, cost-effective, and reliable water solutions that meet customer needs 
                  while promoting responsible water usage and environmental protection.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-cyan-600">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🚀</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Our Vision</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  To become a leading company in the water solutions industry by continuously improving our products, adopting 
                  innovative technologies, and building long-term relationships with our clients.
                </p>
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-8">
                <div className="w-2 h-12 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full mr-4"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Why Choose Shree Flow Company</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start p-4 rounded-xl hover:bg-blue-50 transition-colors duration-300">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">Expertise in water overflow and flow control systems</span>
                </div>
                <div className="flex items-start p-4 rounded-xl hover:bg-blue-50 transition-colors duration-300">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">Focus on quality and reliability</span>
                </div>
                <div className="flex items-start p-4 rounded-xl hover:bg-blue-50 transition-colors duration-300">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">Customer-centric approach</span>
                </div>
                <div className="flex items-start p-4 rounded-xl hover:bg-blue-50 transition-colors duration-300">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">Practical and sustainable solutions</span>
                </div>
                <div className="flex items-start p-4 rounded-xl hover:bg-blue-50 transition-colors duration-300 md:col-span-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">Timely service and support</span>
                </div>
              </div>
            </div>

            {/* Commitment */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-8 md:p-12 rounded-2xl shadow-xl text-white">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-5xl">🤝</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Commitment</h2>
              </div>
              <p className="text-lg md:text-xl leading-relaxed text-center max-w-3xl mx-auto">
                At Shree Flow Company, we are committed to delivering solutions that ensure safety, efficiency, and peace of mind. 
                Every product and service we offer is guided by our dedication to excellence and customer satisfaction.
              </p>
            </div>
          </div>
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