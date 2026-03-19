import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@angoclima_favorites';

interface FavoritesState {
  favorites: string[];
  loaded: boolean;
  loadFavorites: () => Promise<void>;
  addFavorite: (city: string) => Promise<void>;
  removeFavorite: (city: string) => Promise<void>;
  isFavorite: (city: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  loaded: false,

  loadFavorites: async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        set({ favorites: JSON.parse(stored), loaded: true });
      } else {
        set({ loaded: true });
      }
    } catch {
      set({ loaded: true });
    }
  },

  addFavorite: async (city: string) => {
    const current = get().favorites;
    if (!current.includes(city)) {
      const updated = [...current, city];
      set({ favorites: updated });
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    }
  },

  removeFavorite: async (city: string) => {
    const updated = get().favorites.filter((f) => f !== city);
    set({ favorites: updated });
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  },

  isFavorite: (city: string) => {
    return get().favorites.includes(city);
  },
}));
