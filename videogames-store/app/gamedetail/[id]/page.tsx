"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { useWishlist } from "@/app/store/wishlist";
import { useToast } from "@/app/store/toast";
import { useCart } from "@/app/store/cart";
import { useParams } from "next/navigation";


type Game = {
  _id: string;
  title: string;
  description: string;
  price: number;
  mainImg?: string;
  images?: string[];
};

export default function GameDetail({ params }: { params: { id: string } }) {
  const { id } = useParams();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  const addToWishlist = useWishlist((s) => s.addToWishlist);
  const wishlistItems = useWishlist((s) => s.items);
  const showToast = useToast((s) => s.show);

  const addToCart = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);

  const alreadyAdded = wishlistItems.some((g) => g._id === game?._id);

  useEffect(() => {
    async function loadGame() {
      try {
        const res = await fetch(`/api/games/${id}`);
        const data = await res.json();
        setGame(data);
      } catch (err) {
        console.error("Error loading game:", err);
      } finally {
        setLoading(false);
      }
    }

    loadGame();
  }, [id]);

  if (loading) return <p className="text-white p-10">Loading...</p>;
  if (!game) return <p className="text-white p-10">Game not found</p>;

  return (
    <div className="min-h-screen bg-black text-white px-10 py-20">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        
        {/* LEFT SIDE — IMAGES */}
        <div>
          <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-zinc-800">
            <Image
              src={game.mainImg || "https://placehold.co/800x400/png"}
              alt={game.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            {(game.images || []).map((img, i) => (
              <Thumb key={i} src={img} />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE — INFO */}
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold">{game.title}</h1>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-green-400">${game.price}</span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                addToCart({
                  id: game._id,
                  title: game.title,
                  price: game.price,
                  imageImg: game.mainImg,
                  quantity: 1,
                });
                showToast("Added to cart ✓");
                openCart();
              }}
              className="px-6 py-3 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition"
            >
              Add to Cart
            </button>

            <button
              onClick={() => {
                addToWishlist(game);
                showToast("Added to wishlist ✓");
              }}
              disabled={alreadyAdded}
              className={`
                px-6 py-3 rounded-lg border transition
                ${alreadyAdded
                  ? "bg-green-500/20 border-green-500 text-green-400 animate-pulse cursor-default"
                  : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                }
              `}
            >
              {alreadyAdded ? "Added ✓" : "Add to Wishlist"}
            </button>
          </div>

          <p className="text-zinc-300 leading-relaxed">{game.description}</p>
        </div>
      </div>
    </div>
  );
}

function Thumb({ src }: { src: string }) {
  return (
    <div className="relative w-full h-[100px] rounded-lg overflow-hidden border border-zinc-800">
      <Image
        src={src}
        alt="Screenshot"
        fill
        className="object-cover"
        unoptimized
      />
    </div>
  );
}
