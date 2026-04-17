'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Flame } from "lucide-react";
import { api } from "@/lib/api";
import { MenuItem } from "@/lib/mockData";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      const items = await api.getPopularItems();
      setPopularItems(items);
      setIsLoading(false);
    };
    fetchItems();
  }, []);

  return (
    <div className="flex flex-col min-h-full">
      {/* Premium Animated Hero Section */}
      <section className="relative px-4 pt-32 pb-40 overflow-hidden flex flex-col items-center justify-center text-center !bg-transparent">
        
        {/* Animated CSS Coffee Gradient Background */}
        <div className="absolute inset-0 z-[-2] bg-gradient-to-b from-[#050505] to-[#0a0f1a] overflow-hidden">
          {/* Layer 2: Glow & Float Filters */}
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-600 rounded-full blur-[150px] opacity-[0.14] animate-float-slow mix-blend-screen pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-red-600 rounded-full blur-[180px] opacity-[0.10] animate-float-slow pointer-events-none" style={{ animationDelay: '-5s', animationDuration: '12s' }}></div>
          <div className="absolute top-[30%] left-[40%] w-[800px] h-[800px] bg-primary rounded-full blur-[200px] opacity-[0.08] animate-float-slow pointer-events-none" style={{ animationDelay: '-10s', animationDuration: '18s' }}></div>

          {/* Layer 3: Ultra Subtle Food Elements */}
          <div className="absolute top-[10%] left-[5%] text-[24rem] blur-xl opacity-[0.06] grayscale mix-blend-overlay pointer-events-none animate-float-slow select-none leading-none">🍔</div>
          <div className="absolute top-[30%] right-[-5%] text-[28rem] blur-xl opacity-[0.05] grayscale mix-blend-soft-light pointer-events-none animate-float-slow select-none leading-none" style={{ animationDelay: '-8s', animationDuration: '14s' }}>☕</div>
          <div className="absolute bottom-[-15%] left-[25%] text-[30rem] blur-xl opacity-[0.06] grayscale mix-blend-overlay pointer-events-none animate-float-slow select-none leading-none" style={{ animationDelay: '-3s', animationDuration: '20s' }}>🍟</div>

          {/* Grain overlay for premium texture */}
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-primary text-sm font-bold mb-8 shadow-xl">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <span className="tracking-wide">NOW OPEN & SERVING</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] text-white drop-shadow-2xl">
            Premium Fuel <br className="hidden md:block" />
            for <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-red-600 drop-shadow-[0_0_20px_rgba(255,90,0,0.5)]">Your Mind</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Skip the line. Pre-order your favorite high-quality meals and pick them up hot.
          </p>

          <Link href="/menu">
            <Button size="lg" className="rounded-2xl px-10 py-8 text-xl shadow-[0_0_40px_rgba(255,90,0,0.4)] hover:shadow-[0_0_60px_rgba(255,90,0,0.6)] hover:scale-105 transition-all duration-300 font-black">
              Start Your Order <ChevronRight className="w-6 h-6 ml-2" />
            </Button>
          </Link>
          
          {/* Subtle Branding */}
          <div className="mt-16 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity duration-500">
             <span className="text-xs uppercase tracking-[0.3em] font-bold text-white flex items-center gap-3">
               Powered by <span className="text-[#e23737] text-lg font-black tracking-normal">NESCAFÉ</span>
             </span>
          </div>
        </motion.div>
        
        {/* Soft bottom fade to blend with popular items */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0f0f14] to-transparent z-0"></div>
      </section>

      {/* Popular Items Section */}
      <section className="py-20 pb-40 px-4 container mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold flex items-center gap-3">
             Popular Right Now
          </h2>
          <Link href="/menu" className="text-primary hover:text-white transition font-medium flex items-center">
            See all <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {popularItems.map((item, index) => (
              <MenuItemCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
