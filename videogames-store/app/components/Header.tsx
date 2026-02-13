"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/app/store/cart";
import { Game } from "../store/wishlist";
import Image from "next/image";
import { useUser } from "../store/user";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const openCart = useCart((s) => s.open);
  const items = useCart((s) => s.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Game[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const user = useUser((s) => s.user);
  


  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
  async function loadGames() {
    try {
      const res = await fetch("/api/games");
      const data = await res.json();
      setGames(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading games:", err);
    }
  }

  loadGames();
}, []);


  useEffect(() => {
  if (!query.trim()) {
    setSuggestions([]);
    return;
  }

  if (!games || games.length === 0) {
    setSuggestions([]);
    return;
  }

  const filtered = games.filter((g) =>
    g.title.toLowerCase().startsWith(query.toLowerCase())
  );


  setSuggestions(filtered.slice(0, 5));
}, [query, games]);

  useEffect(() => {
    function handleClickOutside() {
      setShowSuggestions(false);
    }

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);


  return (
    <nav
      className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${scrolled
          ? "bg-black/70 backdrop-blur-xl border-b border-zinc-800"
          : "bg-transparent border-b border-transparent"
        }
      `}
    >
      <div className="px-10 py-4 flex items-center justify-between">
        
        <Link
                  href="/"
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div className="w-8 h-8 bg-green-500/20 border border-green-500 rounded-lg rotate-45 
                                  flex items-center justify-center transition-all duration-300 
                                  group-hover:bg-green-500/30 group-hover:border-green-400">
                    <div className="-rotate-45 text-green-400 font-bold text-xl 
                                    transition-colors duration-300 group-hover:text-green-300">◆
                    </div>
                  </div>
                  <span className="text-white text-xl font-bold tracking-wide 
                                  transition-colors duration-300 group-hover:text-green-400">
                    GAMEHUB
                  </span>
        </Link>


        <div className="hidden md:flex items-center gap-10 text-zinc-300">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <Link href="/wishlist" className="hover:text-white transition">Wishlist</Link>
          <Link href="/library" className="hover:text-white transition">Library</Link>
          <Link href="/community" className="hover:text-white transition">Support</Link>
        </div>

        <div className="flex items-center gap-6">
          <div
            className="hidden md:flex items-center bg-zinc-900/40 border border-zinc-700/40 rounded-lg px-3 py-2 w-64 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Search size={18} className="text-zinc-500 mr-2" />
            <input
              type="text"
              placeholder="Search games..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              className="bg-transparent text-white placeholder-zinc-500 focus:outline-none w-full"
            />
            {showSuggestions && suggestions.length > 0 && (
            <div
              className="absolute left-0 right-0 top-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50 
                animate-slideDown
                overflow-hidden
              "
            >
              {suggestions.map((game) => (
                <Link
                  key={game._id}
                  href={`/gamedetail/${game._id}`}
                  onClick={() => {
                    setQuery("");
                    setShowSuggestions(false);
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-zinc-800 transition"
                >
                  <div className="relative w-10 h-10 rounded-md overflow-hidden">
                    <Image
                      src={game.mainImg || 'https://placehold.co/100x100/png'}
                      alt={game.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <span className="text-white text-sm">{game.title}</span>
                </Link>
              ))}
            </div>
          )}
          </div>


          <Heart size={22} className="text-zinc-400 hover:text-white cursor-pointer transition" />
          <div className="relative cursor-pointer" onClick={openCart}>
          <ShoppingCart
            size={22}
            className="text-zinc-400 hover:text-white transition"
          />

          {totalItems > 0 && (
            <span
              className="
                absolute -top-2 -right-2 
                bg-green-500 text-black text-xs font-bold 
                w-5 h-5 flex items-center justify-center 
                rounded-full shadow-lg
              "
            >
              {totalItems}
            </span>
          )}
        </div>


          {!user ? (
            <Link
              href="/auth/sign-in"
              className="flex items-center gap-2 bg-green-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-green-400 transition"
            >
              <User size={18} />
              Sign In
            </Link>
          ) : (
            <Link
              href="/profile"
              className="
                w-10 h-10 rounded-full bg-green-500/20 border border-green-500 
                flex items-center justify-center 
                text-green-400 hover:text-green-300
                hover:bg-green-500/30 hover:border-green-400
                transition
              "
            >
              <User size={18} />
</Link>

          )}

        </div>
      </div>
    </nav>
  );
}
