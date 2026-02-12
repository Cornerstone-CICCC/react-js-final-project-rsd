import { create } from "zustand";

export type OwnedGame = {
  id: string;
  title: string;
  image: string;
  status: "installed" | "update" | "not_installed";
  lastPlayed: string;
  price: number;
  favorite?: boolean;
  acquiredAt: string;
};

type LibraryStore = {
  games: OwnedGame[];
  addGame: (game: OwnedGame) => void;
  toggleFavorite: (id: string) => void;
};

export const useLibrary = create<LibraryStore>((set) => ({
  games: [],
  addGame: (game) =>
    set((state) => ({
      games: [...state.games, game],
    })),
  toggleFavorite: (id) =>
    set((state) => ({
      games: state.games.map((g) =>
        g.id === id ? { ...g, favorite: !g.favorite } : g
      ),
    })),
}));
