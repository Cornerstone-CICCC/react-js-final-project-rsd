import { create } from "zustand";

export type Game = {
  _id: string;
  title: string;
  price: number;   
  mainImg?: string;
  image?: string;
  description?: string;
};


type WishlistStore = {
  items: Game[];
  addToWishlist: (game: Game) => void;
  removeFromWishlist: (id: string) => void;
  has: (id: string) => boolean;
  setItems: (items: Game[]) => void;
};

export const useWishlist = create<WishlistStore>((set, get) => ({
  items: [],

  addToWishlist: (game) => {
    const exists = get().items.some((g) => g._id === game._id);
    if (exists) return;
    set({ items: [...get().items, game] });
  },

  removeFromWishlist: (id) =>
    set((state) => ({
      items: state.items.filter((g) => g._id !== id),
    })),

  has: (id) => get().items.some((g) => g._id === id),
  setItems: (items) => set({ items }),
}));
