"use client";

import Image from "next/image";
import { useWishlist } from "@/app/store/wishlist";
import { useToast } from "@/app/store/toast";
import { useCart } from "@/app/store/cart";

export default function GameDetail() {

  const addToWishlist = useWishlist((state) => state.addToWishlist); const items = useWishlist((state) => state.items); 
  const game = { id: "halo-infinite", title: "Halo Infinite", price: "$59.99", image: "https://placehold.co/800x400/png", }; 
  const alreadyAdded = items.some((g) => g.id === game.id);
  const showToast = useToast((state) => state.show);

  const addToCart = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);

  


  return (
    <div className="min-h-screen bg-black text-white px-10 py-20">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        
        <div>
          <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-zinc-800">
            <Image
              src="https://placehold.co/800x400/png"
              alt="Halo Infinite"
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <Thumb />
            <Thumb />
            <Thumb />
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold">Halo Infinite</h1>

          <div className="flex items-center gap-2 text-zinc-400">
            <span className="text-yellow-400 text-xl">★★★★☆</span>
            <span>(12,450 reviews)</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-green-400">$59.99</span>
            <span className="text-zinc-500 line-through">$69.99</span>
          </div>

          <div className="flex gap-4">
            <button
                onClick={() => {
                  addToCart({
                    id: game.id,
                    title: game.title,
                    price: 59.99,
                    image: game.image,
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

          <div className="space-y-2 text-zinc-300">
            <Feature text="Optimized for Xbox Series X|S" />
            <Feature text="Smart Delivery" />
            <Feature text="Online Multiplayer (2–24 players)" />
            <Feature text="68 Achievements" />
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Platforms</h3>
            <div className="flex gap-3">
              <Platform name="Xbox Series X|S" />
              <Platform name="Xbox One" />
              <Platform name="PC" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl space-y-6">
        <h2 className="text-2xl font-bold">About this game</h2>
        <p className="text-zinc-400 leading-relaxed">
          When all hope is lost and humanity’s fate hangs in the balance, the Master Chief
          is ready to confront the most ruthless foe he’s ever faced. Step inside the armor
          of humanity’s greatest hero to experience an epic adventure and finally explore
          the scale of the Halo ring itself.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-zinc-300 mt-8">
          <Meta label="Publisher" value="Xbox Game Studios" />
          <Meta label="Developer" value="343 Industries" />
          <Meta label="Release Date" value="Dec 8, 2021" />
          <Meta label="Rating" value="4.8" />
        </div>
      </div>
    </div>
  );
}


function Thumb() {
  return (
    <div className="relative w-full h-[100px] rounded-lg overflow-hidden border border-zinc-800">
      <Image
        src="https://placehold.co/300x200/png"
        alt="Screenshot"
        fill
        className="object-cover"
        unoptimized
      />
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return <div className="flex items-center gap-2">• <span>{text}</span></div>;
}

function Platform({ name }: { name: string }) {
  return (
    <span className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-lg text-sm">
      {name}
    </span>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-zinc-500">{label}</span>
      <p className="text-white font-semibold">{value}</p>
    </div>
  );
}
