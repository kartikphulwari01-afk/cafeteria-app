'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Order } from "@/lib/mockData";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, ChefHat, PackageCheck, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function OrderTracking() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Poll for order status
  useEffect(() => {
    const fetchOrder = async () => {
      const dbOrders = await api.getActiveOrders();
      const myOrder = dbOrders.find(o => o.id === orderId);
      if (myOrder) {
        setOrder(myOrder);
      }
      setIsLoading(false);
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 3000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading order...</div>;
  }

  if (!order) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Order not found</h2>
        <Button onClick={() => router.push('/menu')}>Back to Menu</Button>
      </div>
    );
  }

  const steps = [
    { status: 'placed', label: 'Order Placed', icon: Clock },
    { status: 'preparing', label: 'Preparing', icon: ChefHat },
    { status: 'ready', label: 'Ready for Pickup', icon: PackageCheck },
  ];

  const currentStepIdx = steps.findIndex(s => s.status === order.status);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href="/menu" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Menu
      </Link>

      <div className="glass-panel rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-white/5">
          <div 
            className="h-full bg-primary transition-all duration-1000 ease-out"
            style={{ width: `${((currentStepIdx + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="text-center mb-10">
          <p className="text-muted-foreground text-sm font-medium mb-1">ORDER #{order.id.split('_')[1].toUpperCase()}</p>
          <h1 className="text-3xl font-bold text-white mb-2">Track Your Order</h1>
          <p className="text-primary font-medium">Pickup Time: {order.pickupTime}</p>
        </div>

        <div className="relative mb-12">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-8 right-8 h-1 bg-white/10 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-8 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-1000"
            style={{ width: `calc(${currentStepIdx * 50}% - 2rem)` }}
          />

          <div className="relative flex justify-between z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;

              return (
                <div key={step.status} className="flex flex-col items-center gap-3 w-24">
                  <motion.div 
                    initial={false}
                    animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5 }}
                    className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-colors duration-500 ${
                      isActive 
                        ? 'bg-primary border-primary/30 text-white shadow-[0_0_20px_rgba(255,90,0,0.4)]' 
                        : 'bg-card border-white/10 text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                  <span className={`text-sm font-medium text-center ${isActive ? 'text-white' : 'text-muted-foreground'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
          <h3 className="text-lg font-bold mb-4">Order Details</h3>
          <div className="space-y-3 mb-6">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{item.quantity}x {item.name}</span>
                <span className="font-medium text-white">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-4 flex justify-between items-center">
            <span className="text-muted-foreground">Total</span>
            <span className="text-2xl font-bold text-white">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
