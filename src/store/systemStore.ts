import { create } from 'zustand';

interface SystemState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useSystemStore = create<SystemState>((set) => ({
  isOpen: true, // Mocked to open by default
  setIsOpen: (isOpen) => set({ isOpen }),
}));
