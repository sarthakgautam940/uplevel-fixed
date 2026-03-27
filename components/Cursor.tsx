'use client';

import { useEffect, useRef } from 'react';

type CursorState = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  active: boolean;
};

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const state = useRef<CursorState>({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });

  useEffect(() => {
    const move = (event: MouseEvent) => {
      state.current.targetX = event.clientX;
      state.current.targetY = event.clientY;
    };

    const setActive = (active: boolean) => {
      state.current.active = active;
      if (ringRef.current) {
        ringRef.current.style.transform = active
          ? 'translate3d(-50%, -50%, 0) scale(1)'
          : 'translate3d(-50%, -50%, 0) scale(0.35)';
        ringRef.current.style.opacity = active ? '1' : '0.55';
      }
    };

    const pointerOver = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.closest('a, button, [data-magnetic="true"]')) setActive(true);
    };

    const pointerOut = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.closest('a, button, [data-magnetic="true"]')) setActive(false);
    };

    const tick = () => {
      const cursor = state.current;
      cursor.x += (cursor.targetX - cursor.x) * 0.16;
      cursor.y += (cursor.targetY - cursor.y) * 0.16;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${cursor.x}px, ${cursor.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${cursor.x}px`;
        ringRef.current.style.top = `${cursor.y}px`;
      }

      requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', pointerOver);
    window.addEventListener('mouseout', pointerOut);
    requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', pointerOver);
      window.removeEventListener('mouseout', pointerOut);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[120] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--crisp)] mix-blend-difference"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[119] h-10 w-10 -translate-x-1/2 -translate-y-1/2 scale-50 rounded-full border border-[var(--crisp)] opacity-60 transition-[transform,opacity] duration-300 mix-blend-difference"
      />
    </>
  );
}
