import Link from "next/link";

export default function ForCoachesPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05080f]">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">For Coaches</h1>
        <p className="text-gray-400 mb-6">Coach resources coming soon.</p>
        <Link href="/" className="text-[#00ff88] hover:underline">Back to Home</Link>
      </div>
    </div>
  );
}
