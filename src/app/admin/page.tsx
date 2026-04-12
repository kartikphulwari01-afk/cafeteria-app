'use client';

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Order } from "@/lib/mockData";
import { useSystemStore } from "@/store/systemStore";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { isOpen, setIsOpen } = useSystemStore();

  const fetchOrders = async () => {
    const data = await api.getActiveOrders();
    // Sort newest first
    setOrders(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    await api.updateOrderStatus(orderId, newStatus);
    fetchOrders(); // Refresh
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Live Orders</h1>
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

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-white/5 rounded-xl">No active orders right now.</div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-sm px-2 py-1 bg-white/10 rounded text-muted-foreground">
                    #{order.id.split('_')[1].toUpperCase()}
                  </span>
                  <span className="text-sm text-primary font-medium">Pickup: {order.pickupTime}</span>
                  <div className="ml-2 flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-white/5 text-white/50 px-1.5 py-0.5 rounded tracking-wider uppercase">
                      {order.paymentMethod}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase ${
                      order.paymentStatus === 'Paid' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="text-white font-medium">{item.quantity}x</span> {item.name}
                    </div>
                  ))}
                </div>
                
                <div className="font-bold text-lg text-white">
                  ${order.totalAmount.toFixed(2)}
                </div>
              </div>

              <div className="flex flex-col gap-2 min-w-[200px]">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">Update Status</p>
                <select 
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                  className={`w-full p-3 rounded-lg border border-white/10 outline-none font-medium appearance-none cursor-pointer ${
                    order.status === 'placed' ? 'bg-blue-500/20 text-blue-400' :
                    order.status === 'preparing' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-green-500/20 text-green-400'
                  }`}
                >
                  <option value="placed" className="bg-card text-foreground">Placed</option>
                  <option value="preparing" className="bg-card text-foreground">Preparing</option>
                  <option value="ready" className="bg-card text-foreground">Ready</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
