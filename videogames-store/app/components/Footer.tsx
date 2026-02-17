export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-800 text-zinc-400 px-10 py-16 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-500/20 border border-green-500 rounded-lg rotate-45 flex items-center justify-center">
              <div className="-rotate-45 text-green-400 font-bold text-xl">◆</div>
            </div>
            <span className="text-white text-xl font-bold tracking-wide">GAMEHUB</span>
          </div>

          <p className="text-zinc-400 leading-relaxed">
            The ultimate destination for next-gen gaming. Discover, buy, and play
            the latest blockbusters and indie gems.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Store</h3>
          <ul className="space-y-2">
            <li className="hover:text-white transition cursor-pointer">Browse Games</li>
            <li className="hover:text-white transition cursor-pointer">Special Offers</li>
            <li className="hover:text-white transition cursor-pointer">Game Pass</li>
            <li className="hover:text-white transition cursor-pointer">New Releases</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            <li className="hover:text-white transition cursor-pointer">Help Center</li>
            <li className="hover:text-white transition cursor-pointer">Contact Us</li>
            <li className="hover:text-white transition cursor-pointer">Refund Policy</li>
            <li className="hover:text-white transition cursor-pointer">Safety</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            <li className="hover:text-white transition cursor-pointer">About Us</li>
            <li className="hover:text-white transition cursor-pointer">Careers</li>
            <li className="hover:text-white transition cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white transition cursor-pointer">Terms of Use</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between text-sm">
        <p className="text-zinc-500">
          © 2026 GameHub Store. All rights reserved.
        </p>

        <div className="flex gap-6 mt-4 md:mt-0 text-zinc-400">
          <span className="hover:text-white cursor-pointer transition">TWITTER</span>
          <span className="hover:text-white cursor-pointer transition">INSTAGRAM</span>
          <span className="hover:text-white cursor-pointer transition">DISCORD</span>
          <span className="hover:text-white cursor-pointer transition">YOUTUBE</span>
        </div>
      </div>
    </footer>
  );
}
