import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import Manifesto from "@/components/Manifesto";
import KineticText from "@/components/KineticText";
import Services from "@/components/Services";
import Stats from "@/components/Stats";
import Process from "@/components/Process";
import Results from "@/components/Results";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import LeadCapture from "@/components/LeadCapture";
import Footer from "@/components/Footer";
import AIWidget from "@/components/AIWidget";
import ScrollProgress from "@/components/ScrollProgress";
import CustomCursor from "@/components/CustomCursor";
import NoiseOverlay from "@/components/NoiseOverlay";

export default function Home() {
  return (
    <>
      <div className="noise-overlay" />
      <div className="scanline" />
      <ScrollProgress />
      <CustomCursor />
      <main style={{ position: "relative", zIndex: 2 }}>
        <Navigation />
        <Hero />
        <TrustStrip />
        <Manifesto />
        <KineticText />
        <Services />
        <Stats />
        <Process />
        <Results />
        <Pricing />
        <Testimonials />
        <FAQ />
        <LeadCapture />
        <Footer />
        <AIWidget />
      </main>
    </>
  );
}
