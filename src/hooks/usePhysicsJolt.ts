"use client";

import { useEffect, useRef } from "react";
import { useSpring, MotionValue } from "framer-motion";

interface PhysicsJoltReturn {
  y: MotionValue<number>;
}

export function usePhysicsJolt(): PhysicsJoltReturn {
  const y = useSpring(0, { stiffness: 200, damping: 15, mass: 0.8 });
  const prevScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      const delta = current - prevScrollY.current;
      prevScrollY.current = current;

      if (Math.abs(delta) > 8) {
        const clamped = Math.max(-60, Math.min(60, delta));
        y.set(clamped * -0.3);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [y]);

  return { y };
}
