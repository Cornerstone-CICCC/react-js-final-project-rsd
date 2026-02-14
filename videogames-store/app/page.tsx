"use client";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "./store/toast";
import { Game, useWishlist } from "./store/wishlist";
import { useUser } from "./store/user";
import { useCart } from "./store/cart";




export default function Home() {


  const addToWishlist = useWishlist((state) => state.addToWishlist); const items = useWishlist((state) => state.items); 
  const [games, setGames] = useState<Game[]>([]);
  const showToast = useToast((state) => state.show);
  const user = useUser((s) => s.user);
  const setWishlist = useWishlist((s) => s.setItems);
  const trendingGames = games.slice(0, 8); 
  const topSellers = games.slice(8, 16); 
  const newReleases = games.slice(16, 24);
  const herogames = games.slice(0, 4); 




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

  const setUserCart = useCart((s) => s.setUser); 
  useEffect(() => { 
    if (!user?._id) return; 
    const newKey = `cart-${user._id}`; 
    useCart.persist.setOptions({ name: newKey });  
    const saved = localStorage.getItem(newKey); 
    if (saved) { useCart.setState(JSON.parse(saved).state); } 
    setUserCart(user._id); 
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

      <HeroCarousel
        games={herogames}
       handleAddToWishlist={handleAddToWishlist}
        wishlistItems={items}
      />
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
function HeroCarousel({
  games,
  handleAddToWishlist,
  wishlistItems
}: {
  games: Game[];
  handleAddToWishlist: (g: Game) => void;
  wishlistItems: Game[];
}) {
  if (!games || games.length === 0) {
    return (
      <section className="relative h-[500px] w-full bg-zinc-900 flex items-center justify-center">
        <p className="text-zinc-500">Loading...</p>
      </section>
    );
  }

  const [index, setIndex] = useState(0);
  const current = games[index];

  const alreadyAdded = wishlistItems.some((i) => i._id === current?._id);

  const next = () => setIndex((i) => (i + 1) % games.length);
  const prev = () => setIndex((i) => (i - 1 + games.length) % games.length);

    useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % games.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [games.length]);


  return (
    <section className="relative h-[500px] w-full overflow-hidden">

      <div className="absolute inset-0 transition-all duration-700">
        <Image
          key={current.mainImg}
          src={current.mainImg || "https://placehold.co/1200x500/png"}
          alt={current.title}
          fill
          className="object-cover opacity-60 z-0"
          unoptimized
        />
      </div>

      <div className="absolute inset-0 flex flex-col justify-center px-16">
        <h1 className="text-5xl font-extrabold mb-4">{current.title}</h1>
        <p className="text-zinc-300 max-w-xl mb-6">{current.description}</p>

        <div className="flex gap-4">
          <button
            onClick={() => (window.location.href = `/gamedetail/${current._id}`)}
            className="px-6 py-3 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition"
          >
            View More
          </button>

          <button
            onClick={() => handleAddToWishlist(current)}
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

        <div className="absolute inset-x-0 bottom-6 px-6 flex items-center justify-between pointer-events-none">
          <div className="flex-1 flex justify-center gap-2 pointer-events-auto">
            {games.map((_, i) => (
              <div
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full cursor-pointer transition ${
                  i === index ? "bg-green-500" : "bg-zinc-500/50"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3 pointer-events-auto hero-buttons">
            <button
              onClick={prev}
              className="w-10 h-10 bg-zinc-900/60 border border-zinc-700 rounded-full flex items-center justify-center hover:bg-zinc-800 transition"
            >
              ‹
            </button>

            <button
              onClick={next}
              className="w-10 h-10 bg-zinc-900/60 border border-zinc-700 rounded-full flex items-center justify-center hover:bg-zinc-800 transition"
            >
              ›
            </button>
          </div>
        </div>

    </section>
  );
}



