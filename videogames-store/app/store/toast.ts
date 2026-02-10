import { create } from "zustand";

type Toast = {
  id: number;
  message: string;
};

type ToastStore = {
  toasts: Toast[];
  show: (message: string) => void;
  remove: (id: number) => void;
};

export const useToast = create<ToastStore>((set) => ({
  toasts: [],

  show: (message) =>
    set((state) => {
      const id = Date.now();
      return { toasts: [...state.toasts, { id, message }] };
    }),

  remove: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
