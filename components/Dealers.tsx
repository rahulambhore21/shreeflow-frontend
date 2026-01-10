'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Store, TrendingUp, Wrench, HeadphonesIcon, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dealers = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    shopName: "",
    phone: "",
    city: "",
    message: "",
  });

  const benefits = [
    {
      icon: TrendingUp,
      title: "Good Resale Value",
      description: "Quality products that customers trust and recommend.",
    },
    {
      icon: Wrench,
      title: "Easy Installation",
      description: "Simple installation process means faster service.",
    },
    {
      icon: Store,
      title: "Reliable Performance",
      description: "Minimal returns and complaints build your reputation.",
    },
    {
      icon: HeadphonesIcon,
      title: "Support Available",
      description: "Technical and sales support whenever you need it.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Enquiry Submitted",
      description: "Thank you! Our team will contact you within 24 hours.",
    });
    setFormData({ name: "", shopName: "", phone: "", city: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="dealers" className="py-20 md:py-32 bg-cyan-50/40">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          {/* Left - Benefits */}
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Become a Dealer
            </h2>
            <p className="text-muted-foreground mb-12 text-lg md:text-xl leading-relaxed">
              Join our network of dealers and distributors across India. Partner with a brand that your customers will trust.
            </p>

            <div className="grid gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-5 p-6 bg-white/60 rounded-xl border border-blue-200/30 shadow-sm">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-200/30">
                    <benefit.icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2 text-lg">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-background rounded-2xl p-8 md:p-10 shadow-xl border border-blue-200/30">
            <h3 className="text-2xl font-bold text-foreground mb-8">
              Dealer Enquiry Form
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                    Your Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    className="bg-background border-blue-200 h-12 text-base"
                  />
                </div>
                <div>
                  <label htmlFor="shopName" className="block text-sm font-semibold text-foreground mb-2">
                    Shop / Business Name
                  </label>
                  <Input
                    id="shopName"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleChange}
                    placeholder="Enter shop name"
                    className="bg-background border-blue-200 h-12 text-base"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2">
                    Phone Number *
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 98765 43210"
                    className="bg-background border-blue-200 h-12 text-base"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-foreground mb-2">
                    City *
                  </label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="Enter your city"
                    className="bg-background border-blue-200 h-12 text-base"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
                  Message (Optional)
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Any specific requirements or questions?"
                  rows={4}
                  className="bg-background border-blue-200 resize-none text-base"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 gap-3 h-14 text-lg font-semibold shadow-lg shadow-blue-500/25"
              >
                Submit Enquiry
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dealers;
