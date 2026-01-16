"use client";

import { Phone, ShoppingCart } from "lucide-react";
import { useLocalCart } from "@/context/LocalCartContext";
import { useRouter } from "next/navigation";

const MobileActions = () => {
  const { cart } = useLocalCart();
  const router = useRouter();

  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCartClick = () => {
    router.push('/cart');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-gradient-to-r from-blue-600 to-sky-600 shadow-lg shadow-blue-500/50 z-50 safe-area-inset-bottom">
      <div className="grid grid-cols-2">
        <button
          onClick={handleCartClick}
          className="flex items-center justify-center gap-2 py-4 px-4 text-white hover:bg-white/10 transition-colors active:bg-white/20 relative"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cart.itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-md">
                {cart.itemCount}
              </span>
            )}
          </div>
          <span className="font-semibold text-sm">Cart</span>
        </button>
        
        <button
          onClick={scrollToContact}
          className="flex items-center justify-center gap-2 py-4 px-4 text-white hover:bg-white/10 transition-colors active:bg-white/20 border-l border-white/20"
        >
          <Phone className="w-5 h-5" />
          <span className="font-semibold text-sm">Call Now</span>
        </button>
      </div>
    </div>
  );
};

export default MobileActions;
