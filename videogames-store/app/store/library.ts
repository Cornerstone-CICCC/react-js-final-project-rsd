import { create } from "zustand";

export type LibraryGame = {
  _id: string;
  title: string;
  price: number;
  mainImg: string;
  status?: string;
  lastPlayed?: string;
};

type LibraryStore = {
  games: LibraryGame[];
  setGames: (games: LibraryGame[]) => void;
  addGame: (game: LibraryGame) => void;
};

export const useLibrary = create<LibraryStore>((set) => ({
  games: [],

  setGames: (games) => set({ games }),

  addGame: (game) =>
    set((state) => ({
      games: [...state.games, game],
    })),
}));
