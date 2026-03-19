"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { brand } from "../../lib/brand.config";
import { useMagneticEffect } from "../hooks/useMagneticEffect";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "Results", href: "#results" },
  { label: "FAQ", href: "#faq" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ctaRef = useRef<HTMLButtonElement>(null);
  useMagneticEffect(ctaRef, 0.35);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, mobileOpen ? 320 : 0);
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        transition: "background 0.4s ease, border-color 0.4s ease",
        background: scrolled ? "rgba(6,6,8,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,229,255,0.08)" : "1px solid transparent",
      }}
    >
      <div style={{
        maxWidth: 1360, margin: "0 auto",
        padding: "0 clamp(24px, 5vw, 80px)",
        height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ display: "flex", flexDirection: "column", gap: 0, background: "none", border: "none", cursor: "none", padding: 0 }}
        >
          <span style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800, fontSize: 16, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "var(--text-primary)",
            lineHeight: 1,
          }}>
            UP<span style={{ color: "var(--accent)" }}>LEVEL</span>
          </span>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 400, fontSize: 9, letterSpacing: "0.22em",
            textTransform: "uppercase", color: "var(--text-dim)", lineHeight: 1.2,
          }}>
            SERVICES
          </span>
        </button>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 36 }} className="hidden-mobile">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className="nav-link"
              style={{ background: "none", border: "none", cursor: "none", padding: "4px 0" }}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }} className="hidden-mobile">
          {/* Availability badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "6px 12px",
            border: "1px solid rgba(0,229,255,0.12)",
            background: "rgba(0,229,255,0.04)",
          }}>
            <div className="status-dot" />
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 9, fontWeight: 600, letterSpacing: "0.18em",
              textTransform: "uppercase", color: "var(--accent)",
            }}>
              {brand.availability.slotsTotal - brand.availability.slotsTaken} slot{brand.availability.slotsTotal - brand.availability.slotsTaken !== 1 ? "s" : ""} available
            </span>
          </div>

          <button
            ref={ctaRef}
            className="btn-primary"
            onClick={() => scrollTo("#contact")}
          >
            Book Call
            <span style={{ fontSize: 14 }}>→</span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: "none", border: "1px solid var(--border-mid)",
            padding: "8px", display: "none", cursor: "pointer",
            color: "var(--text-primary)",
          }}
          className="mobile-menu-btn"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed", top: 64, left: 0, right: 0, bottom: 0,
              background: "rgba(6,6,8,0.97)",
              backdropFilter: "blur(24px)",
              zIndex: 99,
              display: "flex", flexDirection: "column",
              padding: "40px clamp(24px, 5vw, 80px)",
              gap: 8,
            }}
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => scrollTo(link.href)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "16px 0",
                  borderBottom: "1px solid var(--border-dim)",
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 24, fontWeight: 700,
                  color: "var(--text-primary)", textAlign: "left",
                }}
              >
                {link.label}
              </motion.button>
            ))}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.3 }}
              className="btn-primary"
              onClick={() => scrollTo("#contact")}
              style={{ marginTop: 32, alignSelf: "flex-start" }}
            >
              Book Discovery Call →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
