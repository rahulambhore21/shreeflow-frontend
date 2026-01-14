import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LocalCartProvider } from "@/context/LocalCartContext";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shree Flow - Water Level Controllers",
  description: "Automatic water level controllers for homes and businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent MetaMask auto-connection attempts
              if (typeof window !== 'undefined') {
                window.addEventListener('load', function() {
                  if (window.ethereum && window.ethereum.isMetaMask) {
                    // Disable automatic connection
                    window.ethereum.autoRefreshOnNetworkChange = false;
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <LocalCartProvider>
            {children}
            <Toaster />
          </LocalCartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
