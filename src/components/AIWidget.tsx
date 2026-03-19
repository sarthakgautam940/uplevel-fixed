"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X, MessageCircle } from "lucide-react";
import { brand } from "../../lib/brand.config";

type Message = { role: "ai" | "user"; text: string };

const QUICK_REPLIES = [
  "What services do you offer?",
  "How fast can you launch?",
  "What does it cost?",
  "Do you work with HVAC companies?",
];

export default function AIWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: brand.aiConcierge.greeting },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const RESPONSES: Record<string, string> = {
    service: "We build four systems: Website Systems (custom code, 48hr delivery), AI Phone Concierge (24/7 voice AI), SEO & Local Growth, and Brand Identity. Most clients start with a Website + AI bundle.",
    fast: "Most builds go live within 48 hours of your completed intake form and deposit. Our record is 29 hours. Book a free call to get a timeline for your specific project.",
    cost: "Starter builds begin at $3,500 setup + $297/month. Our most popular Authority package is $6,500 + $497/month. All month-to-month — no contracts. See our pricing section for full details.",
    hvac: "Yes — HVAC is one of our top verticals. We have a proven system for HVAC companies including storm/emergency landing pages and AI that qualifies urgent service calls. Let's talk.",
    default: "Great question! I'd love to get you a proper answer on a 15-minute discovery call with the team. It's free and you'll walk away with a free audit of your current site. Want to book one?",
  };

  const getResponse = (msg: string) => {
    const m = msg.toLowerCase();
    if (m.includes("service") || m.includes("offer") || m.includes("build")) return RESPONSES.service;
    if (m.includes("fast") || m.includes("quick") || m.includes("launch") || m.includes("time")) return RESPONSES.fast;
    if (m.includes("cost") || m.includes("price") || m.includes("how much") || m.includes("$")) return RESPONSES.cost;
    if (m.includes("hvac") || m.includes("roofing") || m.includes("plumbing") || m.includes("contractor")) return RESPONSES.hvac;
    return RESPONSES.default;
  };

  const send = async (text: string) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    setTyping(false);
    setMessages(m => [...m, { role: "ai", text: getResponse(text) }]);
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        onClick={() => setOpen(true)}
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 200,
          width: 52, height: 52, borderRadius: "50%",
          background: "var(--void)",
          border: "1px solid rgba(0,229,255,0.3)",
          boxShadow: "0 0 0 0 rgba(0,229,255,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "none", color: "var(--accent)",
          animation: "widgetPulse 3s ease-in-out infinite",
        }}
        aria-label="Chat with ARIA"
      >
        <MessageCircle size={20} />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed", bottom: 88, right: 28, zIndex: 200,
              width: "min(380px, calc(100vw - 40px))",
              background: "var(--surface-1)",
              border: "1px solid var(--border-mid)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,229,255,0.06)",
              display: "flex", flexDirection: "column",
              maxHeight: "70vh",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--border-dim)",
              display: "flex", alignItems: "center", gap: 12,
              flexShrink: 0,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(255,107,53,0.1))",
                border: "1px solid rgba(0,229,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 800,
                color: "var(--accent)",
              }}>
                AI
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700, fontSize: 13, color: "var(--text-primary)",
                }}>
                  {brand.aiConcierge.name}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: "var(--accent)", opacity: 0.8,
                  }} />
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 10, color: "var(--text-dim)",
                  }}>
                    UpLevel AI · Online
                  </span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "none", border: "none", cursor: "none",
                  color: "var(--text-dim)", padding: 4,
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: "auto", padding: "20px",
              display: "flex", flexDirection: "column", gap: 14,
              scrollbarWidth: "none",
            }}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: "flex",
                    justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div style={{
                    maxWidth: "82%",
                    padding: "10px 14px",
                    background: m.role === "user"
                      ? "var(--warm)"
                      : "rgba(0,229,255,0.06)",
                    border: m.role === "user"
                      ? "none"
                      : "1px solid rgba(0,229,255,0.1)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13, lineHeight: 1.65,
                    color: m.role === "user" ? "#fff" : "var(--text-secondary)",
                    borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                  }}>
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {typing && (
                <div style={{ display: "flex", gap: 4, padding: "10px 14px", alignSelf: "flex-start" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: "var(--accent)", opacity: 0.5,
                      animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick replies */}
            {messages.length === 1 && (
              <div style={{
                padding: "0 16px 12px",
                display: "flex", flexWrap: "wrap", gap: 6,
              }}>
                {QUICK_REPLIES.map((qr) => (
                  <button
                    key={qr}
                    onClick={() => send(qr)}
                    style={{
                      background: "none",
                      border: "1px solid var(--border-mid)",
                      padding: "5px 10px",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 11, color: "var(--text-dim)",
                      cursor: "none", transition: "all 0.2s ease",
                      borderRadius: 20,
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,229,255,0.3)";
                      (e.currentTarget as HTMLElement).style.color = "var(--accent)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border-mid)";
                      (e.currentTarget as HTMLElement).style.color = "var(--text-dim)";
                    }}
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{
              padding: "12px 16px",
              borderTop: "1px solid var(--border-dim)",
              display: "flex", gap: 8, flexShrink: 0,
            }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send(input)}
                placeholder="Ask anything..."
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--border-dim)",
                  padding: "10px 14px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13, color: "var(--text-primary)",
                  outline: "none", borderRadius: 20,
                }}
              />
              <button
                onClick={() => send(input)}
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "var(--warm)", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "none", color: "#fff", flexShrink: 0,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes widgetPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,229,255,0.25); }
          50% { box-shadow: 0 0 0 10px rgba(0,229,255,0); }
        }
        @keyframes typingDot {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
