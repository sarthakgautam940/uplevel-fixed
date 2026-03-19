"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star } from "lucide-react";
import { brand } from "../../lib/brand.config";
import { useScrollReveal } from "../hooks/useScrollReveal";

function TestimonialCard({ item, index, isVisible }: {
  item: typeof brand.testimonials[0];
  index: number;
  isVisible: boolean;
}) {
  const rotations = [-2, 1.5, -1];
  const rot = rotations[index % rotations.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotate: rot * 2 }}
      animate={isVisible ? { opacity: 1, y: 0, rotate: rot } : {}}
      transition={{ delay: index * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ rotate: 0, y: -8, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border-mid)",
        padding: "36px 32px",
        cursor: "none",
        position: "relative",
      }}
    >
      {/* Stars */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={12} fill="var(--warm)" style={{ color: "var(--warm)" }} />
        ))}
      </div>

      {/* Quote */}
      <div style={{
        position: "absolute", top: 28, right: 28,
        fontFamily: "'Syne', sans-serif", fontWeight: 800,
        fontSize: 60, lineHeight: 1,
        color: "rgba(0,229,255,0.06)",
      }}>
        "
      </div>

      <blockquote style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 300, fontSize: 15, lineHeight: 1.8,
        color: "var(--text-secondary)", marginBottom: 28,
        fontStyle: "italic",
      }}>
        "{item.quote}"
      </blockquote>

      {/* Attribution */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "rgba(0,229,255,0.08)",
          border: "1px solid rgba(0,229,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Syne', sans-serif", fontWeight: 700,
          fontSize: 12, color: "var(--accent)",
        }}>
          {item.initials}
        </div>
        <div>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600, fontSize: 14, color: "var(--text-primary)",
          }}>
            {item.name}
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11, color: "var(--text-dim)",
          }}>
            {item.project}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      id="testimonials"
      style={{
        padding: "clamp(80px, 10vw, 160px) clamp(24px, 5vw, 80px)",
        maxWidth: 1360, margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 72, maxWidth: 600 }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}
        >
          <span style={{ width: 32, height: 1, background: "var(--accent)", opacity: 0.4, display: "block" }} />
          <span className="eyebrow">Social Proof</span>
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
          Don't take<br />our word for it.
        </motion.h2>
      </div>

      {/* Cards — intentionally misaligned like Antonsson */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 20,
        alignItems: "start",
      }} className="testimonial-grid">
        {brand.testimonials.map((item, i) => (
          <TestimonialCard key={item.name} item={item} index={i} isVisible={isVisible} />
        ))}
      </div>

      {/* Featured full-width testimonial */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.45, duration: 0.8 }}
        style={{
          marginTop: 40,
          background: "var(--surface-1)",
          border: "1px solid var(--border-mid)",
          padding: "48px clamp(28px, 5vw, 60px)",
          position: "relative", overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", left: "clamp(28px, 5vw, 60px)", top: 40,
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: 100, lineHeight: 1,
          color: "rgba(0,229,255,0.04)",
        }}>
          "
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 24 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} fill="var(--warm)" style={{ color: "var(--warm)" }} />
          ))}
        </div>

        <blockquote style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 500, fontSize: "clamp(20px, 2.5vw, 28px)",
          lineHeight: 1.45, letterSpacing: "-0.02em",
          color: "var(--text-primary)",
          maxWidth: 860, marginBottom: 32,
        }}>
          "{brand.featuredTestimonial.quote}"
        </blockquote>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(0,229,255,0.12), rgba(255,107,53,0.12))",
            border: "1px solid rgba(0,229,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Syne', sans-serif", fontWeight: 700,
            fontSize: 14, color: "var(--accent)",
          }}>
            {brand.featuredTestimonial.initials}
          </div>
          <div>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700, fontSize: 16, color: "var(--text-primary)",
            }}>
              {brand.featuredTestimonial.name}
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12, color: "var(--text-dim)",
            }}>
              {brand.featuredTestimonial.project}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Review grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.55 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 2, marginTop: 40,
        }}
      >
        {brand.realReviews.map((r, i) => (
          <div key={i} style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border-dim)",
            padding: "20px 20px",
          }}>
            <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
              {Array.from({ length: r.stars }).map((_, j) => (
                <Star key={j} size={10} fill="var(--warm)" style={{ color: "var(--warm)" }} />
              ))}
            </div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, lineHeight: 1.65, color: "var(--text-secondary)",
              marginBottom: 12, fontStyle: "italic",
            }}>
              "{r.text}"
            </p>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 9, fontWeight: 600, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "var(--accent)",
              marginBottom: 4,
            }}>
              {r.highlight}
            </div>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11, color: "var(--text-dim)",
            }}>
              — {r.name}
            </div>
          </div>
        ))}
      </motion.div>

      <style>{`
        @media (max-width: 900px) { .testimonial-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 600px) { .testimonial-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
