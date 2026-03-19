"use client";

import { useEffect, useRef, useCallback } from "react";

export function useLiquidGlass(enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const tRef = useRef(0);
  const rafRef = useRef<number>(0);
  const currentRef = useRef({ x: 30, y: 40 });
  const targetRef = useRef<{ x: number; y: number } | null>(null);

  const loop = useCallback(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    tRef.current += 0.003;
    const gxBase = 30 + Math.sin(tRef.current * 0.7) * 25;
    const gyBase = 40 + Math.cos(tRef.current * 1.1) * 20;

    const target = targetRef.current ?? { x: gxBase, y: gyBase };

    currentRef.current.x += (target.x - currentRef.current.x) * 0.04;
    currentRef.current.y += (target.y - currentRef.current.y) * 0.04;

    el.style.setProperty("--gx", `${currentRef.current.x}%`);
    el.style.setProperty("--gy", `${currentRef.current.y}%`);

    rafRef.current = requestAnimationFrame(loop);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [enabled, loop]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      targetRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      };
    };
    const onLeave = () => {
      targetRef.current = null;
    };

    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  return ref;
}
