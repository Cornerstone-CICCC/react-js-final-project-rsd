"use client";

import { useEffect } from "react";
import { useLibrary } from "@/app/store/library";
import { useUser } from "@/app/store/user";

export default function Library() {
  const user = useUser((s) => s.user);
  const games = useLibrary((s) => s.games);
  const setGames = useLibrary((s) => s.setGames);

  useEffect(() => {
    if (!user) return;

    async function loadLibrary() {
      try {
        const res = await fetch(`/api/user/${user?._id}/library`);
        const data = await res.json();
        setGames(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading library:", err);
      }
    }

    loadLibrary();
  }, [user, setGames]);

  return (
    <div className="min-h-screen bg-black text-white px-10 py-20">

      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold">MY COLLECTION</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game) => (
          <div
            key={game._id}
            className="relative bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden group"
          >
            <img
              src={game.mainImg}
              className="w-full h-48 object-cover opacity-90 group-hover:opacity-100 transition"
            />

            <span
              className={`
                absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-md
                bg-green-500/20 text-green-400 border border-green-500/30
              `}
            >
              INSTALLED
            </span>

            <div className="p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{game.title}</h2>
                <p className="text-xs text-zinc-500 mt-1">
                  LAST: Never
                </p>
              </div>

              <button className="text-green-400 hover:text-green-300 text-2xl">
                ★
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
          <p className="text-zinc-500 text-sm">Total Playtime</p>
          <p className="text-2xl font-bold">1,245 HRS</p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
          <p className="text-zinc-500 text-sm">Achievements</p>
          <p className="text-2xl font-bold">842 / 1200</p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
          <p className="text-zinc-500 text-sm">Library Value</p>
          <p className="text-2xl font-bold">
            ${games.reduce((acc, g) => acc + g.price, 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
