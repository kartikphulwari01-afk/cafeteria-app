'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import { Receipt, Search, Clock, ArrowRight, RefreshCcw } from 'lucide-react';
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useOrderStore } from '@/store/orderStore';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';


interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: any;
  items: any[];
  paymentMethod?: string;
  paymentStatus?: string;
}

export default function MyOrdersPage() {
  const { user } = useUserStore();
  const router = useRouter();
  const { orders, updatedOrderIds } = useOrderStore();
  const { clearCart, addItem, setDrawerOpen } = useCartStore();
  const { addToast } = useToastStore();
  const [isLoading, setIsLoading] = useState(true);

  const handleReorder = (e: React.MouseEvent, items: any[]) => {
    e.preventDefault();
    e.stopPropagation();
    
    clearCart();
    items.forEach(item => {
      addItem({
        id: item.id || item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600'
      });
    });
    
    addToast('Items added to cart 🛒', 'success');
    setDrawerOpen(true);
  };

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    // Fallback if OrderNotifier fails or loads slow initially
    if (orders.length > 0) {
      setIsLoading(false);
    } else {
      setTimeout(() => setIsLoading(false), 800);
    }
  }, [user, router, orders]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-12 px-4 max-w-4xl mx-auto flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/5 skeleton"></div>
          <div className="space-y-2">
            <div className="h-6 w-48 bg-white/5 rounded skeleton"></div>
            <div className="h-4 w-64 bg-white/5 rounded skeleton"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
             <div key={i} className="bg-[#15151a] border border-white/5 rounded-2xl p-6 skeleton">
               <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
                 <div className="space-y-2 w-full">
                   <div className="h-3 w-20 bg-white/10 rounded"></div>
                   <div className="h-4 w-32 bg-white/5 rounded"></div>
                 </div>
                 <div className="space-y-2 sm:items-end flex flex-col w-full">
                   <div className="h-6 w-16 bg-white/10 rounded"></div>
                   <div className="h-4 w-24 bg-white/5 rounded"></div>
                 </div>
               </div>
               <div className="flex gap-2 pt-4 border-t border-white/5">
                 <div className="h-7 w-24 bg-white/5 rounded-lg"></div>
                 <div className="h-7 w-32 bg-white/5 rounded-lg"></div>
               </div>
             </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
          <Receipt className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">Order History</h1>
          <p className="text-muted-foreground">View your past purchases and track active items.</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-[#15151a] rounded-3xl border border-white/10">
          <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No orders yet 😢</h3>
          <p className="text-muted-foreground mb-6">You haven't placed any orders with us yet. Start exploring!</p>
          <Link href="/menu" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(255,90,0,0.3)]">
            Explore Menu <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link href={`/orders/${order.id}`} key={order.id} className="block group">
              <div className="bg-[#15151a] border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold block mb-1">
                      {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : new Date(order.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white/60">ID: {order.id.slice(-6).toUpperCase()}</span>
                      {updatedOrderIds.includes(order.id) && (
                        <span className="bg-blue-500/20 text-blue-400 border border-blue-500/50 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(59,130,246,0.3)] animate-pulse">
                          UPDATED
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black text-white">₹{order.totalAmount.toFixed(2)}</span>
                      <span className={`px-3 py-1 text-xs font-bold rounded-lg ${
                        order.status === 'ready' ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    {/* Payment Indicators */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white/50 bg-white/5 px-2 py-0.5 rounded uppercase tracking-wide">
                        {order.paymentMethod}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-[2px] rounded ${
                        order.paymentStatus === 'Paid' ? 'text-green-400 bg-green-500/10' : 'text-orange-400 bg-orange-500/10'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-white/5 mt-4">
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, idx) => (
                      <span key={idx} className="bg-black/50 text-sm border border-white/10 px-3 py-1.5 rounded-lg text-white">
                        {item.quantity}x {item.name}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={(e) => handleReorder(e, order.items)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-primary/20 hover:text-primary transition-colors rounded-xl text-sm font-bold border border-white/5 hover:border-primary/50 text-white w-full sm:w-auto justify-center"
                  >
                    <RefreshCcw className="w-4 h-4" /> Order Again
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
