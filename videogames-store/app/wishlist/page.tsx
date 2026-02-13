"use client";

import { useWishlist } from "@/app/store/wishlist";
import Image from "next/image";
import { useUser } from "../store/user";
import { useEffect } from "react";

export default function WishlistPage() {
  const user = useUser((s) => s.user);
  const items = useWishlist((s) => s.items);
  const setItems = useWishlist((s) => s.setItems);

  // Load wishlist from backend
  useEffect(() => {
    if (!user?._id) return;

    async function loadWishlist() {
      const res = await fetch(`/api/wishlist?userId=${user?._id}`);
      const data = await res.json();
      setItems(data);
    }

    loadWishlist();
  }, [user]);

  // Remove from wishlist (API + Zustand)
  async function handleRemove(gameId: string) {
    if (!user?._id) return;

    const res = await fetch("/api/wishlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,
        gameId,
      }),
    });

    const updatedWishlist = await res.json();
    setItems(updatedWishlist); // Sync Zustand with backend
  }

  return (
    <div className="min-h-screen bg-black text-white px-10 py-20">
      <h1 className="text-3xl font-bold mb-10">Your Wishlist</h1>

      {items.length === 0 && (
        <p className="text-zinc-500">Your wishlist is empty.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((game) => (
          <div
            key={game._id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
          >
            <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4">
              <Image
                src={game.mainImg || game.image || "https://placehold.co/400x200/png"}
                alt={game.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <h2 className="text-lg font-semibold">{game.title}</h2>
            <p className="text-green-400 font-bold">${game.price}</p>

            <button
              onClick={() => handleRemove(game._id)}
              className="mt-4 w-full bg-red-500/20 border border-red-500 text-red-400 py-2 rounded-lg hover:bg-red-500/30 transition"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
