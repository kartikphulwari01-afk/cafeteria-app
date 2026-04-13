'use client';
import { useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { useUserStore } from '@/store/userStore';
import { useToastStore } from '@/store/toastStore';
import { useOrderStore, Order } from '@/store/orderStore';

// Helper: send browser push notification safely
function sendBrowserNotification(title: string, body: string) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, { body, icon: '/favicon.ico' });
    } catch (e) {
      // silently fail (e.g. in some mobile browsers)
    }
  }
}

// Helper: request permission once (silently)
function requestNotificationPermissionOnce() {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission === 'default') {
    Notification.requestPermission().catch(() => {});
  }
}

export function OrderNotifier() {
  const { user } = useUserStore();
  const { addToast } = useToastStore();
  const { setOrders, addUpdatedOrderId } = useOrderStore();
  const prevOrdersRef = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;

    // Ask for notification permission once when a user is logged in
    requestNotificationPermissionOnce();

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const currentStatusMap: Record<string, string> = {};
      const newOrders = snapshot.docs.map(doc => {
        const data = doc.data();
        currentStatusMap[doc.id] = data.status;
        return { id: doc.id, ...data } as Order;
      });
      
      setOrders(newOrders);

      snapshot.docs.forEach(doc => {
        const id = doc.id;
        const status = doc.data().status;
        const prevStatus = prevOrdersRef.current[id];
        
        if (prevStatus && prevStatus !== status) {
          addUpdatedOrderId(id);
          
          if (status === 'preparing') {
             addToast("Your order is being prepared 👨‍🍳", 'default');
             sendBrowserNotification("Cafeteria Update", "Your order is being prepared! 👨‍🍳");
          } else if (status === 'ready') {
             addToast("Your order is ready! 🎉", 'success');
             sendBrowserNotification("Your order is ready! 🎉", "Head over to the cafeteria counter to pick it up.");
             const audio = new Audio('/sounds/notify.mp3');
             audio.play().catch(() => { /* autoplay blocked by browser — expected */ });
          } else if (status === 'completed') {
             addToast("Order completed ✅", 'success');
             sendBrowserNotification("Order Completed ✅", "Thank you for ordering at the Cafeteria!");
          }
        }
      });
      
      prevOrdersRef.current = currentStatusMap;
    });

    return () => unsubscribe();
  }, [user]);

  return null;
}
