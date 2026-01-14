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
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-card/95 backdrop-blur-md border-t border-primary/10 shadow-lg shadow-primary/10 z-50 safe-area-inset-bottom">
      <div className="grid grid-cols-2">
        <button
          onClick={handleCartClick}
          className="flex items-center justify-center gap-2 py-4 px-4 text-foreground hover:bg-primary/5 transition-colors active:bg-primary/10 relative"
        >
          <ShoppingCart className="w-5 h-5 text-primary" />
          {cart.itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cart.itemCount}
            </span>
          )}
          <span className="font-semibold text-sm">Cart</span>
        </button>
        
        <button
          onClick={scrollToContact}
          className="flex items-center justify-center gap-2 py-4 px-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors active:bg-primary/80"
        >
          <Phone className="w-5 h-5" />
          <span className="font-semibold text-sm">Call Now</span>
        </button>
      </div>
    </div>
  );
};

export default MobileActions;
