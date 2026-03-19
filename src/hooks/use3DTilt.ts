"use client";

import { useRef, useCallback, RefObject } from "react";
import { useSpring, useMotionValue, MotionValue } from "framer-motion";
import { useDeviceProfile } from "./useDeviceProfile";

interface TiltConfig {
  maxRotate?: number;
  maxShift?: number;
  scale?: number;
}

interface TiltReturn {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  scale: MotionValue<number>;
  highlightX: MotionValue<number>;
  highlightY: MotionValue<number>;
  highlightOpacity: MotionValue<number>;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

export function use3DTilt(
  ref: RefObject<HTMLElement | null>,
  config: TiltConfig = {}
): TiltReturn {
  const { maxRotate = 12, scale = 1.02 } = config;
  const profile = useDeviceProfile();

  const spring = { stiffness: 300, damping: 30 };

  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);
  const scaleV = useSpring(1, spring);
  const highlightX = useMotionValue(50);
  const highlightY = useMotionValue(50);
  const highlightOpacity = useSpring(0, { stiffness: 300, damping: 40 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const nx = (e.clientX - cx) / (rect.width / 2);
      const ny = (e.clientY - cy) / (rect.height / 2);

      rotateY.set(nx * maxRotate);
      rotateX.set(-ny * maxRotate);
      scaleV.set(scale);

      const hx = ((e.clientX - rect.left) / rect.width) * 100;
      const hy = ((e.clientY - rect.top) / rect.height) * 100;
      highlightX.set(hx);
      highlightY.set(hy);
      highlightOpacity.set(1);
    },
    [ref, maxRotate, scale, rotateX, rotateY, scaleV, highlightX, highlightY, highlightOpacity]
  );

  const onMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    scaleV.set(1);
    highlightOpacity.set(0);
  }, [rotateX, rotateY, scaleV, highlightOpacity]);

  // On touch devices: return flat style with no event listeners
  if (profile.isTouch) {
    return {
      rotateX,
      rotateY,
      scale: scaleV,
      highlightX,
      highlightY,
      highlightOpacity,
      onMouseMove: () => {},
      onMouseLeave: () => {},
    };
  }

  return {
    rotateX,
    rotateY,
    scale: scaleV,
    highlightX,
    highlightY,
    highlightOpacity,
    onMouseMove,
    onMouseLeave,
  };
}
