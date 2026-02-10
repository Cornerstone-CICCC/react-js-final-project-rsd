import { create } from "zustand";

export type Game = {
  id: string;
  title: string;
  price: string;
  image: string;
};

type WishlistStore = {
  items: Game[];
  addToWishlist: (game: Game) => void;
  removeFromWishlist: (id: string) => void;
  has: (id: string) => boolean;
};

export const useWishlist = create<WishlistStore>((set, get) => ({
  items: [],

  addToWishlist: (game) => {
    const exists = get().items.some((g) => g.id === game.id);
    if (exists) return;
    set({ items: [...get().items, game] });
  },

  removeFromWishlist: (id) =>
    set((state) => ({
      items: state.items.filter((g) => g.id !== id),
    })),

  has: (id) => get().items.some((g) => g.id === id),
}));
