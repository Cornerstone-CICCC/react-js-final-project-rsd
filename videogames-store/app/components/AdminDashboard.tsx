"use client";

import React, { useState } from "react";
import { Search, Plus, Edit2, Trash2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../store/toast";

type Game = {
  id: string;
  title: string;
  price: number;
  category: string;
  releaseDate: string;
  cover: string;
  status: "Published" | "Draft";
};

export default function AdminDashboard() {
  const showToast = useToast((s) => s.show);

  const [query, setQuery] = useState("");
  const [games, setGames] = useState<Game[]>([
    {
      id: "1",
      title: "Halo Infinite",
      price: 59.99,
      category: "FPS",
      releaseDate: "2021-12-08",
      cover:
        "https://images.unsplash.com/photo-1738071665033-7ba9885c2c20?q=80&w=200",
      status: "Published",
    },
    {
      id: "2",
      title: "Cyberpunk 2077",
      price: 29.99,
      category: "RPG",
      releaseDate: "2020-12-10",
      cover:
        "https://images.unsplash.com/photo-1758404196311-70c62a445e9c?q=80&w=200",
      status: "Published",
    },
    {
      id: "3",
      title: "Starfield",
      price: 69.99,
      category: "RPG",
      releaseDate: "2023-09-06",
      cover:
        "https://images.unsplash.com/photo-1702499903230-867455db1752?q=80&w=200",
      status: "Draft",
    },
  ]);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);

  // (placeholder) Add modal later
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredGames = games.filter((g) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      g.title.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      g.status.toLowerCase().includes(q)
    );
  });

  function handleDeleteClick(game: Game) {
    setGameToDelete(game);
    setIsDeleteOpen(true);
  }

  function confirmDelete() {
    if (!gameToDelete) return;

    setGames((prev) => prev.filter((g) => g.id !== gameToDelete.id));
    showToast(`${gameToDelete.title} deleted successfully ✅`);

    setIsDeleteOpen(false);
    setGameToDelete(null);
  }

  return (
    // ✅ FIX overlap: add top padding only for this page (sticky header safe)
    <div className="min-h-screen bg-[#050505] text-white px-6 pb-10 pt-24 md:pt-28">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-[#111]/50 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">
            Admin Catalog
          </h1>
          <p className="text-white/30 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            Marketplace CRUD — UI Only (Mongo next step)
          </p>
        </div>

        {/* Search + Add */}
        <div className="flex gap-3 w-full md:w-auto">
          <div className="flex flex-1 items-center bg-black/40 border border-white/10 rounded-2xl px-4 py-2.5">
            <Search className="w-4 h-4 text-white/30 mr-2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search games..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>

          <button
            onClick={() => {
              showToast("Add modal (Mongo tomorrow)");
              setIsModalOpen(true);
            }}
            className="h-11 px-5 rounded-2xl bg-[#3DFF6B] text-black font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-green-400 transition"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </header>

      {/* Table */}
      <section className="max-w-7xl mx-auto bg-[#111] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5">
          <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
            Showing {filteredGames.length} of {games.length}
          </p>
        </div>

        <div className="overflow-x-auto hidden lg:block">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-white/30">
                <th className="px-8 py-5">Game</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Price</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredGames.map((game) => (
                <tr key={game.id} className="hover:bg-white/5 transition">
                  <td className="px-8 py-6 flex items-center gap-4">
                    <img
                      src={game.cover}
                      alt={game.title}
                      className="w-12 h-16 object-cover rounded-xl border border-white/10"
                    />
                    <div>
                      <p className="font-black uppercase italic text-white">
                        {game.title}
                      </p>
                      <p className="text-[10px] text-white/20">
                        ID: {game.id}
                      </p>
                    </div>
                  </td>

                  <td className="px-8 py-6 text-white/50 font-bold">
                    {game.category}
                  </td>

                  <td className="px-8 py-6 font-black text-[#3DFF6B]">
                    ${game.price}
                  </td>

                  <td className="px-8 py-6 text-white/40 font-bold">
                    {game.status}
                  </td>

                  <td className="px-8 py-6 flex justify-end gap-3">
                    <button
                      onClick={() => showToast("Edit modal coming tomorrow ✍️")}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#3DFF6B]/40"
                    >
                      <Edit2 className="w-4 h-4 text-white/40" />
                    </button>

                    <button
                      onClick={() => handleDeleteClick(game)}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/40"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredGames.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-16 text-center text-white/40"
                  >
                    No games match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden p-6 grid gap-4">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="bg-white/5 border border-white/10 rounded-3xl p-5 flex gap-4"
            >
              <img
                src={game.cover}
                alt={game.title}
                className="w-20 h-28 object-cover rounded-2xl"
              />

              <div className="flex-1">
                <h3 className="font-black uppercase italic">{game.title}</h3>
                <p className="text-white/40 text-sm">{game.category}</p>
                <p className="text-[#3DFF6B] font-black mt-2">
                  ${game.price}
                </p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => showToast("Edit coming soon")}
                    className="text-xs text-white/40 hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(game)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredGames.length === 0 && (
            <div className="py-10 text-center text-white/40">
              No games match your search.
            </div>
          )}
        </div>
      </section>

      {/* Delete Modal */}
      <AnimatePresence>
        {isDeleteOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-lg"
              onClick={() => setIsDeleteOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="relative z-10 w-full max-w-md bg-[#111] border border-red-500/20 rounded-3xl p-8 text-center"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-3xl bg-red-500/10">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>

              <h2 className="text-xl font-black uppercase mb-3">
                Delete game?
              </h2>

              <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-8">
                Remove{" "}
                <span className="text-white">{gameToDelete?.title}</span> from
                catalog.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  className="py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="py-3 rounded-2xl bg-red-500 text-xs font-black uppercase"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
