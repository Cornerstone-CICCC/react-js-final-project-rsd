"use client";

import Image from "next/image";
import Link from "next/link";
import { useToast } from "./store/toast";
import { useWishlist } from "./store/wishlist";

export default function Home() {

  const addToWishlist = useWishlist((state) => state.addToWishlist); const items = useWishlist((state) => state.items); 
  const game = { id: "halo-infinite", title: "Halo Infinite", price: "$59.99", image: "https://placehold.co/800x400/png", }; 
  const alreadyAdded = items.some((g) => g.id === game.id);
  const showToast = useToast((state) => state.show);
  
  return (
    <main className="min-h-screen bg-black text-white">

      <section className="relative h-[500px] w-full">
        <Image
          src="https://placehold.co/1600x500/png"
          alt="Halo Infinite"
          fill
          className="object-cover opacity-60"
          unoptimized
        />

        <div className="absolute inset-0 flex flex-col justify-center px-16">
          <h1 className="text-5xl font-extrabold mb-4">HALO INFINITE</h1>
          <p className="text-zinc-300 max-w-xl mb-6">
            Experience the next chapter of Master Chief’s legendary saga.
          </p>

          <div className="flex gap-4">
            <button className="px-6 py-3 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition">
              Play Now
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
        </div>
      </section>

      <div className="px-16 py-12 space-y-16">

        <Section title="Trending Now">
          <GameGrid />
        </Section>

        <Section title="Top Sellers">
          <GameGrid />
        </Section>

        <Section title="New Releases">
          <GameGrid />
        </Section>

        <div className="bg-gradient-to-r from-green-600 to-green-400 p-10 rounded-xl text-black text-center">
          <h2 className="text-3xl font-bold mb-2">
            PLAY HUNDREDS OF HIGH-QUALITY GAMES
          </h2>
          <p className="mb-6">Join our subscription and unlock unlimited access.</p>

          <button className="px-6 py-3 bg-black text-green-400 font-semibold rounded-lg hover:bg-zinc-900 transition">
            Subscribe
          </button>
        </div>
      </div>
    </main>
  );
}


type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      {children}
    </section>
  );
}


function GameGrid() {
  const games = [
    { id: 1, title: "Forza Horizon 5", price: "$59.99" },
    { id: 2, title: "Cyberpunk 2077", price: "$49.99" },
    { id: 3, title: "Elden Ring", price: "$59.99" },
    { id: 4, title: "Starfield", price: "$69.99" },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {games.map((g) => (
        <Link
          key={g.id}
          href={`/gamedetail/${g.id}`}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:bg-zinc-800 transition"
        >
          <Image
            src="https://placehold.co/300x200/png"
            alt={g.title}
            width={300}
            height={200}
            className="rounded-lg mb-4"
            unoptimized
          />

          <h3 className="text-lg font-semibold">{g.title}</h3>
          <p className="text-green-400 font-bold mt-1">{g.price}</p>
        </Link>
      ))}
    </div>
  );
}
