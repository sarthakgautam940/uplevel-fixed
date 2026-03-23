import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-6 flex items-center justify-between pointer-events-none mix-blend-difference">
      <div className="text-2xl font-black tracking-tighter pointer-events-auto text-white">
        Smart<span className="text-[#00ff88]">Play</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wide uppercase pointer-events-auto text-gray-300">
        <Link href="#features" className="hover:text-[#00ff88] transition-colors">Features</Link>
        <Link href="#pricing" className="hover:text-[#00ff88] transition-colors">Pricing</Link>
        <Link href="/for-coaches" className="hover:text-[#00a3ff] transition-colors">For Coaches</Link>
      </div>

      <div className="flex items-center gap-4 pointer-events-auto">
        <Link href="/login" className="text-sm font-bold text-gray-300 hover:text-white transition-colors uppercase tracking-wide hidden md:block">Login</Link>
        <button className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#00ff88] transition-colors uppercase tracking-wide">
          Get Started
        </button>
      </div>
    </nav>
  );
}
