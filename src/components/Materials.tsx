"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { brand } from "../../lib/brand.config";

function shuffleIndices(count: number): number[] {
  const arr = Array.from({ length: count }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Materials() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { ref: leftRef, isVisible: leftVisible } = useScrollReveal();
  const { ref: rightRef, isVisible: rightVisible } = useScrollReveal({ threshold: 0.1 });
  const swatchOrder = useMemo(() => shuffleIndices(brand.materials.length), []);

  return (
    <section id="materials" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--surface-1)" }} />

      <div className="container-wide relative">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
          {/* Left */}
          <motion.div
            ref={leftRef}
            initial={{ opacity: 0, x: -40 }}
            animate={leftVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2"
          >
            <div className="gold-line mb-4" />
            <span className="eyebrow">Materials &amp; Craftsmanship</span>
            <h2
              className="mt-4 text-[clamp(2rem,3.5vw,3rem)] font-normal leading-[1.1] tracking-[-0.03em]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "var(--text-primary)" }}
            >
              Built from the world&apos;s finest materials.
            </h2>
            <p className="mt-6 text-[16px] font-light leading-[1.7]" style={{ color: "var(--text-secondary)" }}>
              From Utah quartzite to Murano glass tile. Teak decking to custom bronze fire bowls.
              Every specification chosen for performance in Utah&apos;s alpine climate.
            </p>
            <div className="mt-4 space-y-2">
              {["Utah quartzite & natural stone specialists", "In-person material sourcing trips", "30-year material lifespan guarantee"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  {/* Diamond bullet */}
                  <span style={{ color: "var(--warm)", opacity: 0.65, fontSize: "8px" }}>◆</span>
                  <span className="text-[14px]" style={{ color: "var(--text-secondary)" }}>{item}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="group flex items-center gap-2 mt-8 text-[13px] font-semibold transition-colors"
              style={{ color: "var(--warm)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--warm-light)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--warm)")}
            >
              Discuss your material preferences
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </motion.div>

          {/* Right — swatches */}
          <div ref={rightRef} className="lg:col-span-3">
            <div className="grid grid-cols-3 gap-3">
              {brand.materials.map((material, i) => {
                const staggerIndex = swatchOrder.indexOf(i);
                const isHovered = hoveredIndex === i;
                return (
                  <motion.div
                    key={material.name}
                    className="relative rounded-xl overflow-hidden cursor-pointer"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={rightVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: staggerIndex * 0.055, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{
                      aspectRatio: "1/1",
                      border: isHovered ? "1px solid rgba(196,154,76,0.6)" : "1px solid var(--border-dim)",
                      transform: isHovered ? "scale(1.06)" : "scale(1)",
                      boxShadow: isHovered ? `0 0 24px rgba(196,154,76,0.25), 0 16px 32px rgba(0,0,0,0.4)` : "none",
                      transition: "transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease",
                      position: "relative",
                      zIndex: isHovered ? 10 : 1,
                    }}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="w-full h-full" style={{ background: material.color, minHeight: "80px" }} />
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-end p-3"
                        style={{ background: "linear-gradient(to top, rgba(7,9,15,0.96) 0%, transparent 60%)" }}
                      >
                        <p className="text-[10px] font-semibold text-center leading-tight" style={{ color: "var(--text-primary)" }}>{material.name}</p>
                        <p className="text-[9px] mt-0.5 text-center" style={{ color: "var(--text-dim)" }}>{material.origin}</p>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
            <p className="text-center text-[11px] mt-4 tracking-[0.08em]" style={{ color: "var(--text-dim)" }}>
              Hover any material to learn more
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
