"use client";
import { useState } from "react";


export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  const res = await fetch("/api/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userInfo: {
        email,
        password,
        isAdmin: false
      }
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    setError(data.error);
    setLoading(false);
    return;
  }

  window.location.href = "/auth/sign-in";
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-sm bg-zinc-900/60 backdrop-blur-xl p-10 rounded-xl border border-zinc-800 shadow-xl">
        
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-green-500/20 border border-green-500 rounded-lg rotate-45 flex items-center justify-center">
            <div className="-rotate-45 text-green-400 font-bold text-xl">◆</div>
          </div>
        </div>

        <h1 className="text-white text-2xl font-bold text-center">CREATE ACCOUNT</h1>
        <p className="text-zinc-400 text-center mt-1 mb-8">
          Join the elite gaming community
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-zinc-400 text-sm">EMAIL ADDRESS</label>

            <div className="relative mt-1 flex items-center bg-zinc-800 border border-zinc-700 rounded-lg px-3">

              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-zinc-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              </span>

              <input
                type="email"
                placeholder="name@example.com"
                className="w-full bg-transparent py-2 pl-10 pr-3 text-white placeholder-zinc-500 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>


          <div>
            <label className="text-zinc-400 text-sm">PASSWORD</label>

            <div className="relative mt-1 flex items-center bg-zinc-800 border border-zinc-700 rounded-lg px-3">

              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-zinc-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <rect x="5" y="10" width="14" height="10" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
              </span>

              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent py-2 pl-10 pr-10 text-white placeholder-zinc-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>

            </div>
          </div>


          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-400 transition text-black font-semibold py-2 rounded-lg mt-4"
          >
            {loading ? "CREATING..." : "JOIN NOW →"}
          </button>
        </form>

        <p className="text-center text-zinc-400 mt-6">
          Already a member?{" "}
          <a href="/auth/sign-in" className="text-green-400 hover:underline">
            LOGIN
          </a>
        </p>
      </div>
    </div>
  );
}
