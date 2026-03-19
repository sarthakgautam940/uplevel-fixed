"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { brand } from "../../lib/brand.config";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function FAQ() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.05 });
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = ["All", ...Array.from(new Set(brand.faq.map((f) => f.category)))];
    return cats;
  }, []);

  const filtered = useMemo(() =>
    activeCategory === "All" ? brand.faq : brand.faq.filter((f) => f.category === activeCategory),
  [activeCategory]);

  return (
    <section
      ref={ref}
      id="faq"
      style={{
        padding: "clamp(80px, 10vw, 160px) clamp(24px, 5vw, 80px)",
        background: "var(--surface-1)",
      }}
    >
      <div style={{ maxWidth: 1360, margin: "0 auto" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 2fr",
          gap: 80, alignItems: "start",
        }} className="faq-grid">

          {/* Left */}
          <div style={{ position: "sticky", top: 100 }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}
            >
              <span style={{ width: 32, height: 1, background: "var(--accent)", opacity: 0.4, display: "block" }} />
              <span className="eyebrow">FAQ</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: "clamp(28px, 3.5vw, 48px)", letterSpacing: "-0.03em",
                lineHeight: 1.1, color: "var(--text-primary)", marginBottom: 28,
              }}
            >
              Questions<br />we get<br />a lot.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14, lineHeight: 1.75, color: "var(--text-secondary)",
                marginBottom: 32,
              }}
            >
              Still have questions? Book a free 15-minute call — we'll answer everything live.
            </motion.p>
            <motion.button
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="btn-primary"
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              style={{ fontSize: 11 }}
            >
              Book Free Call →
            </motion.button>

            {/* Category filter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: 0.35 }}
              style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 40 }}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
                  style={{
                    background: "none", border: "none", cursor: "none",
                    padding: "10px 0",
                    borderBottom: "1px solid var(--border-dim)",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 11, fontWeight: activeCategory === cat ? 700 : 400,
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    color: activeCategory === cat ? "var(--accent)" : "var(--text-dim)",
                    transition: "color 0.2s ease",
                    textAlign: "left",
                  }}
                >
                  {cat}
                  {activeCategory === cat && (
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
                  )}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Right — accordion */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.q}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.04, duration: 0.5 }}
                    style={{ borderBottom: "1px solid var(--border-dim)" }}
                  >
                    <button
                      onClick={() => setOpenIndex(openIndex === i ? null : i)}
                      style={{
                        width: "100%", background: "none", border: "none", cursor: "none",
                        padding: "24px 0",
                        display: "flex", alignItems: "flex-start",
                        justifyContent: "space-between", gap: 20, textAlign: "left",
                      }}
                    >
                      <span style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: openIndex === i ? 700 : 400,
                        fontSize: "clamp(15px, 1.5vw, 17px)",
                        lineHeight: 1.45, color: openIndex === i ? "var(--text-primary)" : "var(--text-secondary)",
                        transition: "color 0.2s, font-weight 0.2s",
                      }}>
                        {item.q}
                      </span>
                      <span style={{
                        width: 28, height: 28, borderRadius: 2, flexShrink: 0,
                        border: `1px solid ${openIndex === i ? "rgba(0,229,255,0.3)" : "var(--border-dim)"}`,
                        background: openIndex === i ? "rgba(0,229,255,0.07)" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: openIndex === i ? "var(--accent)" : "var(--text-dim)",
                        transition: "all 0.25s ease",
                        marginTop: 2,
                      }}>
                        {openIndex === i ? <Minus size={12} /> : <Plus size={12} />}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {openIndex === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          style={{ overflow: "hidden" }}
                        >
                          <p style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 300, fontSize: 15, lineHeight: 1.8,
                            color: "var(--text-secondary)",
                            paddingBottom: 28, paddingRight: 48,
                          }}>
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .faq-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
