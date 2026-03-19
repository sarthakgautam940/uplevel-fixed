"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { brand } from "../../lib/brand.config";
import { useMagneticEffect } from "../hooks/useMagneticEffect";

// ── WebGL Signal Grid Canvas ─────────────────────────────────────
function SignalGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const vert = `
      attribute vec2 position;
      void main() { gl_Position = vec4(position, 0, 1); }
    `;
    const frag = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;

      float grid(vec2 uv, float spacing) {
        vec2 g = abs(fract(uv / spacing - 0.5) - 0.5) / fwidth(uv / spacing);
        return min(g.x, g.y);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        vec2 aspect = uv;
        aspect.x *= u_resolution.x / u_resolution.y;

        // Multiple grid layers
        float g1 = grid(aspect, 0.04);
        float g2 = grid(aspect, 0.2);

        float lineG1 = 1.0 - min(g1, 1.0);
        float lineG2 = 1.0 - min(g2, 1.0);

        // Mouse proximity glow
        vec2 m = vec2(u_mouse.x * u_resolution.x / u_resolution.y, u_mouse.y);
        float dist = length(aspect - m);
        float glow = 0.12 / (dist + 0.15);

        // Pulse wave
        float wave = sin(dist * 18.0 - u_time * 2.0) * 0.5 + 0.5;
        wave *= exp(-dist * 4.0);

        // Edge vignette
        vec2 centered = uv - 0.5;
        float vignette = 1.0 - dot(centered * 1.8, centered * 1.8);
        vignette = clamp(vignette, 0.0, 1.0);

        // Combine
        float intensity = (lineG1 * 0.04 + lineG2 * 0.12 + glow * 0.1 + wave * 0.06) * vignette;

        vec3 cyan = vec3(0.0, 0.9, 1.0);
        vec3 col = cyan * intensity;
        gl_FragColor = vec4(col, intensity * 0.9);
      }
    `;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uTime = gl.getUniformLocation(prog, "u_time");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const draw = (t: number) => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouse.current.x, 1 - mouse.current.y);
      gl.uniform1f(uTime, t / 1000);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

// ── Scramble eyebrow ─────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·×#@%";
function ScrambleText({ text, trigger }: { text: string; trigger: boolean }) {
  const [glyphs, setGlyphs] = useState(text.split("").map(c => ({ char: c, resolved: true })));

  useEffect(() => {
    if (!trigger) return;
    let frame: number;
    const start = performance.now();
    const STAGGER = 45, CYCLE = 600;
    const tick = () => {
      const now = performance.now() - start;
      setGlyphs(text.split("").map((final, i) => {
        const s = i * STAGGER, r = s + CYCLE;
        if (now < s) return { char: " ", resolved: false };
        if (now >= r) return { char: final, resolved: true };
        return { char: final === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)], resolved: false };
      }));
      if (now < (text.length - 1) * STAGGER + CYCLE + 50) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [trigger, text]);

  return (
    <span>
      {glyphs.map((g, i) => (
        <span key={i} style={{
          color: g.resolved ? "var(--accent)" : "rgba(0,229,255,0.5)",
          transition: g.resolved ? "color 0.2s" : "none",
          minWidth: g.char === " " ? "0.3em" : undefined, display: "inline-block",
        }}>
          {g.char}
        </span>
      ))}
    </span>
  );
}

// ── Headline reveal ───────────────────────────────────────────────
function HeadlineReveal({ lines, trigger }: { lines: string[]; trigger: boolean }) {
  return (
    <div style={{ overflow: "hidden" }}>
      {lines.map((line, i) => (
        <div key={i} style={{ overflow: "hidden" }}>
          <motion.div
            initial={{ y: "110%" }}
            animate={trigger ? { y: "0%" } : { y: "110%" }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(52px, 8.5vw, 130px)",
              lineHeight: 0.93,
              letterSpacing: "-0.03em",
              color: i === 2 ? "transparent" : "var(--text-primary)",
              WebkitTextStroke: i === 2 ? "1px rgba(0,229,255,0.5)" : "none",
              display: "block",
            }}
          >
            {line}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

// ── Count badge ───────────────────────────────────────────────────
function CountBadge({ value, label, trigger }: { value: number; label: string; trigger: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const dur = 3500, t0 = performance.now();
    const tick = () => {
      const t = Math.min((performance.now() - t0) / dur, 1);
      const e = 1 - Math.pow(1 - t, 4);
      setN(Math.round(e * value));
      if (t < 1) requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [trigger, value]);
  return (
    <div style={{
      position: "absolute", right: 40, bottom: 80,
      width: 100, height: 100, borderRadius: "50%",
      border: "1px solid rgba(0,229,255,0.2)",
      background: "rgba(6,6,8,0.7)",
      backdropFilter: "blur(16px)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 2,
    }}>
      <span style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 800,
        fontSize: 32, lineHeight: 1, color: "var(--text-primary)",
      }}>{n}</span>
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif", fontSize: 9,
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: "var(--text-dim)", textAlign: "center", lineHeight: 1.3,
      }}>{label}</span>
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const secRef = useRef<HTMLButtonElement>(null);
  const [entered, setEntered] = useState(false);

  useMagneticEffect(ctaRef, 0.4);
  useMagneticEffect(secRef, 0.3);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToWork = () => {
    document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        position: "relative", minHeight: "100svh",
        display: "flex", alignItems: "center",
        overflow: "hidden", background: "var(--void)",
      }}
    >
      {/* WebGL grid */}
      <SignalGrid />

      {/* Radial center glow */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%, -50%)",
        width: "60vw", height: "60vw",
        background: "radial-gradient(ellipse, rgba(0,229,255,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Corner accent lines */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: entered ? 1 : 0 }} transition={{ delay: 1.2, duration: 1 }}>
        {[{ x: 0, y: 0, rx: 0 }, { x: "calc(100% - 24px)", y: 0, rx: 0 }, { x: 0, y: "calc(100% - 24px)", rx: 0 }, { x: "calc(100% - 24px)", y: "calc(100% - 24px)", rx: 0 }].map((pos, i) => (
          <div key={i} style={{
            position: "absolute", ...pos as object,
            width: 24, height: 24,
            borderTop: i < 2 ? "1px solid rgba(0,229,255,0.2)" : "none",
            borderBottom: i >= 2 ? "1px solid rgba(0,229,255,0.2)" : "none",
            borderLeft: i % 2 === 0 ? "1px solid rgba(0,229,255,0.2)" : "none",
            borderRight: i % 2 !== 0 ? "1px solid rgba(0,229,255,0.2)" : "none",
          }} />
        ))}
      </motion.div>

      {/* Main content */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity, position: "relative", zIndex: 2, width: "100%" }}
      >
        <div style={{
          maxWidth: 1360, margin: "0 auto",
          padding: "100px clamp(24px, 5vw, 80px) 80px",
        }}>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={entered ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}
          >
            <div style={{ width: 40, height: 1, background: "var(--accent)", opacity: 0.4 }} />
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 10,
              fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase",
              color: "var(--text-dim)",
            }}>
              <ScrambleText text={brand.hero.eyebrow} trigger={entered} />
            </span>
          </motion.div>

          {/* Headline */}
          <div style={{ marginBottom: 40, maxWidth: 820 }}>
            <HeadlineReveal lines={brand.hero.headlineLines} trigger={entered} />
          </div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={entered ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
              fontSize: "clamp(15px, 1.6vw, 18px)", lineHeight: 1.65,
              color: "var(--text-secondary)", maxWidth: 540, marginBottom: 48,
            }}
          >
            {brand.hero.subtext}
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={entered ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.85, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16, marginBottom: 64 }}
          >
            <button ref={ctaRef} className="btn-primary" onClick={scrollToContact} style={{ fontSize: 11 }}>
              {brand.hero.ctaPrimary}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button ref={secRef} className="btn-secondary" onClick={scrollToWork} style={{ fontSize: 11 }}>
              {brand.hero.ctaSecondary}
            </button>
          </motion.div>

          {/* Trust micro-badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={entered ? { opacity: 1 } : {}}
            transition={{ delay: 1.1, duration: 0.8 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}
          >
            {[
              { label: "48-Hour Delivery", icon: "⚡" },
              { label: "Month-to-Month", icon: "🔓" },
              { label: "Virginia LLC · Est. 2024", icon: "✓" },
            ].map((b) => (
              <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12 }}>{b.icon}</span>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 10, fontWeight: 500,
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  color: "var(--text-dim)",
                }}>
                  {b.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Projects badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={entered ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 1.3, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ position: "absolute", right: "clamp(24px, 4vw, 60px)", bottom: 80, zIndex: 3 }}
        className="hide-mobile"
      >
        <div style={{
          width: 96, height: 96, borderRadius: "50%",
          border: "1px solid rgba(0,229,255,0.2)",
          background: "rgba(6,6,8,0.8)", backdropFilter: "blur(16px)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 3,
        }}>
          <span style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: 28, lineHeight: 1, color: "var(--text-primary)",
          }}>
            {brand.stats.projects}
          </span>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 8,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: "var(--text-dim)", textAlign: "center",
          }}>
            CLIENTS<br />SERVED
          </span>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={entered ? { opacity: 1 } : {}}
        transition={{ delay: 1.5, duration: 0.6 }}
        style={{
          position: "absolute", bottom: 32, left: "50%",
          transform: "translateX(-50%)", zIndex: 3,
        }}
        className="scroll-indicator"
      >
        <div className="scroll-indicator-line" />
        <span>scroll</span>
      </motion.div>

      <style>{`
        @media (max-width: 768px) { .hide-mobile { display: none !important; } }
      `}</style>
    </section>
  );
}
