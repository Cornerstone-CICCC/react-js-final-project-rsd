export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 pt-24">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl font-black uppercase tracking-tight">
          Support Center
        </h1>

        <p className="mt-4 text-white/40 text-sm font-medium leading-relaxed">
          Need help with your games, purchases, or account?
          <br />
          Our support team will be available soon.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button className="px-6 py-3 rounded-2xl bg-[#3DFF6B] text-black font-black uppercase tracking-widest text-xs hover:bg-green-400 transition">
            Contact Support
          </button>

          <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-black uppercase tracking-widest text-xs hover:bg-white/10 transition">
            FAQ
          </button>
        </div>
      </div>
    </div>
  );
}
