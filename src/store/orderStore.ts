import { create } from 'zustand';

export interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: any;
  items: any[];
  paymentMethod?: string;
  paymentStatus?: string;
}

interface OrderStore {
  orders: Order[];
  updatedOrderIds: string[];
  setOrders: (orders: Order[]) => void;
  addUpdatedOrderId: (id: string) => void;
  clearUpdatedOrderId: (id: string) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  updatedOrderIds: [],
  setOrders: (orders) => set({ orders }),
  addUpdatedOrderId: (id) => set((state) => ({ updatedOrderIds: [...new Set([...state.updatedOrderIds, id])] })),
  clearUpdatedOrderId: (id) => set((state) => ({ updatedOrderIds: state.updatedOrderIds.filter(i => i !== id) }))
}));
