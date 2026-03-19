"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  phase: number;
  speed: number;
  isBurst: boolean;
  burstAge: number;
  burstLife: number;
  burstVx: number;
  burstVy: number;
}

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: height + Math.random() * 40,
    vx: 0,
    vy: -(0.15 + Math.random() * 0.25),
    radius: 1 + Math.random() * 1.5,
    alpha: 0.12 + Math.random() * 0.13,
    phase: Math.random() * Math.PI * 2,
    speed: 0.3 + Math.random() * 0.5,
    isBurst: false,
    burstAge: 0,
    burstLife: 0,
    burstVx: 0,
    burstVy: 0,
  };
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let mouseX = -999;
    let mouseY = -999;
    let frameCount = 0;
    let animId: number;
    const PARTICLE_COUNT = 45;

    canvas.width = width;
    canvas.height = height;

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () =>
      createParticle(width, height)
    );
    // Scatter initial positions across screen
    particles.forEach((p) => {
      p.y = Math.random() * height;
    });

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseLeave = () => {
      mouseX = -999;
      mouseY = -999;
    };

    const onClick = (e: MouseEvent) => {
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.4;
        const speed = 1.5 + Math.random() * 2.5;
        const burst: Particle = {
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 1.5 + Math.random(),
          alpha: 0.5,
          phase: 0,
          speed: 0,
          isBurst: true,
          burstAge: 0,
          burstLife: 1200,
          burstVx: Math.cos(angle) * speed,
          burstVy: Math.sin(angle) * speed,
        };
        particles.push(burst);
      }
    };

    const draw = (timestamp: number) => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      const toRemove: number[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (p.isBurst) {
          p.burstAge += 16.67;
          const progress = p.burstAge / p.burstLife;
          if (progress >= 1) {
            toRemove.push(i);
            continue;
          }
          const ease = 1 - progress * progress;
          p.x += p.burstVx * ease * 0.6;
          p.y += p.burstVy * ease * 0.6;
          p.burstVx *= 0.97;
          p.burstVy *= 0.97;

          const alpha = p.alpha * (1 - progress);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(139,168,196,${alpha})`;
          ctx.fill();
          continue;
        }

        // Cursor repel
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 120;
        const maxForce = 1.2;

        if (dist < repelRadius && dist > 0) {
          const force = (1 - dist / repelRadius) * maxForce;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        // Drift upward + sine wave
        p.phase += p.speed * 0.01;
        p.x += Math.sin(p.phase) * 0.3;
        p.y += p.vy;

        // Reset when offscreen
        if (p.y < -10) {
          p.x = Math.random() * width;
          p.y = height + 10;
          p.phase = Math.random() * Math.PI * 2;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,168,196,${p.alpha})`;
        ctx.fill();
      }

      // Remove expired burst particles (reverse to preserve indices)
      for (let i = toRemove.length - 1; i >= 0; i--) {
        particles.splice(toRemove[i], 1);
      }

      // Keep steady-state at PARTICLE_COUNT
      while (particles.filter((p) => !p.isBurst).length < PARTICLE_COUNT) {
        particles.push(createParticle(width, height));
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        width: "100%",
        height: "100%",
      }}
    />
  );
}
