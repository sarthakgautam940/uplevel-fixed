"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { brand } from "../../lib/brand.config";
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function Pricing() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.05 });
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  const scrollToContact = () =>
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      ref={ref}
      id="pricing"
      style={{
        padding: "clamp(80px, 10vw, 160px) clamp(24px, 5vw, 80px)",
        position: "relative",
        background: "var(--void)",
      }}
    >
      <div style={{ maxWidth: 1360, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}
          >
            <span style={{ width: 32, height: 1, background: "var(--accent)", opacity: 0.4, display: "block" }} />
            <span className="eyebrow">Pricing</span>
            <span style={{ width: 32, height: 1, background: "var(--accent)", opacity: 0.4, display: "block" }} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: "clamp(32px, 5vw, 60px)", letterSpacing: "-0.03em",
              lineHeight: 1.05, color: "var(--text-primary)", marginBottom: 16,
            }}
          >
            Transparent pricing.<br />No surprises.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15, color: "var(--text-secondary)", maxWidth: 480, margin: "0 auto 32px",
            }}
          >
            All tiers include 48-hour delivery, custom code, and month-to-month contracts. No long-term lock-in.
          </motion.p>
        </div>

        {/* Pricing grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 2,
          alignItems: "stretch",
        }}>
          {brand.pricingTiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: "relative" }}
            >
              {tier.badge && (
                <div style={{
                  position: "absolute", top: -12, left: "50%",
                  transform: "translateX(-50%)",
                  padding: "4px 14px",
                  background: tier.isHighlighted ? "var(--accent)" : "var(--warm)",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: tier.isHighlighted ? "var(--void)" : "#fff",
                  whiteSpace: "nowrap", zIndex: 2,
                }}>
                  {tier.badge}
                </div>
              )}

              <div style={{
                background: tier.isHighlighted ? "var(--surface-2)" : "var(--surface-1)",
                border: tier.isHighlighted
                  ? "1px solid rgba(0,229,255,0.3)"
                  : "1px solid var(--border-dim)",
                padding: "40px 32px 36px",
                height: "100%",
                display: "flex", flexDirection: "column",
                boxShadow: tier.isHighlighted ? "0 0 48px rgba(0,229,255,0.06)" : "none",
              }}>
                {/* Tier name */}
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: tier.isHighlighted ? "var(--accent)" : "var(--text-dim)",
                  marginBottom: 10,
                }}>
                  {tier.name}
                </div>

                {/* Price */}
                <div style={{ marginBottom: 8 }}>
                  <span style={{
                    fontFamily: "'Syne', sans-serif", fontWeight: 800,
                    fontSize: "clamp(28px, 3.5vw, 40px)", letterSpacing: "-0.03em",
                    color: "var(--text-primary)", lineHeight: 1,
                  }}>
                    {tier.setup}
                  </span>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12, color: "var(--text-dim)", marginLeft: 6,
                  }}>
                    setup
                  </span>
                </div>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 13, color: "var(--warm)", fontWeight: 500,
                  marginBottom: 16,
                }}>
                  + {tier.monthly}
                </div>

                {/* Description */}
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13, lineHeight: 1.65, color: "var(--text-secondary)",
                  marginBottom: 28, paddingBottom: 28,
                  borderBottom: "1px solid var(--border-dim)",
                }}>
                  {tier.description}
                </p>

                {/* Features */}
                <ul style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                  {tier.features.map((f, fi) => (
                    <li key={fi} style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13, lineHeight: 1.5,
                      color: f.startsWith("Everything") ? "var(--text-dim)" : "var(--text-secondary)",
                      fontStyle: f.startsWith("Everything") ? "italic" : "normal",
                    }}>
                      <Check
                        size={12}
                        style={{
                          color: tier.isHighlighted ? "var(--accent)" : "var(--text-dim)",
                          flexShrink: 0, marginTop: 2,
                        }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className={tier.isHighlighted ? "btn-primary" : "btn-secondary"}
                  onClick={scrollToContact}
                  style={{ width: "100%", justifyContent: "center", fontSize: 11 }}
                >
                  {tier.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Fine print */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          style={{
            textAlign: "center", marginTop: 40,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12, color: "var(--text-dim)", lineHeight: 1.7,
          }}
        >
          All prices in USD. 50% deposit required to begin. Remaining 50% due at launch.
          Month-to-month after 3-month initial term. Cancel anytime.
          <br />
          Need something custom?{" "}
          <button
            onClick={scrollToContact}
            style={{
              background: "none", border: "none", cursor: "none",
              color: "var(--accent)", fontSize: 12, fontFamily: "'DM Sans', sans-serif",
              textDecoration: "underline",
            }}
          >
            Let's talk.
          </button>
        </motion.div>
      </div>
    </section>
  );
}
