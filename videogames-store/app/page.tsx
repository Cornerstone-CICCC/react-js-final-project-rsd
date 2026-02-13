"use client";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "./store/toast";
import { Game, useWishlist } from "./store/wishlist";
import { useUser } from "./store/user";

export default function Home() {

  type Game = {
  _id: string;
  title: string;
  description: string;
  price: number;
  mainImg?: string;
  image?: string;
};

  const addToWishlist = useWishlist((state) => state.addToWishlist); const items = useWishlist((state) => state.items); 
  const [games, setGames] = useState<Game[]>([]);
  const showToast = useToast((state) => state.show);
  const user = useUser((s) => s.user);
  const setWishlist = useWishlist((s) => s.setItems);
  const trendingGames = games.slice(0, 5); 
  const topSellers = games.slice(5, 10); 
  const newReleases = games.slice(10, 16); 




  useEffect(() => {
    async function loadGames() {
      try {
        const res = await fetch("/api/games");
        const data = await res.json();
        setGames(data);
        console.log("Loaded games:", data);
      } catch (error) {
        console.error("Error loading games:", error);
      }
    }
    loadGames();
  }, []);

    useEffect(() => {
    async function loadWishlist() {
      if (!user?._id) return;

      const res = await fetch(`/api/wishlist?userId=${user._id}`);
      const data = await res.json();
      setWishlist(data);
    }

    loadWishlist();
  }, [user]);


  async function handleAddToWishlist(game: Game) {
  if (!user?._id) {
    showToast("You must be logged in");
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


  const heroGame: Game | undefined = games[0];
  const alreadyAdded = items.some((item) => item._id === heroGame?._id);
  return (
    
    <main className="min-h-screen bg-black text-white">

      <section className="relative h-[500px] w-full">
        <Image
          src={heroGame?.mainImg || "https://placehold.co/1200x500/png"}
          alt={heroGame?.title || "Game Image"}
          fill
          className="object-cover opacity-60"
          unoptimized
        />

        <div className="absolute inset-0 flex flex-col justify-center px-16">
          <h1 className="text-5xl font-extrabold mb-4">{heroGame?.title}</h1>
          <p className="text-zinc-300 max-w-xl mb-6">
            {heroGame?.description}
          </p>
          <div className="flex gap-4">
            <button onClick={() => {
              window.location.href = `/gamedetail/${heroGame?._id}`;
            }} className="px-6 py-3 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition">
              View More 
            </button>

             <button
                onClick={() => handleAddToWishlist(heroGame!)}
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

        <Section title={ <> Trending <span className="text-[#3DFF6B]">Now</span> </> }>
          <GameGrid games={trendingGames} />
        </Section>

        <Section title={ <> Top <span className="text-[#3DFF6B]">Sellers</span> </> }>
          <GameGrid games={topSellers}/>
        </Section>

        <Section title={ <> New <span className="text-[#3DFF6B]">Releases</span> </> }>
          <GameGrid games={newReleases}/>
        </Section>

       <div className="relative w-full rounded-xl overflow-hidden 
                bg-black border border-zinc-700 p-10">

          <img
            src="/img_banner.jpg"
            alt="Gaming Promo"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl font-extrabold text-white leading-tight mb-4">
              PLAY HUNDREDS OF{" "}
              <span className="text-[#3DFF6B]">HIGH‑QUALITY GAMES</span>
            </h2>


            <p className="text-zinc-300 text-lg mb-6">
              Join Game Pass today and play new titles on day one. Experience the best gaming value ever.
            </p>

            <div className="flex gap-4">
              <button className="px-6 py-3 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition">
                Subscribe
              </button>

              <button className="px-6 py-3 border border-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


type SectionProps = {
  title: React.ReactNode;
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

function GameGrid({ games }: { games?: Game[] }) {
  if (!games || games.length === 0) {
    return (
      <p className="text-zinc-500 text-lg">
        No games available
      </p>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      {games.map((g) => (
        <Link
          key={g._id}
          href={`/gamedetail/${g._id}`}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:bg-zinc-800 transition"
        >
          <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
            <Image
              src={g.mainImg || g.image || "https://placehold.co/300x200/png"}
              alt={g.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>


          <h3 className="text-lg font-semibold">{g.title}</h3>
          <p className="text-green-400 font-bold mt-1">${g.price}</p>
        </Link>
      ))}
    </div>
  );
}

