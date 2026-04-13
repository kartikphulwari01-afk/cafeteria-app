'use client';

import { useEffect, useState, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { useSystemStore } from "@/store/systemStore";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/store/toastStore";

const ALLOWED_EMAILS = [
  'kartikphulwari01@gmail.com',
  'aryanchaturvedi2006@gmail.com'
];

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: any;
  items: any[];
  pickupTime?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
}

// Extracted as standalone component to prevent re-creation on every render
function OrderCard({ order, onStatusChange }: { order: Order; onStatusChange: (id: string, status: string) => void }) {
  const isNewOrder = () => {
    if (!order.createdAt) return false;
    const time = order.createdAt.toDate ? order.createdAt.toDate().getTime() : new Date(order.createdAt).getTime();
    return new Date().getTime() - time < 2 * 60 * 1000;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'placed': return 'border-yellow-500/50 bg-yellow-500/5 shadow-[0_0_15px_rgba(234,179,8,0.1)]';
      case 'preparing': return 'border-blue-500/50 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.1)]';
      case 'ready': return 'border-green-500/50 bg-green-500/5 shadow-[0_0_15px_rgba(34,197,94,0.1)]';
      case 'completed': return 'border-white/10 bg-white/5 opacity-70';
      default: return 'border-white/10 bg-white/5';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
      case 'placed': return <span className="bg-yellow-500/20 text-yellow-500 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Pending</span>;
      case 'preparing': return <span className="bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Preparing</span>;
      case 'ready': return <span className="bg-green-500/20 text-green-400 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Ready</span>;
      case 'completed': return <span className="bg-white/10 text-white/50 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Completed</span>;
      default: return null;
    }
  };

  return (
    <div key={order.id} className={`border rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all relative ${getStatusColor(order.status)}`}>
      {isNewOrder() && (
        <div className="absolute -top-3 -right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-bounce">
          NEW
        </div>
      )}
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="font-mono text-sm px-2.5 py-1 bg-black/40 border border-white/10 rounded-lg text-white font-bold">
            #{order.id.slice(-6).toUpperCase()}
          </span>
          {getStatusBadge(order.status)}
        </div>
        
        <div className="mb-5 bg-black/20 p-4 rounded-xl border border-white/5">
           <div className="text-sm text-white/50 mb-2">Customer: <span className="text-white font-bold ml-1">{order.userName || order.userEmail || order.userId?.slice(0,8) || 'Guest'}</span></div>
           <div className="text-sm text-white/50">Pickup Time: <span className="text-primary font-bold ml-1">{order.pickupTime}</span></div>
        </div>
        
        <div className="space-y-2 mb-6">
          {order.items.map((item, idx) => (
            <div key={idx} className="text-sm flex justify-between bg-black/20 p-2.5 rounded-lg border border-white/5">
              <div><span className="text-white font-black bg-white/10 px-2 py-0.5 rounded mr-2">{item.quantity}x</span> <span className="text-white/80 font-medium">{item.name}</span></div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4 pt-4 border-t border-white/10">
           <span className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Total</span>
           <span className="font-black text-2xl text-white">₹{order.totalAmount.toFixed(2)}</span>
        </div>

        <div className="flex flex-col gap-2 w-full mt-auto">
          {(order.status === 'pending' || order.status === 'placed') && (
            <button onClick={() => onStatusChange(order.id, 'preparing')} className="w-full px-5 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              Accept Order
            </button>
          )}
          {order.status === 'preparing' && (
            <button onClick={() => onStatusChange(order.id, 'ready')} className="w-full px-5 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              Mark Ready
            </button>
          )}
          {order.status === 'ready' && (
            <button onClick={() => onStatusChange(order.id, 'completed')} className="w-full px-5 py-3.5 bg-white hover:bg-gray-200 text-black font-black rounded-xl transition-all">
              Complete Order
            </button>
          )}
          {order.status === 'completed' && (
            <div className="w-full px-5 py-3.5 bg-white/5 text-white/30 font-bold rounded-xl text-center border border-white/5 uppercase tracking-widest text-sm">
              Order Finished
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Extracted as standalone component
function OrderSection({ title, orders, onStatusChange }: { title: string; orders: Order[]; onStatusChange: (id: string, status: string) => void }) {
  if (orders.length === 0) return null;
  
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
         {title}
         <span className="bg-white/10 text-white text-sm px-3 py-1 rounded-full">{orders.length}</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.map(order => (
          <OrderCard key={order.id} order={order} onStatusChange={onStatusChange} />
        ))}
      </div>
    </div>
  );
}

// Skeleton loader matching order card shape
function OrderCardSkeleton() {
  return (
    <div className="border border-white/10 rounded-2xl p-6 flex flex-col gap-4 skeleton">
      <div className="flex justify-between items-start">
        <div className="h-7 w-24 bg-white/10 rounded-lg"></div>
        <div className="h-6 w-20 bg-white/10 rounded-full"></div>
      </div>
      <div className="bg-white/5 rounded-xl p-4 space-y-2">
        <div className="h-4 w-3/4 bg-white/10 rounded"></div>
        <div className="h-4 w-1/2 bg-white/10 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-9 bg-white/5 rounded-lg"></div>
        <div className="h-9 bg-white/5 rounded-lg"></div>
      </div>
      <div className="pt-4 border-t border-white/10 flex justify-between items-center">
        <div className="h-4 w-16 bg-white/10 rounded"></div>
        <div className="h-7 w-24 bg-white/10 rounded"></div>
      </div>
      <div className="h-12 bg-white/10 rounded-xl"></div>
    </div>
  );
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { isOpen, setIsOpen } = useSystemStore();
  const { user } = useUserStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const previousOrdersRef = useRef<Record<string, boolean>>({});
  const { addToast } = useToastStore();

  useEffect(() => {
    if (!user || !user.email || !ALLOWED_EMAILS.includes(user.email)) {
      router.push('/auth/login');
      return;
    }
    
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      
      const newOrdersMap: Record<string, boolean> = {};
      let hasNewValidOrder = false;
      const prevIdsStr = Object.keys(previousOrdersRef.current);
      
      data.forEach(order => {
        newOrdersMap[order.id] = true;
        if (prevIdsStr.length > 0 && !previousOrdersRef.current[order.id] && order.createdAt) {
          hasNewValidOrder = true;
        }
      });

      if (hasNewValidOrder) {
        const audio = new Audio('/sounds/notify.mp3');
        audio.play().catch(() => { /* autoplay blocked by browser — expected */ });
        addToast("New Order Received 🔥", "default");
      }

      previousOrdersRef.current = newOrdersMap;
      setOrders(data);
      setIsLoading(false);
    }, () => {
      // Firestore listener error — fail silently and stop loading
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, router, addToast]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus
      });
    } catch {
      addToast("Failed to update order status. Please retry.", "warn");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">Live Orders</h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded-lg border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              LIVE
            </span>
          </div>
          <p className="text-muted-foreground">Manage incoming orders and update their statuses.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
          <div className="text-sm font-medium">
            Cafeteria Status: <span className={isOpen ? "text-green-500" : "text-red-500"}>{isOpen ? "OPEN" : "CLOSED"}</span>
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition ${isOpen ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'}`}
          >
            {isOpen ? 'Close Cafeteria' : 'Open Cafeteria'}
          </button>
        </div>
      </div>

      <div className="space-y-12">
        {isLoading ? (
          <div>
            <div className="h-7 w-48 bg-white/10 rounded skeleton mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <OrderCardSkeleton key={i} />)}
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-white/5 rounded-xl">No active orders right now.</div>
        ) : (
          <>
            <OrderSection title="Pending Orders" orders={orders.filter(o => o.status === 'pending' || o.status === 'placed')} onStatusChange={handleStatusChange} />
            <OrderSection title="Preparing Orders" orders={orders.filter(o => o.status === 'preparing')} onStatusChange={handleStatusChange} />
            <OrderSection title="Ready Orders" orders={orders.filter(o => o.status === 'ready')} onStatusChange={handleStatusChange} />
            <OrderSection title="Completed Orders" orders={orders.filter(o => o.status === 'completed')} onStatusChange={handleStatusChange} />
          </>
        )}
      </div>
    </div>
  );
}
