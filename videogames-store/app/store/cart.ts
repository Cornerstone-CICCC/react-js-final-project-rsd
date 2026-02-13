import { create } from "zustand";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  imageImg?: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  clear: () => void;
};

export const useCart = create<CartStore>((set) => ({
  items: [],
  isOpen: false,

  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  add: (item) =>
    set((state) => {
      const exists = state.items.find((i) => i.id === item.id);
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),

  remove: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  increase: (id) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      ),
    })),

  decrease: (id) =>
    set((state) => ({
      items: state.items
        .map((i) =>
          i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
        )
        .filter((i) => i.quantity > 0),
    })),
    clear: () => set({ items: [] }),
  
}));

