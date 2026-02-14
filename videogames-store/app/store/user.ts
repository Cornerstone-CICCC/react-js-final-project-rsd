import { create } from "zustand";

export type User = {
  _id: string;
  email?: string;
  ownedGames?: string[];
};

type UserStore = {
  user: User | null;
  setUser: (u: User) => void;
  clearUser: () => void;
  logout: () => void;
};

export const useUser = create<UserStore>((set) => ({
  user: null,
  setUser: (u) => set({ user: u }),
  clearUser: () => set({ user: null }),
  logout: () => set({ user: null }),
}));
