"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Mic, TrendingUp, Palette, ChevronDown, Check } from "lucide-react";
import { brand } from "../../lib/brand.config";
import { useScrollReveal } from "../hooks/useScrollReveal";

const ICONS: Record<string, React.ReactNode> = {
  Monitor: <Monitor size={20} />,
  Mic: <Mic size={20} />,
  TrendingUp: <TrendingUp size={20} />,
  Palette: <Palette size={20} />,
};

function ServiceCard({ service, index, isVisible }: {
  service: typeof brand.services[0];
  index: number;
  isVisible: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glow: { x: 50, y: 50 } });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current!.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width;
    const cy = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (cy - 0.5) * -10,
      y: (cx - 0.5) * 10,
      glow: { x: cx * 100, y: cy * 100 },
    });
  };
  const onMouseLeave = () => setTilt({ x: 0, y: 0, glow: { x: 50, y: 50 } });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          background: "var(--surface-1)",
          border: "1px solid var(--border-mid)",
          padding: "40px 36px",
          cursor: "none",
          position: "relative",
          overflow: "hidden",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
          transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Spotlight glow */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(circle at ${tilt.glow.x}% ${tilt.glow.y}%, rgba(0,229,255,0.05) 0%, transparent 60%)`,
          transition: "opacity 0.3s ease",
        }} />

        {/* Number */}
        <div style={{
          position: "absolute", top: 24, right: 28,
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: 56, lineHeight: 1,
          color: "rgba(0,229,255,0.04)",
          letterSpacing: "-0.04em",
        }}>
          {service.number}
        </div>

        {/* Icon */}
        <div style={{
          width: 44, height: 44, borderRadius: 4,
          background: "rgba(0,229,255,0.07)",
          border: "1px solid rgba(0,229,255,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--accent)", marginBottom: 24,
        }}>
          {ICONS[service.icon]}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700, fontSize: 22, lineHeight: 1.2,
          color: "var(--text-primary)", marginBottom: 14, letterSpacing: "-0.02em",
        }}>
          {service.title}
        </h3>

        {/* Body */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300, fontSize: 14, lineHeight: 1.75,
          color: "var(--text-secondary)", marginBottom: 24,
        }}>
          {service.body}
        </p>

        {/* Price */}
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 11, fontWeight: 600,
          letterSpacing: "0.1em", textTransform: "uppercase",
          color: "var(--warm)", marginBottom: 20,
        }}>
          {service.price}
        </div>

        {/* Expand button */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "none", border: "none", cursor: "none",
            display: "flex", alignItems: "center", gap: 8,
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 10, fontWeight: 600, letterSpacing: "0.16em",
            textTransform: "uppercase", color: "var(--text-dim)",
            padding: 0,
          }}
        >
          <span>{expanded ? "Hide" : "Deliverables"}</span>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <ChevronDown size={12} />
          </motion.span>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
            >
              <ul style={{
                marginTop: 20, display: "flex", flexDirection: "column", gap: 8,
                paddingTop: 20, borderTop: "1px solid var(--border-dim)",
              }}>
                {service.deliverables.map((d, i) => (
                  <li key={i} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13, color: "var(--text-secondary)",
                  }}>
                    <Check size={12} style={{ color: "var(--accent)", flexShrink: 0 }} />
                    {d}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom accent line */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, rgba(0,229,255,0.2), transparent)`,
          transform: `scaleX(${tilt.y !== 0 ? 1 : 0})`,
          transition: "transform 0.3s ease",
        }} />
      </div>
    </motion.div>
  );
}

export default function Services() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      id="services"
      style={{
        padding: "clamp(80px, 10vw, 160px) clamp(24px, 5vw, 80px)",
        maxWidth: 1360, margin: "0 auto", position: "relative",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 72 }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}
        >
          <span style={{ width: 32, height: 1, background: "var(--accent)", opacity: 0.4, display: "block" }} />
          <span className="eyebrow">What We Build</span>
        </motion.div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7 }}
            style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: "clamp(32px, 5vw, 60px)", lineHeight: 1.05,
              letterSpacing: "-0.03em", color: "var(--text-primary)",
              maxWidth: 500,
            }}
          >
            Four systems.<br />One machine.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
            style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
              fontSize: 14, lineHeight: 1.75, color: "var(--text-secondary)",
              maxWidth: 340,
            }}
          >
            We don't sell separate services. We build integrated revenue infrastructure — each component feeds the next.
          </motion.p>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 2,
      }}>
        {brand.services.map((service, i) => (
          <ServiceCard key={service.number} service={service} index={i} isVisible={isVisible} />
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5, duration: 0.7 }}
        style={{
          marginTop: 60, textAlign: "center",
          paddingTop: 40, borderTop: "1px solid var(--border-dim)",
        }}
      >
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14, color: "var(--text-dim)", marginBottom: 24,
        }}>
          All services available à la carte or as complete packages.
        </p>
        <button
          className="btn-primary"
          onClick={() => document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth" })}
        >
          See Pricing →
        </button>
      </motion.div>
    </section>
  );
}
