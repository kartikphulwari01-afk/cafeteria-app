import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  uid: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface UserState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null, // Start unauthenticated
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      isAdmin: () => get().user?.role === 'admin',
    }),
    {
      name: 'user-storage', // name of item in localStorage
    }
  )
);
