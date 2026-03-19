"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { brand } from "../../lib/brand.config";
import { Clock, User, Building2, ChevronRight } from "lucide-react";

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      style={{
        padding: "clamp(80px, 10vw, 160px) clamp(24px, 5vw, 80px)",
        maxWidth: 1360, margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 72 }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}
        >
          <span style={{ width: 32, height: 1, background: "var(--accent)", opacity: 0.4, display: "block" }} />
          <span className="eyebrow">How We Work</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(32px, 5vw, 60px)", letterSpacing: "-0.03em",
            lineHeight: 1.05, color: "var(--text-primary)",
          }}
        >
          From zero to live<br />in 5 steps.
        </motion.h2>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 60, alignItems: "start",
      }} className="process-grid">

        {/* Step list */}
        <div>
          {brand.process.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -30 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              onClick={() => setActiveStep(i)}
              style={{
                padding: "24px 28px",
                borderLeft: activeStep === i ? "2px solid var(--accent)" : "2px solid var(--border-dim)",
                marginBottom: 4,
                background: activeStep === i ? "rgba(0,229,255,0.03)" : "transparent",
                cursor: "none",
                transition: "all 0.3s ease",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <span style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 800,
                  fontSize: 40, lineHeight: 1, letterSpacing: "-0.04em",
                  color: activeStep === i ? "rgba(0,229,255,0.15)" : "rgba(255,255,255,0.04)",
                  transition: "color 0.3s ease",
                  minWidth: 56,
                }}>
                  {step.step}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 9, fontWeight: 600, letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: activeStep === i ? "var(--accent)" : "var(--text-dim)",
                    marginBottom: 4, transition: "color 0.3s ease",
                  }}>
                    {step.label}
                  </div>
                  <div style={{
                    fontFamily: "'Syne', sans-serif", fontWeight: 700,
                    fontSize: 18, color: activeStep === i ? "var(--text-primary)" : "var(--text-secondary)",
                    transition: "color 0.3s ease",
                  }}>
                    {step.title}
                  </div>
                </div>
                <ChevronRight
                  size={14}
                  style={{
                    color: activeStep === i ? "var(--accent)" : "var(--text-dim)",
                    transform: activeStep === i ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "all 0.3s ease",
                    flexShrink: 0,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail panel */}
        <div style={{ position: "sticky", top: 100 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--border-mid)",
                padding: "40px 36px",
              }}
            >
              {/* Step header */}
              <div style={{
                display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                marginBottom: 24, paddingBottom: 24,
                borderBottom: "1px solid var(--border-dim)",
              }}>
                <div>
                  <span className="eyebrow" style={{ display: "block", marginBottom: 8 }}>
                    {brand.process[activeStep].label}
                  </span>
                  <h3 style={{
                    fontFamily: "'Syne', sans-serif", fontWeight: 700,
                    fontSize: 26, letterSpacing: "-0.02em",
                    color: "var(--text-primary)", lineHeight: 1.2,
                  }}>
                    {brand.process[activeStep].title}
                  </h3>
                </div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 12px",
                  background: "rgba(255,107,53,0.08)",
                  border: "1px solid rgba(255,107,53,0.2)",
                }}>
                  <Clock size={11} style={{ color: "var(--warm)" }} />
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 10, fontWeight: 600, letterSpacing: "0.12em",
                    color: "var(--warm)",
                  }}>
                    {brand.process[activeStep].duration}
                  </span>
                </div>
              </div>

              {/* Body */}
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300, fontSize: 15, lineHeight: 1.75,
                color: "var(--text-secondary)", marginBottom: 28,
              }}>
                {brand.process[activeStep].body}
              </p>

              {/* Breakdown */}
              <div style={{ marginBottom: 28 }}>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 9, fontWeight: 600, letterSpacing: "0.18em",
                  textTransform: "uppercase", color: "var(--text-dim)",
                  marginBottom: 12,
                }}>
                  What happens
                </div>
                {brand.process[activeStep].weeklyBreakdown.map((item, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 0",
                    borderBottom: "1px solid var(--border-dim)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13, color: "var(--text-secondary)",
                  }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: "50%",
                      background: "rgba(0,229,255,0.07)",
                      border: "1px solid rgba(0,229,255,0.12)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 9, fontWeight: 700,
                      color: "var(--accent)",
                    }}>
                      {i + 1}
                    </span>
                    {item}
                  </div>
                ))}
              </div>

              {/* Roles */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { icon: <User size={12} />, label: "Your role", text: brand.process[activeStep].clientRole },
                  { icon: <Building2 size={12} />, label: "Our role", text: brand.process[activeStep].meridianRole },
                ].map((r, i) => (
                  <div key={i} style={{
                    padding: "14px 16px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border-dim)",
                  }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 6,
                      marginBottom: 8,
                    }}>
                      <span style={{ color: "var(--accent)" }}>{r.icon}</span>
                      <span style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 9, fontWeight: 600, letterSpacing: "0.16em",
                        textTransform: "uppercase", color: "var(--text-dim)",
                      }}>
                        {r.label}
                      </span>
                    </div>
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12, lineHeight: 1.6, color: "var(--text-secondary)",
                    }}>
                      {r.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress indicator */}
          <div style={{
            display: "flex", gap: 6, marginTop: 16, justifyContent: "center",
          }}>
            {brand.process.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                style={{
                  width: activeStep === i ? 24 : 6,
                  height: 4,
                  background: activeStep === i ? "var(--accent)" : "var(--border-mid)",
                  border: "none", cursor: "none",
                  transition: "all 0.3s ease",
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .process-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
