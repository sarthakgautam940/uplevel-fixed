"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";

export interface GalleryProject {
  title: string;
  location: string;
  year: string;
  span: string;
  duration: string;
  size: string;
  investment: string;
  materials: string[];
  story: string;
  gradient: string;
  index: number;
}

interface ProjectLightboxProps {
  project: GalleryProject | null;
  onClose: () => void;
}

const thumbnailGradients = [
  "linear-gradient(135deg, #0d2a3d 0%, #1a5f7a 50%, #0a3d52 100%)",
  "linear-gradient(135deg, #071a2e 0%, #0f4460 50%, #1a7a8a 100%)",
  "linear-gradient(135deg, #0a2030 0%, #155670 50%, #0d3a4f 100%)",
];

function LightboxVisual({ project }: { project: GalleryProject }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const thumbs = [project.gradient, ...thumbnailGradients];

  return (
    <div className="md:w-[58%] flex flex-col" style={{ background: "var(--surface-2)" }}>
      <div className="flex-1 relative overflow-hidden" style={{ minHeight: "280px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
            style={{ background: thumbs[activeIdx] }}
          />
        </AnimatePresence>
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-1/3 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)",
            opacity: 0.25,
          }}
        />
        <div
          className="absolute top-4 right-6 text-[80px] font-bold leading-none select-none pointer-events-none"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "rgba(255,255,255,0.04)",
          }}
        >
          {String(project.index + 1).padStart(2, "0")}
        </div>
      </div>

      <div
        className="flex gap-2 p-4"
        style={{ borderTop: "1px solid var(--border-dim)" }}
      >
        {thumbs.map((g, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className="flex-1 rounded-lg overflow-hidden transition-all duration-200"
            style={{
              aspectRatio: "4/3",
              background: g,
              border: activeIdx === i ? "2px solid var(--gold)" : "2px solid transparent",
              opacity: activeIdx === i ? 1 : 0.5,
            }}
            aria-label={`View angle ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProjectLightbox({ project, onClose }: ProjectLightboxProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    if (project) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, project]);

  const scrollToContact = () => {
    onClose();
    setTimeout(() => {
      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
    }, 400);
  };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="lightbox-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8"
          style={{ background: "rgba(5,5,8,0.92)", backdropFilter: "blur(20px)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            key="lightbox-panel"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl flex flex-col md:flex-row"
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--border-mid)",
              boxShadow: "0 40px 120px rgba(0,0,0,0.7)",
            }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close project"
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{
                background: "rgba(5,5,8,0.7)",
                border: "1px solid var(--border-mid)",
                color: "var(--text-dim)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text-primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-dim)")
              }
            >
              <X size={18} />
            </button>

            {/* Left panel */}
            <div className="md:w-[42%] p-8 md:p-10 flex flex-col overflow-y-auto">
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-[10px] font-medium tracking-[0.18em] uppercase"
                    style={{ color: "var(--gold)" }}
                  >
                    Project {String(project.index + 1).padStart(2, "0")}
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "var(--border-dim)" }}
                  />
                </div>
                <h2
                  className="text-[clamp(1.6rem,2.5vw,2.8rem)] font-normal leading-[1.05] tracking-[-0.03em]"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: "var(--text-primary)",
                  }}
                >
                  {project.title}
                </h2>
                <p className="mt-1.5 text-[13px]" style={{ color: "var(--text-dim)" }}>
                  {project.location}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {[
                  { label: "Year", value: project.year },
                  { label: "Duration", value: project.duration },
                  { label: "Size", value: project.size },
                  { label: "Investment", value: project.investment },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="p-3 rounded-xl"
                    style={{
                      background: "var(--surface-2)",
                      border: "1px solid var(--border-dim)",
                    }}
                  >
                    <div
                      className="text-[10px] font-medium tracking-[0.14em] uppercase mb-1"
                      style={{ color: "var(--text-dim)" }}
                    >
                      {label}
                    </div>
                    <div
                      className="text-[13px] font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-5">
                <div
                  className="text-[10px] font-medium tracking-[0.14em] uppercase mb-2.5"
                  style={{ color: "var(--text-dim)" }}
                >
                  Materials Used
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.materials.map((m) => (
                    <span
                      key={m}
                      className="px-3 py-1 rounded-full text-[11px] font-medium tracking-[0.04em]"
                      style={{
                        background: "rgba(139,168,196,0.08)",
                        border: "1px solid rgba(139,168,196,0.22)",
                        color: "var(--gold)",
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6 flex-1">
                <div
                  className="text-[10px] font-medium tracking-[0.14em] uppercase mb-2.5"
                  style={{ color: "var(--text-dim)" }}
                >
                  Project Story
                </div>
                <p
                  className="text-[15px] font-light leading-[1.7]"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: "var(--text-secondary)",
                  }}
                >
                  {project.story}
                </p>
              </div>

              <button
                onClick={scrollToContact}
                className="group flex items-center justify-center gap-3 h-[52px] w-full rounded-xl text-[12px] font-bold tracking-[0.12em] uppercase transition-all duration-200 active:scale-[0.97]"
                style={{
                  background:
                    "linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)",
                  color: "#0A0A0A",
                  boxShadow: "0 0 30px rgba(139,168,196,0.2)",
                }}
              >
                Start Your Project
                <ArrowRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </button>
            </div>

            {/* Right panel */}
            <LightboxVisual project={project} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
