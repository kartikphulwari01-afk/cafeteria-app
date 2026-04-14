import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Navbar } from "@/components/layout/Navbar";
import { CartBar } from "@/components/ui/CartBar";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { OrderNotifier } from "@/components/ui/OrderNotifier";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Premium Cafeteria | Order Now",
  description: "Modern, fast, and premium cafeteria ordering experience.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" crossOrigin="use-credentials" />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-white pb-20 sm:pb-0 font-sans`}
      >
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-background to-background"></div>
        <ToastContainer />
        <OrderNotifier />
        <Navbar />
        <main className="pt-16 min-h-[calc(100vh-64px)]">
          {children}
        </main>
        <CartBar />
        <Script
          id="razorpay-checkout"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
