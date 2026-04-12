'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { api } from '@/lib/api';
import { Clock, Navigation, CheckCircle, ArrowLeft, QrCode, Smartphone, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const { user } = useUserStore();
  
  const [pickupTime, setPickupTime] = useState('12:00 PM');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<'QR' | 'UPI'>('QR');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      const orderData = {
        userId: user.uid,
        items: items.map(i => ({ menuItemId: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        totalAmount: totalPrice(),
        pickupTime,
        paymentMethod: paymentMethod, // Will be "QR" or "UPI"
        paymentStatus: 'Pending Verification'
      };
      
      const newOrder = await api.placeOrder(orderData);
      
      setShowConfirmModal(false);
      setIsSuccess(true);
      clearCart();
      
      setTimeout(() => {
        router.push(`/orders/${newOrder.id}`);
      }, 2500);
      
    } catch (e) {
      alert("Checkout failed. Please try again.");
      setIsProcessing(false);
      setShowConfirmModal(false);
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText('paytm.s1sp0hd@pty');
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f14]">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#15151a] p-10 rounded-3xl border border-white/10 text-center shadow-2xl max-w-sm w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <CheckCircle className="w-24 h-24 text-primary mb-6 mx-auto drop-shadow-[0_0_15px_rgba(255,90,0,0.5)]" />
          </motion.div>
          <h2 className="text-3xl font-black text-white mb-2">Order Placed!</h2>
          <p className="text-muted-foreground mb-6">Waiting for payment verification and restaurant confirmation...</p>
          <div className="w-8 h-8 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['ASAP (~15m)', '12:00 PM', '12:30 PM', '1:00 PM'].map(time => (
                <div 
                  key={time}
                  onClick={() => setPickupTime(time)}
                  className={`p-4 rounded-xl border cursor-pointer font-bold transition-all ${
                    pickupTime === time 
                      ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(255,90,0,0.2)]' 
                      : 'bg-white/5 border-white/10 text-muted-foreground hover:border-white/30'
                  }`}
                >
                  {time}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#15151a] border border-white/10 rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <Navigation className="w-5 h-5 text-primary" /> Payment Method
            </h3>
            
            <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/10 mb-6 w-full">
              {[
                { id: 'QR', icon: QrCode, label: 'QR Scan' },
                { id: 'UPI', icon: Smartphone, label: 'UPI ID' }
              ].map(opt => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id as 'QR' | 'UPI')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                      paymentMethod === opt.id 
                        ? 'bg-primary text-white shadow-[0_0_15px_rgba(255,90,0,0.4)]' 
                        : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" /> <span>{opt.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="bg-[#0f0f14] border border-white/5 rounded-xl p-6">
              {paymentMethod === 'QR' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="bg-white p-4 rounded-xl mb-4 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    <img src="/qr.png" alt="Scan to pay" className="w-40 h-40 rounded-lg object-contain" />
                  </div>
                  <h4 className="font-bold text-white text-lg mb-2">Scan & Pay using any UPI app</h4>
                  <p className="text-sm text-muted-foreground mb-6">GPay, PhonePe, Paytm supported.</p>
                  
                  <Button 
                    onClick={() => setShowConfirmModal(true)} 
                    className="w-full h-12 text-md font-bold"
                    disabled={isProcessing}
                  >
                    I have completed payment
                  </Button>
                </motion.div>
              )}

              {paymentMethod === 'UPI' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col text-center"
                >
                  <div className="bg-black/60 border border-white/10 p-5 rounded-xl mb-6">
                    <p className="text-xs text-muted-foreground font-bold mb-2 uppercase tracking-wider">Business UPI ID</p>
                    <div className="flex items-center justify-between bg-[#15151a] p-4 rounded-lg border border-white/5">
                      <span className="text-lg text-primary font-black tracking-wide">paytm.s1sp0hd@pty</span>
                      <button 
                        onClick={copyUpiId}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors" 
                        title="Copy UPI ID"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                    <a 
                      href="upi://pay?pa=paytm.s1sp0hd@pty&pn=Cafeteria"
                      className="mt-4 flex items-center justify-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                    >
                      <ExternalLink className="w-4 h-4" /> Open in UPI App
                    </a>
                  </div>
                  
                  <Button 
                    onClick={() => setShowConfirmModal(true)} 
                    className="w-full h-12 text-md font-bold"
                    disabled={isProcessing}
                  >
                    I have completed payment
                  </Button>
                </motion.div>
              )}
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

          <Button 
            className="w-full h-14 text-lg"
            onClick={() => setShowConfirmModal(true)}
            disabled={isProcessing}
            isLoading={isProcessing}
          >
            I have completed payment
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#15151a] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl relative"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Confirm Payment</h3>
                <p className="text-muted-foreground mb-8 text-md px-2">
                  Have you successfully completed the payment of <span className="text-white font-bold">₹{totalPrice().toFixed(2)}</span> on your UPI app?
                </p>
                <div className="flex flex-col sm:flex-row w-full gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/5 h-12"
                    onClick={() => setShowConfirmModal(false)}
                    disabled={isProcessing}
                  >
                    No, Cancel
                  </Button>
                  <Button 
                    className="flex-1 h-12"
                    onClick={handlePlaceOrder}
                    isLoading={isProcessing}
                    disabled={isProcessing}
                  >
                    Yes, place order
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
