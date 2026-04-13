import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type?: 'default' | 'success' | 'warn';
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = 'default') => {
    const id = crypto.randomUUID();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    }, 4000);
  },
}));
