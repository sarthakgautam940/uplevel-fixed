"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ArrowRight, Phone, Mail, User, Building } from "lucide-react";
import { brand } from "../../lib/brand.config";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface FormData {
  name: string;
  business: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

const services = [
  "Website System", "AI Phone Concierge", "SEO & Growth", "Brand Identity",
  "Full Package (Best Value)", "Not sure yet",
];

export default function LeadCapture() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });
  const [data, setData] = useState<FormData>({ name: "", business: "", email: "", phone: "", service: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const update = (key: keyof FormData, val: string) => setData(d => ({ ...d, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.name || !data.email || !data.service) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid var(--border-mid)",
    padding: "14px 16px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14, color: "var(--text-primary)",
    outline: "none", transition: "border-color 0.25s ease",
  };

  return (
    <section
      ref={ref}
      id="contact"
      style={{
        padding: "clamp(80px, 10vw, 160px) clamp(24px, 5vw, 80px)",
        background: "var(--void)",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%, -50%)",
        width: "80vw", height: "60vw",
        background: "radial-gradient(ellipse, rgba(0,229,255,0.03) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1360, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 80, alignItems: "center",
        }} className="contact-grid">

          {/* Left — copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}
            >
              <span style={{ width: 32, height: 1, background: "var(--accent)", opacity: 0.4, display: "block" }} />
              <span className="eyebrow">Get Started</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: "clamp(32px, 5vw, 60px)", letterSpacing: "-0.03em",
                lineHeight: 1.05, color: "var(--text-primary)", marginBottom: 20,
              }}
            >
              Let's build<br />your system.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300, fontSize: 16, lineHeight: 1.75,
                color: "var(--text-secondary)", marginBottom: 48,
              }}
            >
              Fill out the form or book a 15-minute discovery call. We'll show you exactly what your system will look like — for free.
            </motion.p>

            {/* Trust points */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}
            >
              {[
                { icon: <Phone size={14} />, text: "We respond within 24 hours — usually same day" },
                { icon: <Mail size={14} />, text: "No pressure, no pitch — just answers to your questions" },
                { icon: <CheckCircle size={14} />, text: "Free site audit included with every discovery call" },
              ].map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{
                    color: "var(--accent)", flexShrink: 0,
                    width: 32, height: 32, borderRadius: 2,
                    background: "rgba(0,229,255,0.07)",
                    border: "1px solid rgba(0,229,255,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {p.icon}
                  </span>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14, color: "var(--text-secondary)",
                  }}>
                    {p.text}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Availability indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "12px 20px",
                border: "1px solid rgba(0,229,255,0.15)",
                background: "rgba(0,229,255,0.04)",
              }}
            >
              <div className="status-dot" />
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 10, fontWeight: 600, letterSpacing: "0.16em",
                textTransform: "uppercase", color: "var(--accent)",
              }}>
                {brand.availability.slotsTotal - brand.availability.slotsTaken} client slot{brand.availability.slotsTotal - brand.availability.slotsTaken !== 1 ? "s" : ""} available · {brand.availability.currentBookingQuarter}
              </span>
            </motion.div>
          </div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  exit={{ opacity: 0, y: -20 }}
                  style={{
                    background: "var(--surface-1)",
                    border: "1px solid var(--border-mid)",
                    padding: "40px 36px",
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    {[
                      { key: "name", placeholder: "Your name", icon: <User size={13} /> },
                      { key: "business", placeholder: "Business name", icon: <Building size={13} /> },
                    ].map((f) => (
                      <div key={f.key} style={{ position: "relative" }}>
                        <span style={{
                          position: "absolute", left: 14, top: "50%",
                          transform: "translateY(-50%)",
                          color: "var(--text-dim)", pointerEvents: "none",
                        }}>
                          {f.icon}
                        </span>
                        <input
                          type="text"
                          placeholder={f.placeholder}
                          value={data[f.key as keyof FormData]}
                          onChange={e => update(f.key as keyof FormData, e.target.value)}
                          style={{ ...inputStyle, paddingLeft: 40 }}
                          onFocus={e => e.currentTarget.style.borderColor = "rgba(0,229,255,0.35)"}
                          onBlur={e => e.currentTarget.style.borderColor = "var(--border-mid)"}
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                    {[
                      { key: "email", placeholder: "Email address", type: "email", icon: <Mail size={13} /> },
                      { key: "phone", placeholder: "Phone (optional)", type: "tel", icon: <Phone size={13} /> },
                    ].map((f) => (
                      <div key={f.key} style={{ position: "relative" }}>
                        <span style={{
                          position: "absolute", left: 14, top: "50%",
                          transform: "translateY(-50%)",
                          color: "var(--text-dim)", pointerEvents: "none",
                        }}>
                          {f.icon}
                        </span>
                        <input
                          type={f.type || "text"}
                          placeholder={f.placeholder}
                          value={data[f.key as keyof FormData]}
                          onChange={e => update(f.key as keyof FormData, e.target.value)}
                          style={{ ...inputStyle, paddingLeft: 40 }}
                          onFocus={e => e.currentTarget.style.borderColor = "rgba(0,229,255,0.35)"}
                          onBlur={e => e.currentTarget.style.borderColor = "var(--border-mid)"}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Service selector */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 9, fontWeight: 600, letterSpacing: "0.18em",
                      textTransform: "uppercase", color: "var(--text-dim)",
                      marginBottom: 10,
                    }}>
                      I need help with...
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {services.map((s) => (
                        <button
                          key={s} type="button"
                          onClick={() => update("service", s)}
                          style={{
                            background: data.service === s ? "rgba(0,229,255,0.08)" : "transparent",
                            border: `1px solid ${data.service === s ? "rgba(0,229,255,0.3)" : "var(--border-dim)"}`,
                            padding: "7px 12px", cursor: "none",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 12, color: data.service === s ? "var(--accent)" : "var(--text-dim)",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    placeholder="Tell us about your business and what you're looking to achieve..."
                    value={data.message}
                    onChange={e => update("message", e.target.value)}
                    rows={3}
                    style={{
                      ...inputStyle, resize: "none", marginBottom: 20,
                      display: "block",
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(0,229,255,0.35)"}
                    onBlur={e => e.currentTarget.style.borderColor = "var(--border-mid)"}
                  />

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={sending}
                    style={{ width: "100%", justifyContent: "center", fontSize: 12 }}
                  >
                    {sending ? "Sending..." : "Send Message →"}
                  </button>

                  <div style={{
                    textAlign: "center", marginTop: 20,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11, color: "var(--text-dim)",
                  }}>
                    Or book directly:{" "}
                    <a
                      href={brand.calendlyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--accent)", textDecoration: "underline" }}
                    >
                      Schedule 15-minute call →
                    </a>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{
                    background: "var(--surface-1)",
                    border: "1px solid rgba(0,229,255,0.25)",
                    padding: "60px 40px",
                    textAlign: "center",
                    boxShadow: "0 0 40px rgba(0,229,255,0.06)",
                  }}
                >
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: "rgba(0,229,255,0.08)",
                    border: "1px solid rgba(0,229,255,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 24px",
                    color: "var(--accent)",
                  }}>
                    <CheckCircle size={24} />
                  </div>
                  <h3 style={{
                    fontFamily: "'Syne', sans-serif", fontWeight: 800,
                    fontSize: 28, letterSpacing: "-0.02em",
                    color: "var(--text-primary)", marginBottom: 12,
                  }}>
                    Message received.
                  </h3>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)",
                  }}>
                    We'll be in touch within 24 hours — usually much faster. Check your inbox for a confirmation.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr !important; } }
        input::placeholder, textarea::placeholder { color: var(--text-dim); }
      `}</style>
    </section>
  );
}
