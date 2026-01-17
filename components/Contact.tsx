'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "7419346490 / 9599268300",
      href: "tel:+917419346490",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "7419346490 / 9599268300",
      href: "https://wa.me/917419346490",
    },
    {
      icon: Mail,
      label: "Email",
      value: "tanwarblossomenterprses2024@gmail.com",
      href: "mailto:sales@shreeflow.com",
    },
    {
      icon: MapPin,
      label: "Address",
      value: "1153/a sector 4,7 chowk new railway road Dayanand colony Gurugram 122001",
      href: null,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We'll get back to you soon!",
    });
    setFormData({ name: "", phone: "", email: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-20 md:py-32 bg-gradient-to-b from-background to-blue-50/30 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6 break-words">
            Get in Touch
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-base md:text-lg lg:text-xl px-4">
            Have questions about our products? Need a quote? We're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-20">
          {/* Contact Info */}
          <div className="w-full max-w-full overflow-hidden">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6 md:mb-8">
              Contact Information
            </h3>

            <div className="space-y-6 md:space-y-8">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex gap-3 md:gap-5 p-4 md:p-6 bg-white/60 rounded-xl border border-blue-200/30 shadow-sm overflow-hidden">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-200/30">
                    <info.icon className="w-5 h-5 md:w-7 md:h-7 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs md:text-sm text-muted-foreground mb-1 font-medium">{info.label}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-foreground font-semibold text-sm md:text-base lg:text-lg hover:text-blue-600 transition-colors break-words block"
                        target={info.href.startsWith("http") ? "_blank" : undefined}
                        rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-foreground font-semibold text-sm md:text-base lg:text-lg break-words">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Working Hours */}
            <div className="mt-8 md:mt-10 p-6 md:p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200/30 shadow-sm">
              <h4 className="font-bold text-foreground mb-3 md:mb-4 text-base md:text-lg">Working Hours</h4>
              <p className="text-sm md:text-base text-muted-foreground">
                Monday – Saturday: 9:00 AM – 6:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card rounded-2xl p-6 md:p-8 lg:p-10 shadow-xl border border-blue-200/30 w-full max-w-full overflow-hidden">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6 md:mb-8 break-words">
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-semibold text-foreground mb-2">
                  Your Name *
                </label>
                <Input
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                  className="bg-background border-blue-200 h-12 text-base"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-semibold text-foreground mb-2">
                    Phone Number *
                  </label>
                  <Input
                    id="contact-phone"
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
                  <label htmlFor="contact-email" className="block text-sm font-semibold text-foreground mb-2">
                    Email (Optional)
                  </label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="bg-background border-blue-200 h-12 text-base"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-semibold text-foreground mb-2">
                  Message *
                </label>
                <Textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us about your requirements..."
                  rows={5}
                  className="bg-background border-blue-200 resize-none text-base"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 gap-3 h-14 text-lg font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Send Message
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
