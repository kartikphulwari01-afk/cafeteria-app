import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

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
      <body
        className={`${inter.className} min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-white pb-20 sm:pb-0 font-sans`}
      >
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-background to-background"></div>
        <Navbar />
        <main className="pt-16 min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </body>
    </html>
  );
}
