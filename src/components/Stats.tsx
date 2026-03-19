"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { brand } from "../../lib/brand.config";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useCountUp } from "../hooks/useCountUp";

function StatCard({ value, prefix, suffix, label, sub, delay, isVisible }: {
  value: number; prefix?: string; suffix?: string;
  label: string; sub: string; delay: number; isVisible: boolean;
}) {
  const count = useCountUp(value, 3500, isVisible);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        padding: "40px 0",
        borderRight: "1px solid var(--border-dim)",
        textAlign: "center", position: "relative",
      }}
    >
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,229,255,0.03), transparent)",
        opacity: 0, transition: "opacity 0.4s ease",
        pointerEvents: "none",
      }} className="stat-glow" />

      <div style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 800,
        fontSize: "clamp(40px, 5.5vw, 72px)", lineHeight: 1,
        letterSpacing: "-0.04em",
        background: "linear-gradient(135deg, var(--text-primary) 0%, rgba(0,229,255,0.7) 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        marginBottom: 10,
      }}>
        {prefix}{count}{suffix}
      </div>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 11, fontWeight: 600, letterSpacing: "0.16em",
        textTransform: "uppercase", color: "var(--text-secondary)",
        marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5,
      }}>
        {sub}
      </div>
    </motion.div>
  );
}

export default function Stats() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.2 });

  const stats = [
    { value: brand.stats.projects, suffix: "+", label: "Clients Served", sub: "And growing every month", delay: 0 },
    { value: brand.stats.satisfaction, suffix: "%", label: "Satisfaction Rate", sub: "Across all active accounts", delay: 0.1 },
    { value: 48, suffix: "hr", label: "Average Launch", sub: "From deposit to live site", delay: 0.2 },
    { value: brand.stats.avgRoi, suffix: "%", prefix: "", label: "Average ROI", sub: "Client-reported, year one", delay: 0.3 },
  ];

  return (
    <section
      ref={ref}
      style={{
        background: "var(--surface-1)",
        borderTop: "1px solid var(--border-dim)",
        borderBottom: "1px solid var(--border-dim)",
      }}
    >
      <div style={{
        maxWidth: 1360, margin: "0 auto",
        padding: "0 clamp(24px, 5vw, 80px)",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        }}>
          {stats.map((s, i) => (
            <StatCard key={i} {...s} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}
