"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { brand } from "../../lib/brand.config";

export default function AvailabilityBand() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.5 });
  const { slotsTotal, slotsTaken, currentBookingQuarter } = brand.availabilityBand;
  const slotsAvailable = slotsTotal - slotsTaken;

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      className="relative py-5 overflow-hidden"
      style={{
        background: "var(--surface-2)",
        borderTop: "1px solid var(--border-dim)",
        borderBottom: "1px solid var(--border-dim)",
        borderLeft: "4px solid var(--accent)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{ background: "radial-gradient(ellipse 600px 200px at 50% 50%, rgba(139,168,196,0.5), transparent)" }}
      />

      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            <div>
              <div className="text-[10px] font-medium tracking-[0.18em] uppercase mb-1" style={{ color: "var(--accent)" }}>
                Project Availability
              </div>
              <p className="text-[14px] font-medium" style={{ color: "var(--text-primary)" }}>
                We accept {slotsTotal} new projects per quarter.{" "}
                <span style={{ color: "var(--text-secondary)" }}>
                  Currently booking {currentBookingQuarter}.
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                {Array.from({ length: slotsTotal }).map((_, i) => {
                  const isTaken = i < slotsTaken;
                  return (
                    <div
                      key={i}
                      className="relative"
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        background: isTaken ? "var(--accent)" : "transparent",
                        border: isTaken ? "none" : "1.5px dashed rgba(139,168,196,0.5)",
                      }}
                    >
                      {!isTaken && (
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{ animation: "availablePulse 2s ease-in-out infinite", background: "rgba(139,168,196,0.1)" }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <span className="text-[12px] font-medium" style={{ color: "var(--text-dim)" }}>
                {slotsAvailable} slot{slotsAvailable !== 1 ? "s" : ""} available
              </span>
            </div>
          </div>

          <button
            onClick={scrollToContact}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-lg text-[11px] font-bold tracking-[0.1em] uppercase transition-all duration-200 flex-shrink-0"
            style={{
              background: "rgba(139,168,196,0.1)",
              border: "1px solid rgba(139,168,196,0.3)",
              color: "var(--accent)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(139,168,196,0.18)";
              e.currentTarget.style.borderColor = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(139,168,196,0.1)";
              e.currentTarget.style.borderColor = "rgba(139,168,196,0.3)";
            }}
          >
            Secure your slot →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
