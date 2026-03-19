"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const TEXT = "WEBSITES THAT WORK WHILE YOU SLEEP · AI THAT BOOKS YOUR CALLS · SYSTEMS THAT SCALE · ";

export default function KineticText() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);

  return (
    <div
      ref={ref}
      style={{
        overflow: "hidden",
        padding: "64px 0",
        borderTop: "1px solid var(--border-dim)",
        borderBottom: "1px solid var(--border-dim)",
        background: "var(--surface-1)",
        position: "relative",
      }}
    >
      {/* Fade edges */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 200,
        background: "linear-gradient(90deg, var(--surface-1), transparent)",
        zIndex: 2, pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 200,
        background: "linear-gradient(-90deg, var(--surface-1), transparent)",
        zIndex: 2, pointerEvents: "none",
      }} />

      <motion.div style={{ x, display: "flex", whiteSpace: "nowrap" }}>
        {[...Array(4)].map((_, i) => (
          <span key={i} style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(40px, 7vw, 80px)",
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            color: "transparent",
            WebkitTextStroke: i % 2 === 0 ? "1px var(--accent)" : "1px rgba(0,229,255,0.2)",
            paddingRight: 60,
          }}>
            {TEXT}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
