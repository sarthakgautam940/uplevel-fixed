"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { brand } from "../../lib/brand.config";

function WordReveal({ text, isVisible, className, style }: {
  text: string; isVisible: boolean;
  className?: string; style?: React.CSSProperties;
}) {
  const words = text.split(" ");
  return (
    <span className={className} style={{ ...style, display: "inline" }}>
      {words.map((word, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
          <motion.span
            initial={{ y: "110%", opacity: 0 }}
            animate={isVisible ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
            transition={{ delay: i * 0.04, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "inline-block" }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && <span style={{ display: "inline-block", width: "0.28em" }} />}
        </span>
      ))}
    </span>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} style={{
      padding: "clamp(100px, 14vw, 180px) clamp(24px, 5vw, 80px)",
      maxWidth: 1360, margin: "0 auto", position: "relative",
    }}>
      {/* Side label */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={visible ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.7 }}
        style={{
          position: "absolute", left: "clamp(24px, 5vw, 80px)", top: "clamp(100px, 14vw, 180px)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        }}
        className="hide-mobile"
      >
        <div style={{ width: 1, height: 60, background: "var(--border-mid)" }} />
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 9, fontWeight: 600, letterSpacing: "0.22em",
          textTransform: "uppercase", color: "var(--text-dim)",
          writingMode: "vertical-rl", transform: "rotate(180deg)",
        }}>
          Philosophy
        </span>
      </motion.div>

      <div style={{ maxWidth: 900, marginLeft: "auto", paddingLeft: "clamp(0px, 4vw, 80px)" }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}
        >
          <span style={{ width: 32, height: 1, background: "var(--accent)", opacity: 0.4, display: "block" }} />
          <span className="eyebrow">Our Belief</span>
        </motion.div>

        {/* Statement */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(2rem, 4.5vw, 4rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
          }}>
            <WordReveal
              text={brand.manifesto.statement}
              isVisible={visible}
              style={{ color: "var(--text-primary)" }}
            />
          </h2>
        </div>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300, fontSize: "clamp(15px, 1.5vw, 17px)",
            lineHeight: 1.8, color: "var(--text-secondary)",
            maxWidth: 600, borderLeft: "2px solid var(--border-mid)",
            paddingLeft: 24,
          }}
        >
          {brand.manifesto.body}
        </motion.p>

        {/* Highlight stat row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
          style={{
            display: "flex", flexWrap: "wrap", gap: 40, marginTop: 56,
            paddingTop: 40, borderTop: "1px solid var(--border-dim)",
          }}
        >
          {[
            { value: brand.stats.projects.toString() + "+", label: "Clients Served" },
            { value: brand.stats.satisfaction + "%", label: "Satisfaction Rate" },
            { value: "48hr", label: "Avg. Launch Time" },
          ].map((s, i) => (
            <div key={i}>
              <div style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1,
                color: "var(--text-primary)", marginBottom: 6,
              }}>
                {s.value}
              </div>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif", fontSize: 10,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "var(--text-dim)",
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <style>{`@media (max-width: 768px) { .hide-mobile { display: none !important; } }`}</style>
    </section>
  );
}
