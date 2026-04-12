'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from './Button';
import { useSystemStore } from '@/store/systemStore';
import { useRouter } from 'next/navigation';

export const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const { isOpen: isCafeteriaOpen } = useSystemStore();
  const router = useRouter();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-sm glass-panel border-l border-white/10 shadow-2xl flex flex-col bg-[#0f0f14]"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Your Order
              </h2>
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full w-10 h-10 p-0 text-white hover:bg-white/10">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-60">
                  <ShoppingBag className="w-16 h-16 mb-4" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-muted" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1 text-white">{item.name}</h4>
                      <div className="text-primary font-bold text-sm mb-2">₹{item.price.toFixed(2)}</div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                          className="w-6 h-6 rounded bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-4 text-center text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/40 space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground font-medium">Subtotal</span>
                  <span className="text-2xl font-bold text-white">₹{totalPrice().toFixed(2)}</span>
                </div>
                
                <Button 
                  className="w-full shadow-[0_0_15px_rgba(255,90,0,0.3)]" 
                  size="lg" 
                  onClick={() => {
                    onClose();
                    router.push('/checkout');
                  }}
                  disabled={!isCafeteriaOpen}
                >
                  {isCafeteriaOpen ? 'Proceed to Checkout' : 'Cafeteria Closed'}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
