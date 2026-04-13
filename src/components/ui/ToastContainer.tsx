'use client';
import { useToastStore } from '@/store/toastStore';
import { AnimatePresence, motion } from 'framer-motion';

export function ToastContainer() {
  const { toasts } = useToastStore();

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            layout
            className={`px-5 py-3 rounded-xl shadow-2xl font-bold text-sm tracking-wide border pointer-events-auto flex items-center gap-3 backdrop-blur-md ${
              toast.type === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
              toast.type === 'warn' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-500' :
              'bg-[#15151a]/90 border-white/20 text-white'
            }`}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
