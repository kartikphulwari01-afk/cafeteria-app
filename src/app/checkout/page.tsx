'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { useToastStore } from '@/store/toastStore';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Clock, Navigation, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Tell TypeScript about the globally-loaded Razorpay SDK (injected via next/script in layout.tsx)
declare global {
  interface Window {
    Razorpay: new (options: Record<string, any>) => { open: () => void };
  }
}

// Premium celebration effect — warm palette matching app branding, non-blocking
function triggerCelebration() {
  const colors = ['#FF5A00', '#FF8C42', '#FFD700', '#FFFFFF', '#FF3D00'];

  // Centre burst
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors,
    shapes: ['star', 'circle'],
    scalar: 1.1,
  });

  // Subtle side bursts at 300 ms — max total duration ~1.2 s
  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
      shapes: ['star'],
      scalar: 0.9,
    });
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
      shapes: ['star'],
      scalar: 0.9,
    });
  }, 300);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const { user } = useUserStore();
  const { addToast } = useToastStore();
  
  const [pickupType, setPickupType] = useState<'ASAP' | 'SCHEDULED'>('ASAP');
  const [scheduledTime, setScheduledTime] = useState('');
  const [timeError, setTimeError] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState('');
  const [successOrderTotal, setSuccessOrderTotal] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user || (items.length === 0 && !isSuccess)) {
    return (
      <div className="min-h-screen pt-24 px-4 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-white mb-4">Nothing to checkout!</h2>
        <Button onClick={() => router.push('/menu')}>Back to Menu</Button>
      </div>
    );
  }

  const validateTime = (timeValue: string) => {
    setScheduledTime(timeValue);
    if (!timeValue) {
      setTimeError('Please select a time');
      return false;
    }

    const now = new Date();
    const [hours, minutes] = timeValue.split(':').map(Number);
    const selectedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    
    const minDelayMs = 10 * 60 * 1000; // 10 minutes
    if (selectedDate.getTime() < now.getTime() + minDelayMs) {
      setTimeError('Pickup must be at least 10 minutes from now');
      return false;
    }
    
    setTimeError('');
    return true;
  };


  // Razorpay payment flow — calls backend to create order, then opens popup
  const handlePayment = async () => {
    if (pickupType === 'SCHEDULED' && !validateTime(scheduledTime)) {
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create Razorpay order on the backend (secret key stays server-side)
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice() }),
      });

      if (!res.ok) {
        const err = await res.json();
        addToast(err.error || 'Payment initiation failed. Please try again.', 'warn');
        setIsProcessing(false);
        return;
      }

      const order = await res.json();

      // Step 2: Open Razorpay checkout popup
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,        // in paisa from backend
        currency: order.currency,
        name: 'CafeBuddy',
        description: 'Cafeteria Order Payment',
        order_id: order.id,
        // Step 3: Verify payment then place order
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          setIsProcessing(true);
          try {
            // 1. Construct order data to be saved on the backend
            const orderPayload = {
              userId: user.uid,
              userName: user.name || user.email,
              userEmail: user.email,
              items: items.map(i => ({ menuItemId: i.id, name: i.name, price: i.price, quantity: i.quantity })),
              totalAmount: totalPrice(),
              pickupType,
              scheduledTime: pickupType === 'SCHEDULED' ? scheduledTime : null,
              pickupTime: pickupType === 'ASAP' ? 'ASAP' : `Scheduled: ${scheduledTime}`,
              status: 'pending',
            };

            // 2. Verify payment with backend (HMAC check + Firestore save)
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                orderData: orderPayload
              }),
            });

            const verification = await verifyRes.json();

            if (verification.success) {
              // 3. Success path: Fire celebration and show success screen
              // Note: The order is already saved to Firestore by the backend API
              triggerCelebration();
              addToast('Order Placed Successfully 🎉', 'success');

              setSuccessOrderId(verification.orderId);
              setSuccessOrderTotal(totalPrice());
              
              setIsSuccess(true);
              clearCart();
            } else {
              // 4. Verification failed logic
              addToast(verification.message || 'Payment verification failed', 'warn');
              setIsProcessing(false);
            }
          } catch (error) {
            addToast('Error verifying payment. Please contact support.', 'warn');
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            addToast('Payment cancelled.', 'default');
          },
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#FF5A00', // match app's primary orange
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      // Reset processing state after opening — handler callback owns state from here
      setIsProcessing(false);

    } catch {
      addToast('Something went wrong. Please try again.', 'warn');
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f14] relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-[200px] pointer-events-none"></div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="bg-[#15151a]/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-white/10 text-center shadow-2xl max-w-md w-full relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
          >
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </motion.div>
          
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Order Placed Successfully 🎉</h2>
          <p className="text-muted-foreground mb-8 text-lg font-medium">Your food is being prepared</p>
          
          <div className="bg-black/40 rounded-2xl p-6 mb-8 border border-white/5 space-y-3 relative overflow-hidden text-left">
             <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-white/60 text-sm font-semibold uppercase tracking-wider">Order ID</span>
                <span className="text-white font-mono font-bold tracking-widest">{successOrderId.slice(-6).toUpperCase()}</span>
             </div>
             <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-white/60 text-sm font-semibold uppercase tracking-wider">Total Amount</span>
                <span className="text-primary font-black text-lg">₹{successOrderTotal.toFixed(2)}</span>
             </div>
          </div>
          
          <Button 
             onClick={() => router.push(`/orders/${successOrderId}`)}
             className="w-full h-14 text-lg font-black bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
             Track Order
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-5xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-white transition mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Menu
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side - Details */}
        <div>
          <h1 className="text-4xl font-black text-white mb-8">Checkout</h1>
          
          <div className="bg-[#15151a] border border-white/10 rounded-3xl p-6 mb-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <Clock className="w-5 h-5 text-primary" /> Pickup Time
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div 
                onClick={() => setPickupType('ASAP')}
                className={`p-4 rounded-xl border cursor-pointer font-bold transition-all ${
                  pickupType === 'ASAP' 
                    ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(255,90,0,0.2)]' 
                    : 'bg-white/5 border-white/10 text-muted-foreground hover:border-white/30'
                }`}
              >
                ASAP (~15 min)
              </div>
              <div 
                onClick={() => {
                  setPickupType('SCHEDULED');
                  if (!scheduledTime) {
                    const defaultTime = new Date(Date.now() + 15 * 60000);
                    setScheduledTime(`${defaultTime.getHours().toString().padStart(2, '0')}:${defaultTime.getMinutes().toString().padStart(2, '0')}`);
                  }
                }}
                className={`p-4 rounded-xl border cursor-pointer font-bold transition-all ${
                  pickupType === 'SCHEDULED' 
                    ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(255,90,0,0.2)]' 
                    : 'bg-white/5 border-white/10 text-muted-foreground hover:border-white/30'
                }`}
              >
                Schedule Order
              </div>
            </div>

            <AnimatePresence>
              {pickupType === 'SCHEDULED' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2">
                    <label className="block text-sm font-bold text-white/70 mb-2">Select Time (24h)</label>
                    <input 
                      type="time" 
                      value={scheduledTime}
                      onChange={(e) => validateTime(e.target.value)}
                      className={`w-full bg-black/40 border rounded-xl p-3 text-white font-mono text-lg focus:outline-none transition-colors ${timeError ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary/50'}`}
                    />
                    {timeError && <p className="text-red-400 text-sm mt-2 font-medium">{timeError}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-[#15151a] border border-white/10 rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <Navigation className="w-5 h-5 text-primary" /> Payment Method
            </h3>
            
            <div className="bg-[#0f0f14] border border-white/5 rounded-xl p-6">
              {/* Razorpay payment only */}
              <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Razorpay branding */}
                  <div className="w-20 h-20 rounded-2xl bg-[#072654] flex items-center justify-center mb-5 shadow-[0_0_25px_rgba(7,38,84,0.5)] border border-white/10">
                    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
                      <path d="M15 45L27 15H39L27 35H45L21 60L30 38H15V45Z" fill="#3395FF"/>
                    </svg>
                  </div>
                  <h4 className="font-bold text-white text-lg mb-2">Pay Securely with Razorpay</h4>
                  <p className="text-sm text-muted-foreground mb-2">Cards · UPI · Netbanking · Wallets</p>
                  <p className="text-xs text-white/30 mb-6">256-bit SSL encrypted · PCI-DSS compliant</p>

                  <div className="w-full bg-black/30 border border-white/5 rounded-xl p-4 mb-6 text-left space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Amount to pay</span>
                      <span className="text-white font-bold">₹{totalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Payment gateway</span>
                      <span className="text-white font-bold">Razorpay</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handlePayment}
                    className="w-full h-12 text-md font-bold bg-[#3395FF] hover:bg-[#2280e0] shadow-[0_0_20px_rgba(51,149,255,0.3)]"
                    isLoading={isProcessing}
                    disabled={isProcessing}
                  >
                    Pay ₹{totalPrice().toFixed(2)} Now
                  </Button>
                </motion.div>
            </div>
          </div>
        </div>

        {/* Right Side - Summary */}
        <div className="bg-[#15151a] border border-white/10 rounded-3xl p-8 sticky top-24 h-fit">
          <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto no-scrollbar pr-2">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded bg-white/10 flex items-center justify-center font-bold text-sm text-white">{item.quantity}x</span>
                  <span className="font-medium text-white">{item.name}</span>
                </div>
                <span className="font-bold text-white">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-4 space-y-3 mb-8">
             <div className="flex justify-between text-white/50 font-semibold text-sm">
               <span>Subtotal</span>
               <span>₹{totalPrice().toFixed(2)}</span>
             </div>

            <div className="flex justify-between text-xl font-black text-white pt-3 border-t border-white/5 mt-2">
              <span>Grand Total</span>
              <span className="text-primary">₹{totalPrice().toFixed(2)}</span>
            </div>
          </div>

          {/* Summary panel CTA */}
          <Button 
            className="w-full h-14 text-lg bg-[#3395FF] hover:bg-[#2280e0] shadow-[0_0_20px_rgba(51,149,255,0.3)]"
            onClick={handlePayment}
            disabled={isProcessing}
            isLoading={isProcessing}
          >
            Pay ₹{totalPrice().toFixed(2)} with Razorpay
          </Button>
        </div>
      </div>

    </div>
  );
}
