import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoriteStore {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: (id) => set((state) => {
        const isFav = state.favoriteIds.includes(id);
        if (isFav) {
          return { favoriteIds: state.favoriteIds.filter(fId => fId !== id) };
        } else {
          return { favoriteIds: [...state.favoriteIds, id] };
        }
      }),
      isFavorite: (id) => get().favoriteIds.includes(id),
    }),
    {
      name: 'cafeteria-favorites',
    }
  )
);
