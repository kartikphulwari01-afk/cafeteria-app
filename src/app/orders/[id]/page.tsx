'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, ChefHat, PackageCheck, ChevronLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Client-safe Smart Timer
const SmartTimer = ({ status, createdAt }: { status: string; createdAt: any }) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (status === 'ready' || status === 'completed') {
      setTimeLeft(0);
      return;
    }

    const orderTime = createdAt?.toDate ? createdAt.toDate().getTime() : new Date(createdAt || Date.now()).getTime();
    const readyTime = orderTime + 15 * 60 * 1000; // Assume 15 minutes prep time

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((readyTime - now) / 1000));
      setTimeLeft(diff);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [status, createdAt]);

  if (timeLeft === null) return <div className="h-6 w-24 bg-white/5 rounded skeleton inline-block"></div>;
  if (timeLeft === 0) return <span className="text-green-400 font-bold">Ready!</span>;
  
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  return <span className="text-primary font-bold">Ready in {m}:{s.toString().padStart(2, '0')}</span>;
};

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: any;
  items: any[];
  pickupTime?: string;
}

export default function OrderTracking() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Poll for order status
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const docRef = doc(db, "orders", orderId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
        } else {
          setOrder(null);
        }
      } catch (error) {
        console.error("Failed to fetch order details", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 3000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="h-5 w-28 bg-white/5 rounded skeleton mb-8"></div>
        <div className="glass-panel rounded-3xl p-8 border border-white/5 shadow-2xl">
          <div className="text-center mb-10 space-y-3">
            <div className="h-3 w-24 bg-white/10 rounded skeleton mx-auto"></div>
            <div className="h-8 w-48 bg-white/10 rounded skeleton mx-auto"></div>
            <div className="h-4 w-32 bg-white/5 rounded skeleton mx-auto"></div>
          </div>
          <div className="flex justify-between mb-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-white/5 skeleton"></div>
                <div className="h-3 w-16 bg-white/5 rounded skeleton"></div>
              </div>
            ))}
          </div>
          <div className="bg-white/5 rounded-2xl p-6 space-y-4">
            <div className="h-5 w-28 bg-white/10 rounded skeleton"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-36 bg-white/5 rounded skeleton"></div>
                <div className="h-4 w-16 bg-white/5 rounded skeleton"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link href="/orders" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition">
          <ChevronLeft className="w-4 h-4 mr-1" /> My Orders
        </Link>
        <div className="glass-panel rounded-3xl p-12 border border-white/5 shadow-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Order not found</h2>
          <p className="text-muted-foreground mb-6">This order may have been removed or doesn't exist.</p>
          <Button onClick={() => router.push('/orders')}>View My Orders</Button>
        </div>
      </div>
    );
  }

  const steps = [
    { status: 'placed', label: 'Order Placed', icon: Clock },
    { status: 'preparing', label: 'Preparing', icon: ChefHat },
    { status: 'ready', label: 'Ready for Pickup', icon: PackageCheck },
    { status: 'completed', label: 'Completed', icon: CheckCircle },
  ];

  const currentStepIdx = steps.findIndex(s => s.status === order.status);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/orders" className="inline-flex items-center text-muted-foreground hover:text-primary transition">
          <ChevronLeft className="w-4 h-4 mr-1" /> My Orders
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-white/60 text-sm">Order #{order.id.slice(-6).toUpperCase()}</span>
      </div>

      <div className="glass-panel rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-white/5">
          <div 
            className="h-full bg-primary transition-all duration-1000 ease-out"
            style={{ width: `${((currentStepIdx + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="text-center mb-10">
          <p className="text-muted-foreground text-sm font-medium mb-1">ORDER #{order.id.slice(-6).toUpperCase()}</p>
          <h1 className="text-3xl font-bold text-white mb-2">Track Your Order</h1>
          <p className="text-muted-foreground font-medium mb-2">Pickup Time: {order.pickupTime || 'ASAP'}</p>
          <div className="text-xl bg-white/5 inline-block px-4 py-2 rounded-xl border border-white/10">
            ETA: <SmartTimer status={order.status} createdAt={order.createdAt} />
          </div>
        </div>

        <div className="relative mb-12">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-8 right-8 h-1 bg-white/10 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-8 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-1000"
            style={{ width: `calc(${currentStepIdx * 33.3}% - 2rem)` }}
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
                <span className="font-medium text-white">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-4 flex justify-between items-center">
            <span className="text-muted-foreground">Total</span>
            <span className="text-2xl font-bold text-white">₹{order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
