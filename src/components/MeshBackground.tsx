"use client";

import { useEffect, useRef } from "react";

interface GradientPoint {
  x: number;
  y: number;
  color: [number, number, number];
  radius: number;
  amplitude: number;
  frequency: number;
  phase: number;
}

interface MeshBackgroundProps {
  points?: Array<{
    color: [number, number, number];
    opacity?: number;
    startX?: number;
    startY?: number;
  }>;
  opacity?: number;
}

const DEFAULT_POINTS: MeshBackgroundProps["points"] = [
  { color: [26, 58, 82], opacity: 0.06 },
  { color: [8, 12, 20], opacity: 0.04 },
  { color: [14, 20, 32], opacity: 0.03 },
];

export default function MeshBackground({
  points = DEFAULT_POINTS,
  opacity = 1,
}: MeshBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    let animId: number;
    let t = 0;

    const pts: NonNullable<MeshBackgroundProps["points"]> = points && points.length > 0 ? points : DEFAULT_POINTS!;
    const gradPoints: GradientPoint[] = pts.map((p, i) => ({
      x: (p.startX ?? (i === 0 ? 0.3 : i === 1 ? 0.7 : 0.5)) * w,
      y: (p.startY ?? (i === 0 ? 0.4 : i === 1 ? 0.6 : 0.3)) * h,
      color: p.color,
      radius: w * (0.35 + i * 0.08),
      amplitude: w * 0.06,
      frequency: 0.0003 + i * 0.0002,
      phase: i * 1.2,
    }));

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
      gradPoints.forEach((gp, i) => {
        gp.radius = w * (0.35 + i * 0.08);
        gp.amplitude = w * 0.06;
      });
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      t += 0.5;
      ctx2d.clearRect(0, 0, w, h);
      ctx2d.globalCompositeOperation = "screen";

      for (const gp of gradPoints) {
        const px = gp.x + Math.sin(t * gp.frequency + gp.phase) * gp.amplitude;
        const py = gp.y + Math.cos(t * gp.frequency * 1.3 + gp.phase) * gp.amplitude;

        const grad = ctx2d.createRadialGradient(px, py, 0, px, py, gp.radius);
        grad.addColorStop(0, `rgba(${gp.color[0]},${gp.color[1]},${gp.color[2]},0.06)`);
        grad.addColorStop(1, "rgba(0,0,0,0)");

        ctx2d.fillStyle = grad;
        ctx2d.fillRect(0, 0, w, h);
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [points]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity,
      }}
    />
  );
}
