'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { usePathname } from 'next/navigation';

export function CartBar() {
  const { totalItems, totalPrice, setDrawerOpen } = useCartStore();
  const itemsCount = totalItems();
  const pathname = usePathname();

  if (pathname.startsWith('/checkout') || pathname.startsWith('/orders')) {
    return null;
  }

  return (
    <AnimatePresence>
      {itemsCount > 0 && (
        <motion.div 
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 150, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] sm:w-96 z-[60]"
        >
          <button 
            onClick={() => setDrawerOpen(true)}
            className="w-full bg-gradient-to-r from-primary to-orange-500 rounded-2xl p-4 flex items-center justify-between shadow-[0_10px_40px_rgba(255,90,0,0.5)] border border-white/20 group hover:brightness-110 transition-all duration-300"
          >
            <div className="flex flex-col text-left text-white">
              <span className="text-sm font-bold uppercase tracking-wider">{itemsCount} item{itemsCount !== 1 ? 's' : ''} added</span>
              <span className="text-xl font-black">₹{totalPrice().toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-white bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md group-hover:bg-white/30 transition">
              View Cart <ShoppingBag className="w-5 h-5 ml-1" />
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
