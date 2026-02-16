"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingCart, User, X } from "lucide-react";
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
  const logout = useUser((s) => s.logout);

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest(".user-menu")) {
        setUserMenuOpen(false);
      }
    }
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
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
    if (!query.trim()) return setSuggestions([]);

    const filtered = games.filter((g) =>
      g.title.toLowerCase().startsWith(query.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 5));
  }, [query, games]);

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`
          fixed top-0 left-0 w-full z-50 transition-all duration-300
          ${scrolled
            ? "bg-black/70 backdrop-blur-xl border-b border-zinc-800"
            : "bg-transparent border-b border-transparent"
          }
        `}
      >
        <div className="px-4 md:px-10 py-4 flex items-center justify-between gap-2 md:gap-4">

          <button
            className="md:hidden text-zinc-300 hover:text-white transition"
            onClick={() => setMenuOpen(true)}
          >
            <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h18M4 12h18M4 18h18" />
            </svg>
          </button>

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
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

          <div className="flex items-center gap-3 md:gap-6">

            {/* SEARCH DESKTOP */}
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
              <div className="absolute left-0 right-0 top-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-[9999] animate-slideDown overflow-visible">
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

            {/* SEARCH MOBILE ICON */}
            <button
              className="md:hidden text-zinc-300 hover:text-white transition"
              onClick={() => setMobileSearchOpen(true)}
            >
              <Search size={22} />
            </button>

            <Link href="/wishlist">
              <Heart size={22} className="text-zinc-400 hover:text-green-400 transition" />
            </Link>

            <div className="relative cursor-pointer" onClick={openCart}>
              <ShoppingCart size={22} className="text-zinc-400 hover:text-white transition" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                  {totalItems}
                </span>
              )}
            </div>

            {/* USER MENU */}
            {!user ? (
              <>
                <button
                  onClick={() => (window.location.href = "/auth/sign-in")}
                  className="md:hidden text-zinc-300 hover:text-white transition"
                >
                  <User size={22} />
                </button>

                <Link
                  href="/auth/sign-in"
                  className="hidden md:flex items-center gap-2 bg-green-500 text-black 
                             px-4 py-2 rounded-lg font-semibold hover:bg-green-400 transition"
                >
                  <User size={18} />
                  Sign In
                </Link>
              </>
            ) : (
              <div className="relative user-menu">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserMenuOpen((prev) => !prev);
                  }}
                  className="
                    w-9 h-9 md:w-10 md:h-10 rounded-full bg-green-500/20 border border-green-500 
                    flex items-center justify-center 
                    text-green-400 hover:text-green-300
                    hover:bg-green-500/30 hover:border-green-400
                    transition
                  "
                >
                  <User size={18} />
                </button>

                {userMenuOpen && (
                  <div
                    className="
                      absolute right-0 mt-3 w-40 md:w-44 bg-zinc-900 border border-zinc-700 
                      rounded-lg shadow-xl overflow-visible animate-fadeIn z-[9999]
                    "
                  >
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
                    >
                      Profile
                    </Link>

                    <button
                      onClick={async () => {
                        await fetch("/api/logout", { method: "POST" });
                        logout();
                        setUserMenuOpen(false);
                        window.location.href = "/";
                      }}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-64 bg-zinc-900 border-r border-zinc-700 p-6 animate-slideIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-white mb-6">Menu</h2>

            <div className="flex flex-col gap-4 text-zinc-300">
              <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link href="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link>
              <Link href="/library" onClick={() => setMenuOpen(false)}>Library</Link>
              <Link href="/community" onClick={() => setMenuOpen(false)}>Support</Link>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE SEARCH MODAL */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 md:hidden flex flex-col p-6">
          
          <button
            className="self-end text-zinc-400 hover:text-white transition mb-4"
            onClick={() => {
              setMobileSearchOpen(false);
              setQuery("");
            }}
          >
            <X size={28} />
          </button>

          {/* Search input */}
          <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-3 w-full relative">
            <Search size={20} className="text-zinc-500 mr-2" />
            <input
              type="text"
              placeholder="Search games..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent text-white placeholder-zinc-500 focus:outline-none w-full text-lg"
            />
          </div>

          {/* Suggestions */}
          <div className="mt-4 space-y-3">
            {suggestions.map((game) => (
              <Link
                key={game._id}
                href={`/gamedetail/${game._id}`}
                onClick={() => {
                  setMobileSearchOpen(false);
                  setQuery("");
                }}
                className="flex items-center gap-3 p-3 bg-zinc-900/60 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition"
              >
                <div className="relative w-12 h-12 rounded-md overflow-hidden">
                  <Image
                    src={game.mainImg || 'https://placehold.co/100x100/png'}
                    alt={game.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <span className="text-white text-base">{game.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
