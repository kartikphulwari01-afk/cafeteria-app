'use client';

import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';
import { Receipt, Search, Clock, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { Order } from '@/lib/mockData';
import Link from 'next/link';

export default function MyOrdersPage() {
  const { user } = useUserStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    const fetchOrders = async () => {
      try {
        const userOrders = await api.getUserOrders(user.uid);
        // Sort orders by newest first
        userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(userOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();

  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-12 px-4 max-w-4xl mx-auto flex justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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
          <h3 className="text-xl font-bold text-white mb-2">No past orders found</h3>
          <p className="text-muted-foreground mb-6">You haven't placed any orders with us yet.</p>
          <Link href="/menu" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(255,90,0,0.3)]">
            Browse Menu <ArrowRight className="w-4 h-4" />
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
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-sm font-medium text-white/60">ID: {order.id.toUpperCase()}</span>
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

                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                  {order.items.map((item, idx) => (
                    <span key={idx} className="bg-black/50 text-sm border border-white/10 px-3 py-1.5 rounded-lg text-white">
                      {item.quantity}x {item.name}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
