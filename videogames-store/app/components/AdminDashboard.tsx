"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, Plus, Edit2, Trash2, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../store/toast"; // ajusta si tu ruta es diferente

type Status = "Published" | "Draft";

type GameUI = {
  _id: string;
  title: string;
  description: string;
  price: number;
  mainImg: string;
  category: string;

  // UI-only
  status: Status;

  // ✅ NOW real DB fields (safe optional)
  releaseDate?: string; // "YYYY-MM-DD"
  isTrending?: boolean;
};

type GameForm = {
  title: string;
  description: string;
  price: string;
  category: string;
  mainImg: string;

  // UI-only
  status: Status;

  // ✅ metadata for storefront
  releaseDate: string; // "YYYY-MM-DD"
  isTrending: boolean;
};

const emptyForm: GameForm = {
  title: "",
  description: "",
  price: "",
  category: "FPS",
  mainImg: "",
  status: "Published",
  releaseDate: "",
  isTrending: false,
};

function toDateInputValue(v?: string | Date | null) {
  if (!v) return "";
  const d = typeof v === "string" ? new Date(v) : v;
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function isNewRelease(releaseDate?: string) {
  if (!releaseDate) return false;
  const d = new Date(releaseDate);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 30; // last 30 days
}

export default function AdminDashboard() {
  const showToast = useToast((s) => s.show);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [games, setGames] = useState<GameUI[]>([]);

  // modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState<GameUI | null>(null);
  const [form, setForm] = useState<GameForm>(emptyForm);

  // delete states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<GameUI | null>(null);

  const filteredGames = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return games;
    return games.filter((g) => {
      return (
        g.title.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.status.toLowerCase().includes(q) ||
        (g.isTrending ? "trending".includes(q) : false) ||
        (g.releaseDate ? "new".includes(q) : false)
      );
    });
  }, [games, query]);

  // ---- API helpers ----
  async function apiGetGames() {
    setLoading(true);
    try {
      const res = await fetch("/api/games", { cache: "no-store" });
      const data = await res.json();

      const mapped: GameUI[] = (Array.isArray(data) ? data : []).map((g) => ({
        _id: g._id,
        title: g.title ?? "",
        description: g.description ?? "",
        price: Number(g.price ?? 0),
        mainImg: g.mainImg ?? "",
        category: g.category ?? "FPS",
        status: (g.status as Status) ?? "Published",
        releaseDate: toDateInputValue(g.releaseDate),
        isTrending: Boolean(g.isTrending),
      }));

      setGames(mapped);
    } catch {
      showToast("Error loading games ❌");
    } finally {
      setLoading(false);
    }
  }

  async function apiCreateGame(payload: Partial<GameUI>) {
    const res = await fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameInfo: payload }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Create failed");
    return data;
  }

  async function apiUpdateGame(id: string, payload: Partial<GameUI>) {
    const res = await fetch(`/api/games/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameInfo: payload }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Update failed");
    return data;
  }

  async function apiDeleteGame(id: string) {
    const res = await fetch(`/api/games/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || "Delete failed");
    return data;
  }

  useEffect(() => {
    apiGetGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- UI actions ----
  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  }

  function openEdit(game: GameUI) {
    setEditing(game);
    setForm({
      title: game.title ?? "",
      description: game.description ?? "",
      price: game.price ? String(game.price) : "",
      category: game.category ?? "FPS",
      mainImg: game.mainImg ?? "",
      status: game.status ?? "Published",
      releaseDate: game.releaseDate ?? "",
      isTrending: Boolean(game.isTrending),
    });
    setIsModalOpen(true);
  }

  function handleDeleteClick(game: GameUI) {
    setGameToDelete(game);
    setIsDeleteOpen(true);
  }

  async function confirmDelete() {
    if (!gameToDelete) return;
    try {
      await apiDeleteGame(gameToDelete._id);
      showToast(`${gameToDelete.title} deleted ✅`);
      setIsDeleteOpen(false);
      setGameToDelete(null);
      apiGetGames();
    } catch (e: any) {
      showToast(e?.message || "Delete failed ❌");
    }
  }

  function setField<K extends keyof GameForm>(key: K, value: GameForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function sanitizePriceInput(v: string) {
    const cleaned = v.replace(/[^\d.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length <= 2) return cleaned;
    return `${parts[0]}.${parts.slice(1).join("")}`;
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    if (isSaving) return;

    const priceNum =
      form.price.trim() === "" ? NaN : Number.parseFloat(form.price);

    if (!form.title.trim()) return showToast("Title is required ❗");
    if (!form.description.trim()) return showToast("Description is required ❗");
    if (Number.isNaN(priceNum)) return showToast("Price is required ❗");
    if (!form.category.trim()) return showToast("Category is required ❗");
    if (!form.mainImg.trim()) return showToast("Main image URL is required ❗");

    const payload: Partial<GameUI> = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: priceNum,
      mainImg: form.mainImg.trim(),
      category: form.category.trim(),    
      releaseDate: form.releaseDate || undefined,
      isTrending: form.isTrending,
    };
    

    try {
      setIsSaving(true);

      if (editing) {
        await apiUpdateGame(editing._id, payload);
        showToast("Game updated ✅");
      } else {
        await apiCreateGame(payload);
        showToast("Game created ✅");
      }

      setIsModalOpen(false);
      setEditing(null);
      setForm(emptyForm);
      apiGetGames();
    } catch (err: any) {
      showToast(err?.message || "Save failed ❌");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white px-6 pb-10 pt-24 md:pt-28">
      <style jsx global>{`
        input.no-spin::-webkit-outer-spin-button,
        input.no-spin::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input.no-spin[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>

      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-[#111]/50 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">
            Admin Catalog
          </h1>
          <p className="mt-2 text-white/30 text-xs font-bold uppercase tracking-widest">
            Manage games + storefront metadata (Trending / Release Date)
          </p>
        </div>

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
            onClick={openCreate}
            className="h-11 px-5 rounded-2xl bg-[#3DFF6B] text-black font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-green-400 transition"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </header>

      {/* Table */}
      <section className="max-w-7xl mx-auto bg-[#111] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
            {loading
              ? "Loading..."
              : `Showing ${filteredGames.length} of ${games.length}`}
          </p>
        </div>

        <div className="overflow-x-auto hidden lg:block">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-white/30">
                <th className="px-8 py-5">Game</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Price</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredGames.map((game) => {
                const newBadge = isNewRelease(game.releaseDate);
                const trendingBadge = Boolean(game.isTrending);

                return (
                  <tr key={game._id} className="hover:bg-white/5 transition">
                    <td className="px-8 py-6 flex items-center gap-4">
                      <img
                        src={
                          game.mainImg ||
                          "https://via.placeholder.com/96x128?text=IMG"
                        }
                        alt={game.title}
                        className="w-12 h-16 object-cover rounded-xl border border-white/10"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-black uppercase italic text-white">
                            {game.title}
                          </p>

                          {trendingBadge && (
                            <span className="px-2 py-1 rounded-full bg-[#3DFF6B] text-black text-[9px] font-black uppercase tracking-widest">
                              Trending
                            </span>
                          )}

                          {newBadge && (
                            <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15 text-white text-[9px] font-black uppercase tracking-widest">
                              New
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] text-white/20 truncate max-w-[520px]">
                          {game.description || "—"}
                        </p>

                        <p className="text-[10px] text-white/20">
                          ID: {game._id}
                        </p>
                      </div>
                    </td>

                    <td className="px-8 py-6 text-white/50 font-bold">
                      {game.category}
                    </td>

                    <td className="px-8 py-6 font-black text-[#3DFF6B]">
                      ${game.price?.toFixed?.(2) ?? game.price}
                    </td>

                    <td className="px-8 py-6 flex justify-end gap-3">
                      <button
                        onClick={() => openEdit(game)}
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#3DFF6B]/40"
                        title="Edit"
                        type="button"
                      >
                        <Edit2 className="w-4 h-4 text-white/40" />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(game)}
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/40"
                        title="Delete"
                        type="button"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {!loading && filteredGames.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
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
          {filteredGames.map((game) => {
            const newBadge = isNewRelease(game.releaseDate);
            const trendingBadge = Boolean(game.isTrending);

            return (
              <div
                key={game._id}
                className="bg-white/5 border border-white/10 rounded-3xl p-5 flex gap-4"
              >
                <img
                  src={
                    game.mainImg || "https://via.placeholder.com/96x128?text=IMG"
                  }
                  alt={game.title}
                  className="w-20 h-28 object-cover rounded-2xl"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black uppercase italic">{game.title}</h3>
                    {trendingBadge && (
                      <span className="px-2 py-1 rounded-full bg-[#3DFF6B] text-black text-[9px] font-black uppercase tracking-widest">
                        Trending
                      </span>
                    )}
                    {newBadge && (
                      <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15 text-white text-[9px] font-black uppercase tracking-widest">
                        New
                      </span>
                    )}
                  </div>

                  <p className="text-white/40 text-sm">{game.category}</p>
                  <p className="text-white/40 text-xs line-clamp-2 mt-1">
                    {game.description || "—"}
                  </p>

                  <p className="text-[#3DFF6B] font-black mt-2">
                    ${game.price?.toFixed?.(2) ?? game.price}
                  </p>

                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => openEdit(game)}
                      className="text-xs text-white/40 hover:text-white"
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(game)}
                      className="text-xs text-red-400 hover:text-red-300"
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ADD / EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-lg"
              onClick={() => setIsModalOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="relative z-10 w-full max-w-xl bg-[#111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-2rem)]"
              initial={{ y: 12, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 12, opacity: 0, scale: 0.98 }}
            >
              {/* Top bar (sticky) */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#111]/80 backdrop-blur-xl sticky top-0 z-10">
                <div>
                  <h2 className="text-xl font-black uppercase">
                    {editing ? "Edit Game" : "Add New Game"}
                  </h2>
                  <p className="mt-2 text-[10px] text-white/25 font-bold uppercase tracking-widest">
                    Includes storefront metadata (Trending / Release Date)
                  </p>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white"
                  title="Close"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={submitForm} className="flex flex-col min-h-0">
                {/* Body (scroll) */}
                <div className="p-6 overflow-y-auto min-h-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title */}
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                        Title
                      </label>
                      <input
                        value={form.title}
                        onChange={(e) => setField("title", e.target.value)}
                        placeholder="Halo Infinite"
                        className="mt-2 w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white outline-none focus:border-[#3DFF6B]/50 font-bold italic"
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                        Description
                      </label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setField("description", e.target.value)}
                        rows={4}
                        placeholder="Short description of the game..."
                        className="mt-2 w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white outline-none focus:border-[#3DFF6B]/50 text-sm resize-none"
                      />
                      <p className="mt-2 text-[10px] text-white/25 font-bold uppercase tracking-widest">
                        Recommended: 1–3 lines for catalog
                      </p>
                    </div>

                    {/* Price */}
                    <div>
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                        Price
                      </label>
                      <div className="mt-2 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3DFF6B] font-black">
                          $
                        </span>
                        <input
                          value={form.price}
                          onChange={(e) =>
                            setField("price", sanitizePriceInput(e.target.value))
                          }
                          inputMode="decimal"
                          placeholder="59.99"
                          className="no-spin w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-9 pr-4 text-white outline-none focus:border-[#3DFF6B]/50 font-black"
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                        Category
                      </label>
                      <input
                        value={form.category}
                        onChange={(e) => setField("category", e.target.value)}
                        placeholder="FPS"
                        className="mt-2 w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white outline-none focus:border-[#3DFF6B]/50 font-bold uppercase"
                      />
                    </div>

                    {/* Main Image */}
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                        Main Image URL
                      </label>
                      <input
                        value={form.mainImg}
                        onChange={(e) => setField("mainImg", e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="mt-2 w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white outline-none focus:border-[#3DFF6B]/50 text-xs font-mono"
                      />
                    </div>

                    {/* Release date */}
                    <div>
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                        Release Date
                      </label>
                      <input
                        type="date"
                        value={form.releaseDate}
                        onChange={(e) => setField("releaseDate", e.target.value)}
                        className="mt-2 w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white outline-none focus:border-[#3DFF6B]/50 font-bold"
                      />
                      <p className="mt-2 text-[10px] text-white/25 font-bold uppercase tracking-widest">
                        Used for “New Releases”
                      </p>
                    </div>

                    {/* Trending toggle */}
                    <div>
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                        Trending
                      </label>

                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setField("isTrending", true)}
                          className={`py-3 rounded-2xl border text-xs font-black uppercase tracking-widest transition ${
                            form.isTrending
                              ? "bg-[#3DFF6B] text-black border-[#3DFF6B]"
                              : "bg-white/5 text-white/60 border-white/10 hover:border-white/20"
                          }`}
                        >
                          Trending
                        </button>

                        <button
                          type="button"
                          onClick={() => setField("isTrending", false)}
                          className={`py-3 rounded-2xl border text-xs font-black uppercase tracking-widest transition ${
                            !form.isTrending
                              ? "bg-[#3DFF6B] text-black border-[#3DFF6B]"
                              : "bg-white/5 text-white/60 border-white/10 hover:border-white/20"
                          }`}
                        >
                          Normal
                        </button>
                      </div>
                    </div>

                    {/* Status (UI) */}
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                        Status (UI)
                      </label>

                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setField("status", "Published")}
                          className={`py-3 rounded-2xl border text-xs font-black uppercase tracking-widest transition ${
                            form.status === "Published"
                              ? "bg-[#3DFF6B] text-black border-[#3DFF6B]"
                              : "bg-white/5 text-white/60 border-white/10 hover:border-white/20"
                          }`}
                        >
                          Published
                        </button>

                        <button
                          type="button"
                          onClick={() => setField("status", "Draft")}
                          className={`py-3 rounded-2xl border text-xs font-black uppercase tracking-widest transition ${
                            form.status === "Draft"
                              ? "bg-[#3DFF6B] text-black border-[#3DFF6B]"
                              : "bg-white/5 text-white/60 border-white/10 hover:border-white/20"
                          }`}
                        >
                          Draft
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer (fixed) */}
                <div className="p-6 border-t border-white/10 bg-[#111]/80 backdrop-blur-xl flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="h-11 px-5 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-white/70 hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    disabled={isSaving}
                    type="submit"
                    className="h-11 px-6 rounded-2xl bg-[#3DFF6B] text-black font-black uppercase tracking-widest text-xs hover:bg-green-400 disabled:opacity-60"
                  >
                    {isSaving
                      ? "Saving..."
                      : editing
                      ? "Save Changes"
                      : "Create Game"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {isDeleteOpen && (
          <div className="fixed inset-0 z-[230] flex items-center justify-center p-4">
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

              <h2 className="text-xl font-black uppercase mb-3">Delete game?</h2>

              <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-8">
                Remove <span className="text-white">{gameToDelete?.title}</span>{" "}
                from catalog.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  className="py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase"
                  type="button"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="py-3 rounded-2xl bg-red-500 text-xs font-black uppercase"
                  type="button"
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
