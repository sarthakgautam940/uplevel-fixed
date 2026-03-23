"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "../ui/Button";

export default function HeroOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray('.anim-line');
      
      gsap.set(lines, { y: 100, opacity: 0 });
      gsap.set('.anim-fade', { opacity: 0, y: 20 });

      const tl = gsap.timeline({ delay: 0.5 });

      tl.to(lines, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out",
      })
      .to('.anim-fade', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      }, "-=0.5");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen flex flex-col items-center justify-center pt-20 px-6 pointer-events-none text-center">
      <div className="max-w-4xl mx-auto pointer-events-none">
        
        <div className="overflow-hidden mb-2">
          <h1 className="anim-line text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white">
            Train <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00a3ff]">smarter.</span>
          </h1>
        </div>
        <div className="overflow-hidden mb-2">
          <h1 className="anim-line text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white">
            Study harder.
          </h1>
        </div>
        <div className="overflow-hidden mb-6">
          <h1 className="anim-line text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white">
            Play at your peak.
          </h1>
        </div>

        <p className="anim-fade text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-light">
          The only operating system that balances your training load, academic stress, and recovery to maximize performance.
        </p>

        <div className="anim-fade flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
          <Button variant="primary" className="w-full sm:w-auto">I&apos;m an Athlete</Button>
          <Button variant="outline" className="w-full sm:w-auto">I&apos;m a Coach</Button>
        </div>

        <div className="anim-fade mt-16 flex items-center justify-center gap-8 text-sm font-mono text-gray-500 uppercase tracking-widest">
          <div className="flex flex-col items-center"><span className="text-[#00ff88] text-2xl font-bold mb-1">10k+</span> Athletes</div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="flex flex-col items-center"><span className="text-[#00a3ff] text-2xl font-bold mb-1">500+</span> Coaches</div>
        </div>

      </div>
    </section>
  );
}
