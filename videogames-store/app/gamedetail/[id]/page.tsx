"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useWishlist } from "@/app/store/wishlist";
import { useToast } from "@/app/store/toast";
import { useCart } from "@/app/store/cart";
import { useParams } from "next/navigation";
import { useUser } from "@/app/store/user";

type Game = {
  _id: string;
  title: string;
  description: string;
  price: number;
  mainImg?: string;
  images?: string[];
};

export default function GameDetail() {
  const { id } = useParams();
  const user = useUser((s) => s.user);

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  const wishlistItems = useWishlist((s) => s.items);
  const setWishlist = useWishlist((s) => s.setItems);

  const showToast = useToast((s) => s.show);
  const addToCart = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);

  const alreadyAdded = wishlistItems.some((g) => g._id === game?._id);

  // Load game
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

  async function handleAddToWishlist() {
    if (!user?._id) {
      showToast("You must be logged in");
      return;
    }

    if (!game?._id) {
      showToast("Game not loaded yet");
      return;
    }

    try {
      const res = await fetch("/api/wishlist", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          gameId: game._id,
        }),
      });

      const updatedWishlist = await res.json();

      if (updatedWishlist.error) {
        console.error(updatedWishlist.error);
        showToast("Error adding to wishlist");
        return;
      }

      setWishlist(updatedWishlist);
      showToast("Added to wishlist ✓");
    } catch (err) {
      console.error(err);
      showToast("Error adding to wishlist");
    }
  }

  if (loading) return <p className="text-white p-10">Loading...</p>;
  if (!game) return <p className="text-white p-10">Game not found</p>;

  return (
    <div className="min-h-screen bg-black text-white px-10 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        
        <div>
          <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-zinc-800">
            <Image
              src={game.mainImg || "https://placehold.co/800x400/png"}
              alt={game.title}
              fill
              className="object-cover object-center"
              unoptimized
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            {(game.images || []).map((img, i) => (
              <Thumb key={i} src={img} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold">{game.title}</h1>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-green-400">${game.price}</span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                addToCart({
                  _id: game._id,
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
              onClick={handleAddToWishlist}
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
