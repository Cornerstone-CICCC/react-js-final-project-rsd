"use client";

import { useEffect, useState } from "react";
import { Shield, User, Heart, Library, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

type Me = {
  id: string;
  email: string;
  isAdmin: boolean;
  wishlistCount: number;
  ownedCount: number;
};

export default function ProfilePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/session/me", { cache: "no-store" });
        const data = await res.json();
        setMe(data?.user ?? null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" }).catch(() => {});
    router.push("/auth/sign-in");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white px-6 pb-12 pt-24 md:pt-28 overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Header card */}
        <div className="rounded-[2.5rem] border border-white/10 bg-[#0f0f0f]/60 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-[#3DFF6B]/15 border border-[#3DFF6B]/20 flex items-center justify-center shrink-0">
                <User className="w-7 h-7 text-[#3DFF6B]" />
              </div>

              <div className="min-w-0">
                <h1 className="text-3xl font-black tracking-tight">
                  Your Profile
                </h1>

                <p className="mt-1 text-white/35 text-sm truncate">
                  {loading
                    ? "Loading your account..."
                    : me
                    ? me.email
                    : "Not signed in"}
                </p>

                {!loading && me && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60">
                      Member
                    </span>
                    {me.isAdmin && (
                      <span className="px-3 py-1 rounded-full bg-[#3DFF6B] text-black text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5" />
                        Admin
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <button
                onClick={() => router.push("/library")}
                className="h-11 px-5 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-white/70 hover:text-white hover:border-white/20 transition inline-flex items-center gap-2 md:flex-none flex-1 justify-center"
                type="button"
              >
                <Library className="w-4 h-4" />
                Library
              </button>

              <button
                onClick={() => router.push("/wishlist")}
                className="h-11 px-5 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-white/70 hover:text-white hover:border-white/20 transition inline-flex items-center gap-2 md:flex-none flex-1 justify-center"
                type="button"
              >
                <Heart className="w-4 h-4" />
                Wishlist
              </button>

              <button
                onClick={handleLogout}
                className="h-11 px-5 rounded-2xl bg-[#3DFF6B] text-black text-xs font-black uppercase tracking-widest hover:bg-green-400 transition inline-flex items-center gap-2 md:flex-none flex-1 justify-center"
                type="button"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Owned games"
            value={loading ? "—" : me ? String(me.ownedCount) : "0"}
            icon={<Library className="w-5 h-5 text-[#3DFF6B]" />}
          />
          <StatCard
            title="Wishlist"
            value={loading ? "—" : me ? String(me.wishlistCount) : "0"}
            icon={<Heart className="w-5 h-5 text-[#3DFF6B]" />}
          />
          <StatCard
            title="Role"
            value={loading ? "—" : me ? (me.isAdmin ? "Admin" : "User") : "Guest"}
            icon={<Shield className="w-5 h-5 text-[#3DFF6B]" />}
          />
        </div>

        {/* Simple info section */}
        <div className="mt-6 rounded-[2.5rem] border border-white/10 bg-[#0f0f0f]/60 backdrop-blur-xl p-6 md:p-8">
          <h2 className="text-sm font-black uppercase tracking-widest text-white/60">
            Account info
          </h2>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow
              label="Email"
              value={loading ? "Loading..." : me?.email ?? "—"}
            />
            <InfoRow label="Status" value={me ? "Active" : "Guest"} />
            <InfoRow label="Plan" value="Free (School MVP)" />
            <InfoRow label="Theme" value="GAMEHUB Neon Dark" />
          </div>

          <p className="mt-6 text-white/30 text-xs">
            This is a simple profile page for the MVP. Purchases will appear in
            your Library once Stripe integration is completed.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#0f0f0f]/60 backdrop-blur-xl p-6">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
          {title}
        </p>
        <div className="w-10 h-10 rounded-2xl bg-[#3DFF6B]/10 border border-[#3DFF6B]/15 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className="mt-4 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-sm font-bold text-white/80 break-all">{value}</p>
    </div>
  );
}
