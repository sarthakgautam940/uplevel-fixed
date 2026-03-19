"use client";

import { useEffect, RefObject } from "react";

export function useMagneticEffect(
  ref: RefObject<HTMLElement | null>,
  strength = 0.4
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - elCenterX;
      const dy = e.clientY - elCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const threshold = 80;

      if (dist < threshold) {
        const tx = dx * strength;
        const ty = dy * strength;
        el.style.transform = `translate(${tx}px, ${ty}px)`;
        el.style.transition = "transform 100ms ease-out";
      }
    };

    const onMouseLeave = () => {
      el.style.transform = "translate(0px, 0px)";
      el.style.transition = "transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)";
    };

    const parent = el.parentElement || document.body;
    parent.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      parent.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [ref, strength]);
}
