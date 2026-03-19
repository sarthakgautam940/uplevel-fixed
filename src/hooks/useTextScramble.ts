"use client";

import { useState, useEffect, useRef } from "react";
import { useDeviceProfile } from "./useDeviceProfile";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&";

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

interface ScrambleChar {
  char: string;
  resolved: boolean;
  opacity: number;
}

export function useTextScramble(finalText: string, trigger: boolean, totalDuration = 800) {
  const profile = useDeviceProfile();
  const [chars, setChars] = useState<ScrambleChar[]>(() =>
    finalText.split("").map((c) => ({ char: c, resolved: true, opacity: 1 }))
  );
  const [isDone, setIsDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!trigger || hasStartedRef.current) return;

    // On low-power devices: skip scramble, show text instantly
    if (profile.isLowPower) {
      hasStartedRef.current = true;
      setChars(finalText.split("").map((c) => ({ char: c, resolved: true, opacity: 1 })));
      setIsDone(true);
      return;
    }
    hasStartedRef.current = true;
    setIsDone(false);

    const len = finalText.length;
    startTimeRef.current = Date.now();

    // Initialize as all scrambled
    setChars(
      finalText.split("").map((c, i) =>
        c === " "
          ? { char: " ", resolved: true, opacity: 1 }
          : { char: randomChar(), resolved: false, opacity: 0.35 }
      )
    );

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const globalProgress = Math.min(elapsed / totalDuration, 1);

      setChars((prev) =>
        prev.map((sc, i) => {
          if (sc.char === " ") return sc;
          if (sc.resolved) return sc;

          const staggerStart = i * (totalDuration * 0.6 / len);
          const staggerProgress = Math.min((elapsed - staggerStart) / (totalDuration * 0.4), 1);

          if (staggerProgress <= 0) {
            return { ...sc, char: randomChar(), opacity: 0.35 };
          }

          const resolveProb = staggerProgress * staggerProgress;
          if (Math.random() < resolveProb * 0.4) {
            return { char: finalText[i], resolved: true, opacity: 1 };
          }

          return { ...sc, char: randomChar(), opacity: 0.35 + staggerProgress * 0.65 };
        })
      );

      if (globalProgress >= 1) {
        setChars(finalText.split("").map((c) => ({ char: c, resolved: true, opacity: 1 })));
        setIsDone(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 40);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [trigger, finalText, totalDuration]);

  return { chars, isDone };
}
