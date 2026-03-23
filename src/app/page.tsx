import dynamic from "next/dynamic";
import Navbar from "@/components/dom/Navbar";
import HeroOverlay from "@/components/dom/HeroOverlay";
import Features from "@/components/dom/Features";
import ProblemCards from "@/components/dom/ProblemCards";
import WebGLCarousel from "@/components/dom/WebGLCarousel";
import ForCoaches from "@/components/dom/ForCoaches";
import Pricing from "@/components/dom/Pricing";
import FAQ from "@/components/dom/FAQ";
import Footer from "@/components/dom/Footer";

const Scene = dynamic(() => import("@/components/canvas/Scene"), { ssr: false });

export default function Home() {
  return (
    <main className="relative w-full min-h-screen selection:bg-[#00ff88] selection:text-black">
      <Scene />
      <div className="relative z-10 w-full pointer-events-none">
        <Navbar />
        <HeroOverlay />
        <Features />
        <WebGLCarousel />
        <ProblemCards />
        <ForCoaches />
        <Pricing />
        <FAQ />
        <Footer />
      </div>
    </main>
  );
}
