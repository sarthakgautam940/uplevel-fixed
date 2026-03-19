"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { brand } from "../../lib/brand.config";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { ArrowRight, ExternalLink } from "lucide-react";

function CaseCard({ item, index, isVisible }: {
  item: typeof brand.gallery[0];
  index: number;
  isVisible: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const spanMap: Record<string, React.CSSProperties> = {
    large: { gridColumn: "span 2" },
    wide: { gridColumn: "span 2" },
    tall: { gridRow: "span 2" },
    small: {},
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: index % 2 === 0 ? -0.5 : 0.5 }}
      animate={isVisible ? { opacity: 1, y: 0, rotate: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={spanMap[item.span]}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="gallery"
    >
      <div style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border-mid)",
        overflow: "hidden", height: "100%", minHeight: 240,
        position: "relative", cursor: "none",
        transition: "border-color 0.3s ease",
        borderColor: hovered ? "rgba(0,229,255,0.25)" : undefined,
      }}>
        {/* Mock site preview */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, var(--void) 0%, var(--surface-3) 100%)`,
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Simulated browser chrome */}
          <div style={{
            height: 24, background: "rgba(255,255,255,0.03)",
            borderBottom: "1px solid var(--border-dim)",
            display: "flex", alignItems: "center", paddingLeft: 10, gap: 5,
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: "50%",
                background: i === 0 ? "#FF5F57" : i === 1 ? "#FEBC2E" : "#28C840",
                opacity: 0.6,
              }} />
            ))}
            <div style={{
              marginLeft: 10, height: 10, flex: 1, maxWidth: 200,
              background: "rgba(255,255,255,0.05)", borderRadius: 2,
            }} />
          </div>

          {/* Simulated site content */}
          <div style={{
            flex: 1, padding: "20px 16px",
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            <div style={{
              width: "60%", height: 8,
              background: "linear-gradient(90deg, rgba(0,229,255,0.15), rgba(0,229,255,0.05))",
              borderRadius: 2,
            }} />
            <div style={{
              width: "40%", height: 20,
              background: `linear-gradient(135deg, rgba(${item.materials.length > 2 ? "0,229,255" : "255,107,53"},0.12), transparent)`,
              borderRadius: 2,
            }} />
            <div style={{ width: "80%", height: 4, background: "rgba(255,255,255,0.04)", borderRadius: 1, marginTop: 4 }} />
            <div style={{ width: "65%", height: 4, background: "rgba(255,255,255,0.04)", borderRadius: 1 }} />
            <div style={{ width: "70%", height: 4, background: "rgba(255,255,255,0.04)", borderRadius: 1 }} />
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              <div style={{ width: 60, height: 14, background: "rgba(255,107,53,0.25)", borderRadius: 2 }} />
              <div style={{ width: 50, height: 14, background: "rgba(0,229,255,0.08)", borderRadius: 2 }} />
            </div>
          </div>
        </div>

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "absolute", inset: 0,
            background: "rgba(6,6,8,0.88)",
            display: "flex", flexDirection: "column",
            justifyContent: "flex-end", padding: "28px 24px",
          }}
        >
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 9, fontWeight: 600, letterSpacing: "0.18em",
            textTransform: "uppercase", color: "var(--accent)", marginBottom: 8,
          }}>
            {item.investment}
          </div>
          <h3 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 700,
            fontSize: 22, color: "var(--text-primary)",
            letterSpacing: "-0.02em", marginBottom: 8,
          }}>
            {item.title}
          </h3>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, lineHeight: 1.65, color: "var(--text-secondary)",
            marginBottom: 16,
          }}>
            {item.story}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {item.materials.map((m, i) => (
              <span key={i} className="tag" style={{ fontSize: 8 }}>{m}</span>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12, color: "var(--text-dim)",
            }}>
              {item.location} · {item.year} · {item.duration}
            </span>
          </div>
        </motion.div>

        {/* Always-visible card label */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "20px 24px",
          background: "linear-gradient(to top, rgba(6,6,8,0.85), transparent)",
          transition: "opacity 0.3s ease",
          opacity: hovered ? 0 : 1,
        }}>
          <div style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 700,
            fontSize: 18, color: "var(--text-primary)", letterSpacing: "-0.01em",
          }}>
            {item.title}
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12, color: "var(--text-dim)", marginTop: 2,
          }}>
            {item.location}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Results() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.05 });

  return (
    <section
      ref={ref}
      id="results"
      style={{
        padding: "clamp(80px, 10vw, 160px) clamp(24px, 5vw, 80px)",
        maxWidth: 1360, margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-end", flexWrap: "wrap", gap: 24,
        marginBottom: 56,
      }}>
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}
          >
            <span style={{ width: 32, height: 1, background: "var(--accent)", opacity: 0.4, display: "block" }} />
            <span className="eyebrow">Case Studies</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: "clamp(32px, 5vw, 60px)", letterSpacing: "-0.03em",
              lineHeight: 1.05, color: "var(--text-primary)",
            }}
          >
            Real clients.<br />Real results.
          </motion.h2>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: 14, lineHeight: 1.75, color: "var(--text-secondary)",
            maxWidth: 320,
          }}
        >
          Hover any card to see the story behind each build.
        </motion.p>
      </div>

      {/* Bento grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridAutoRows: "240px",
        gap: 2,
      }} className="results-grid">
        {brand.gallery.map((item, i) => (
          <CaseCard key={item.title} item={item} index={i} isVisible={isVisible} />
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .results-grid { grid-template-columns: 1fr 1fr !important; }
          .results-grid > * { grid-column: span 1 !important; grid-row: span 1 !important; }
        }
        @media (max-width: 600px) {
          .results-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
