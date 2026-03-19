import { useCallback } from "react";

export function useHaptics() {
  const vibrate = useCallback((pattern: number | number[] = 8) => {
    if (typeof window === "undefined") return;
    if (!navigator.vibrate) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      navigator.vibrate(pattern);
    } catch {
      // Silently fail — iOS, desktop browsers don't support this
    }
  }, []);

  return { vibrate };
}
