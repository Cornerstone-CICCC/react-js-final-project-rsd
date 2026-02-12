"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/app/store/cart";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const openCart = useCart((s) => s.open);
  const items = useCart((s) => s.items);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500/20 border border-green-500 rounded-lg rotate-45 flex items-center justify-center">
            <div className="-rotate-45 text-green-400 font-bold text-xl">◆</div>
          </div>
          <span className="text-white text-xl font-bold tracking-wide">GAMEHUB</span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-zinc-300">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <Link href="/wishlist" className="hover:text-white transition">Wishlist</Link>
          <Link href="/library" className="hover:text-white transition">Library</Link>
          <Link href="/community" className="hover:text-white transition">Support</Link>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center bg-zinc-900/40 border border-zinc-700/40 rounded-lg px-3 py-2 w-64">
            <Search size={18} className="text-zinc-500 mr-2" />
            <input
              type="text"
              placeholder="Search games..."
              className="bg-transparent text-white placeholder-zinc-500 focus:outline-none w-full"
            />
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


          <Link
            href="/auth/sign-in"
            className="flex items-center gap-2 bg-green-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-green-400 transition"
          >
            <User size={18} />
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}
