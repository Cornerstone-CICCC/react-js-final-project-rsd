"use client";

import { useWishlist } from "@/app/store/wishlist";
import Image from "next/image";

export default function WishlistPage() {
  const items = useWishlist((state) => state.items);
  const remove = useWishlist((state) => state.removeFromWishlist);

  return (
    <div className="min-h-screen bg-black text-white px-10 py-20">
      <h1 className="text-3xl font-bold mb-10">Your Wishlist</h1>

      {items.length === 0 && (
        <p className="text-zinc-500">Your wishlist is empty.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((game) => (
          <div
            key={game.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
          >
            <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4">
              <Image
                src={game.image}
                alt={game.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <h2 className="text-lg font-semibold">{game.title}</h2>
            <p className="text-green-400 font-bold">{game.price}</p>

            <button
              onClick={() => remove(game.id)}
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
