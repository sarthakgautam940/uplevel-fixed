"use client";

import { brand } from "../../lib/brand.config";

const footerLinks = {
  Services: ["Website Systems", "AI Phone Concierge", "SEO & Growth", "Brand Identity"],
  Company: ["About", "Process", "Pricing", "Case Studies"],
  Legal: ["Privacy Policy", "Terms of Service", "Refund Policy"],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: "var(--void)",
      borderTop: "1px solid var(--border-dim)",
      padding: "64px clamp(24px, 5vw, 80px) 32px",
    }}>
      <div style={{ maxWidth: 1360, margin: "0 auto" }}>
        {/* Top row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 40, marginBottom: 60,
          paddingBottom: 60,
          borderBottom: "1px solid var(--border-dim)",
        }} className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <span style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: 20, letterSpacing: "0.06em", textTransform: "uppercase",
                color: "var(--text-primary)",
              }}>
                UP<span style={{ color: "var(--accent)" }}>LEVEL</span>
              </span>
              <span style={{
                display: "block",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 9, fontWeight: 500, letterSpacing: "0.2em",
                textTransform: "uppercase", color: "var(--text-dim)",
                marginTop: 2,
              }}>
                SERVICES
              </span>
            </div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300, fontSize: 13, lineHeight: 1.75,
              color: "var(--text-dim)", maxWidth: 280, marginBottom: 20,
            }}>
              Premium website systems, AI automation, and growth infrastructure for elite contractors.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { href: brand.social.instagram, label: "Instagram" },
                { href: brand.social.linkedin, label: "LinkedIn" },
                { href: brand.social.facebook, label: "Facebook" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 32, height: 32,
                    border: "1px solid var(--border-dim)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 9, fontWeight: 600, letterSpacing: "0.1em",
                    color: "var(--text-dim)",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,229,255,0.3)";
                    (e.currentTarget as HTMLElement).style.color = "var(--accent)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border-dim)";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-dim)";
                  }}
                >
                  {s.label.slice(0, 2).toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 9, fontWeight: 700, letterSpacing: "0.2em",
                textTransform: "uppercase", color: "var(--text-dim)",
                marginBottom: 20,
              }}>
                {heading}
              </div>
              <ul style={{ display: "flex", flexDirection: "column", gap: 12, listStyle: "none" }}>
                {links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13, color: "var(--text-secondary)",
                        textDecoration: "none", transition: "color 0.2s ease",
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 12,
        }}>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12, color: "var(--text-dim)",
          }}>
            © {year} UpLevel Services LLC. Virginia LLC. All rights reserved.
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 5, height: 5, borderRadius: "50%",
              background: "var(--accent)", opacity: 0.6,
            }} />
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 9, fontWeight: 600, letterSpacing: "0.16em",
              textTransform: "uppercase", color: "var(--text-dim)",
            }}>
              {brand.availability.slotsTotal - brand.availability.slotsTaken} slot{brand.availability.slotsTotal - brand.availability.slotsTaken !== 1 ? "s" : ""} available
            </span>
          </div>
          <a
            href={`mailto:${brand.email}`}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12, color: "var(--text-dim)",
              textDecoration: "none", transition: "color 0.2s ease",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--accent)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-dim)"}
          >
            {brand.email}
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
