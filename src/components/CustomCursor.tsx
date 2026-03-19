"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type CursorLabel = "View Project" | "Play" | "Drag" | "";
type CursorTemperature = "warm" | "cool";

interface CursorState {
  x: number;
  y: number;
  ringX: number;
  ringY: number;
  isHovering: boolean;
  isGalleryCard: boolean;
  isVideo: boolean;
  isDraggable: boolean;
  isCTA: boolean;
  label: CursorLabel;
  temp: CursorTemperature;
  isPulsing: boolean;
}

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<CursorState>({
    x: -100, y: -100, ringX: -100, ringY: -100,
    isHovering: false, isGalleryCard: false, isVideo: false, isDraggable: false, isCTA: false,
    label: "", temp: "cool", isPulsing: false,
  });
  const rafRef = useRef<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const animate = useCallback(() => {
    const s = stateRef.current;
    s.ringX = lerp(s.ringX, s.x, 0.12);
    s.ringY = lerp(s.ringY, s.y, 0.12);

    if (dotRef.current) {
      dotRef.current.style.transform = `translate(${s.x}px, ${s.y}px) translate(-50%, -50%)`;
    }
    if (ringRef.current) {
      ringRef.current.style.transform = `translate(${s.ringX}px, ${s.ringY}px) translate(-50%, -50%)`;
    }
    if (labelRef.current) {
      labelRef.current.style.transform = `translate(${s.ringX + 24}px, ${s.ringY + 24}px)`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) { setIsTouch(true); return; }
    setIsMounted(true);

    const onMove = (e: MouseEvent) => {
      stateRef.current.x = e.clientX;
      stateRef.current.y = e.clientY;
    };

    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const s = stateRef.current;

      const isInteractive = target.closest("button") || target.closest("a") ||
        target.closest("[role='button']") || target.closest("input") ||
        target.closest("textarea") || target.closest("select");

      const isGallery = target.closest("[data-cursor='gallery']");
      const isVideoEl = target.closest("[data-cursor='video']");
      const isDrag = target.closest("[data-cursor='drag']");
      const isCTA = target.closest(".cta-primary");

      s.isGalleryCard = !!isGallery;
      s.isVideo = !!isVideoEl;
      s.isDraggable = !!isDrag;
      s.isCTA = !!isCTA;
      s.isHovering = !!isInteractive || !!isGallery || !!isVideoEl || !!isDrag;

      // Temperature: warm for CTAs, cool for everything else
      s.temp = isCTA ? "warm" : "cool";

      if (isGallery) s.label = "View Project";
      else if (isVideoEl) s.label = "Play";
      else if (isDrag) s.label = "Drag";
      else s.label = "";

      applyHoverState();
    };

    const applyHoverState = () => {
      const s = stateRef.current;
      if (!ringRef.current || !dotRef.current) return;

      const ringColor = s.temp === "warm"
        ? "rgba(196,154,76,0.55)"
        : "rgba(139,168,196,0.5)";
      const ringFill = s.temp === "warm"
        ? "rgba(196,154,76,0.10)"
        : "rgba(139,168,196,0.08)";
      const dotColor = s.temp === "warm" ? "var(--warm)" : "var(--accent)";

      if (dotRef.current) {
        dotRef.current.style.background = dotColor;
      }

      if (s.isHovering) {
        ringRef.current.style.width = "48px";
        ringRef.current.style.height = "48px";
        ringRef.current.style.background = ringFill;
        ringRef.current.style.borderColor = ringColor;
        dotRef.current.style.opacity = "0";
        if (labelRef.current) {
          labelRef.current.style.opacity = s.label ? "1" : "0";
          labelRef.current.textContent = s.label;
          labelRef.current.style.color = s.temp === "warm" ? "var(--warm)" : "var(--accent)";
        }
      } else {
        ringRef.current.style.width = "32px";
        ringRef.current.style.height = "32px";
        ringRef.current.style.background = "transparent";
        ringRef.current.style.borderColor = "rgba(139,168,196,0.5)";
        dotRef.current.style.opacity = "1";
        dotRef.current.style.background = "var(--accent)";
        if (labelRef.current) labelRef.current.style.opacity = "0";
      }
    };

    const onClick = (e: MouseEvent) => {
      if (!ringRef.current) return;
      const s = stateRef.current;
      if (s.isPulsing) return;
      s.isPulsing = true;

      const pulse = document.createElement("div");
      const color = s.temp === "warm" ? "rgba(196,154,76,0.7)" : "rgba(139,168,196,0.7)";
      pulse.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:32px;height:32px;border-radius:50%;border:1.5px solid ${color};transform:translate(-50%,-50%) scale(1);opacity:1;pointer-events:none;z-index:99998;transition:transform 300ms cubic-bezier(0.16,1,0.3,1),opacity 300ms ease;`;
      document.body.appendChild(pulse);
      requestAnimationFrame(() => { pulse.style.transform = "translate(-50%,-50%) scale(1.8)"; pulse.style.opacity = "0"; });
      setTimeout(() => { pulse.remove(); s.isPulsing = false; }, 320);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onEnter, { passive: true });
    document.addEventListener("click", onClick);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  if (isTouch || !isMounted) return null;

  return (
    <>
      <div ref={dotRef} aria-hidden="true" style={{ position: "fixed", top: 0, left: 0, width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", pointerEvents: "none", zIndex: 99999, willChange: "transform", transition: "opacity 150ms ease, background 200ms ease" }} />
      <div ref={ringRef} aria-hidden="true" style={{ position: "fixed", top: 0, left: 0, width: "32px", height: "32px", borderRadius: "50%", border: "1.5px solid rgba(139,168,196,0.5)", background: "transparent", pointerEvents: "none", zIndex: 99998, willChange: "transform", transition: "width 200ms cubic-bezier(0.34,1.56,0.64,1), height 200ms cubic-bezier(0.34,1.56,0.64,1), background 200ms ease, border-color 200ms ease" }} />
      <div ref={labelRef} aria-hidden="true" style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 99999, fontSize: "10px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent)", opacity: 0, transition: "opacity 150ms ease", whiteSpace: "nowrap", willChange: "transform" }} />
    </>
  );
}
