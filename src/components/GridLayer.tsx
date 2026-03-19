"use client";

import { useEffect, useRef } from "react";

export default function GridLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    let mouseX = -999;
    let mouseY = -999;
    let animId: number;

    const NUM_VERTICALS = 24;
    const NUM_HORIZONTALS = 18;
    const CURSOR_RADIUS = 140;
    const MAX_BRIGHTNESS_BOOST = 0.14;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    resize();

    const onMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Vanishing point: center-x, 15% from top; shifts slightly with scroll
      const scrollRatio =
        document.documentElement.scrollHeight > h
          ? window.scrollY / (document.documentElement.scrollHeight - h)
          : 0;
      const vpY = h * (0.15 + (scrollRatio - 0.5) * 0.1);
      const vpX = w / 2;

      // ──────────────────────────────
      // Vertical lines
      // ──────────────────────────────
      for (let i = 0; i < NUM_VERTICALS; i++) {
        const x = (w / (NUM_VERTICALS - 1)) * i;
        const distFromCursor = Math.abs(x - mouseX);
        const boost =
          distFromCursor < CURSOR_RADIUS
            ? (1 - distFromCursor / CURSOR_RADIUS) * MAX_BRIGHTNESS_BOOST
            : 0;

        const isWarm = i % 5 === 0;
        const baseAlpha = isWarm ? 0.04 : 0.065;
        const alpha = baseAlpha + boost;

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.strokeStyle = isWarm
          ? `rgba(196,154,76,${alpha})`
          : `rgba(139,168,196,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // ──────────────────────────────
      // Horizontal lines (perspective)
      // ──────────────────────────────
      // distribute from bottom up to vanishing point
      // spacing decreases (lines get closer) as they approach VP
      for (let i = 0; i < NUM_HORIZONTALS; i++) {
        const t = Math.pow((i + 1) / NUM_HORIZONTALS, 2.2);
        const y = h - (h - vpY) * t;

        // Width of line at this y (perspective foreshortening)
        const progress = (y - vpY) / (h - vpY); // 0 at VP, 1 at bottom
        const lineWidth = w * progress;
        const x0 = vpX - lineWidth / 2;
        const x1 = vpX + lineWidth / 2;

        const distFromCursor = Math.abs(y - mouseY);
        const boost =
          distFromCursor < CURSOR_RADIUS
            ? (1 - distFromCursor / CURSOR_RADIUS) * MAX_BRIGHTNESS_BOOST
            : 0;

        const isWarm = i % 5 === 0;
        const baseAlpha = isWarm ? 0.035 : 0.06;
        const alpha = baseAlpha + boost;

        ctx.beginPath();
        ctx.moveTo(x0, y);
        ctx.lineTo(x1, y);
        ctx.strokeStyle = isWarm
          ? `rgba(196,154,76,${alpha})`
          : `rgba(139,168,196,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("mousemove", onMouse, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
        opacity: 1,
      }}
    />
  );
}
