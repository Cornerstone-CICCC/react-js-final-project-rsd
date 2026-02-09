export default function SignUpPage() {
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

        <form className="space-y-5">
          <div>
            <label className="text-zinc-400 text-sm">EMAIL ADDRESS</label>
            <div className="mt-1 flex items-center bg-zinc-800 border border-zinc-700 rounded-lg px-3">
              <span className="text-zinc-500 mr-2">📧</span>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full bg-transparent py-2 text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-zinc-400 text-sm">PASSWORD</label>
            <div className="mt-1 flex items-center bg-zinc-800 border border-zinc-700 rounded-lg px-3">
              <span className="text-zinc-500 mr-2">🔒</span>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent py-2 text-white placeholder-zinc-500 focus:outline-none"
              />
              <span className="text-zinc-500 ml-2 cursor-pointer">👁️</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-400 transition text-black font-semibold py-2 rounded-lg mt-4"
          >
            JOIN NOW →
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
