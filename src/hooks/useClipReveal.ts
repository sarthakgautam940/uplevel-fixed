"use client";

import { useEffect, useRef, useState } from "react";

type ClipVariant =
  | "pool-oval"
  | "horizontal-wipe"
  | "vertical-split"
  | "diagonal"
  | "fade-scale";

interface ClipRevealResult {
  ref: React.RefObject<HTMLDivElement | null>;
  style: React.CSSProperties;
  isVisible: boolean;
}

const variants: Record<
  ClipVariant,
  {
    initial: React.CSSProperties;
    visible: React.CSSProperties;
    duration: number;
    ease: string;
  }
> = {
  "pool-oval": {
    initial: { clipPath: "ellipse(0% 0% at 50% 50%)", opacity: 1 },
    visible: { clipPath: "ellipse(120% 120% at 50% 50%)", opacity: 1 },
    duration: 1000,
    ease: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
  "horizontal-wipe": {
    initial: { clipPath: "inset(0 100% 0 0)", opacity: 1 },
    visible: { clipPath: "inset(0 0% 0 0)", opacity: 1 },
    duration: 800,
    ease: "cubic-bezier(0.77, 0, 0.175, 1)",
  },
  "vertical-split": {
    initial: { clipPath: "inset(50% 0 50% 0)", opacity: 1 },
    visible: { clipPath: "inset(0% 0 0% 0)", opacity: 1 },
    duration: 900,
    ease: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
  diagonal: {
    initial: { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)", opacity: 1 },
    visible: { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1 },
    duration: 700,
    ease: "ease-out",
  },
  "fade-scale": {
    initial: { opacity: 0, transform: "scale(1.04)" },
    visible: { opacity: 1, transform: "scale(1)" },
    duration: 600,
    ease: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
};

export function useClipReveal(variant: ClipVariant = "fade-scale"): ClipRevealResult {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const v = variants[variant];
  const currentStyle: React.CSSProperties = isVisible
    ? {
        ...v.visible,
        transition: `all ${v.duration}ms ${v.ease}`,
      }
    : {
        ...v.initial,
        transition: `all ${v.duration}ms ${v.ease}`,
      };

  return { ref, style: currentStyle, isVisible };
}
