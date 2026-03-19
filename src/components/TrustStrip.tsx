"use client";

import { motion } from "framer-motion";

const items = [
  "WEBSITES", "AI SYSTEMS", "SEO", "BRANDING", "AUTOMATION",
  "LEAD GENERATION", "48-HOUR DELIVERY", "VOICE AI", "CONVERSION SYSTEMS",
  "WEBSITES", "AI SYSTEMS", "SEO", "BRANDING", "AUTOMATION",
  "LEAD GENERATION", "48-HOUR DELIVERY", "VOICE AI", "CONVERSION SYSTEMS",
];

const Dot = () => (
  <span style={{
    width: 3, height: 3, borderRadius: "50%",
    background: "var(--accent)", opacity: 0.4,
    display: "inline-block", flexShrink: 0, margin: "0 24px",
  }} />
);

export default function TrustStrip() {
  return (
    <div style={{
      borderTop: "1px solid var(--border-dim)",
      borderBottom: "1px solid var(--border-dim)",
      background: "rgba(0,229,255,0.02)",
      overflow: "hidden", position: "relative", zIndex: 2,
      padding: "18px 0",
    }}>
      <div className="marquee-track" style={{ width: "max-content" }}>
        {items.map((item, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 10, fontWeight: 600,
              letterSpacing: "0.22em", textTransform: "uppercase",
              color: "var(--text-dim)", whiteSpace: "nowrap",
            }}>
              {item}
            </span>
            <Dot />
          </span>
        ))}
      </div>
    </div>
  );
}
