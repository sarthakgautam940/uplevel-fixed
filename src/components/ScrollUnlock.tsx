"use client";

import { useEffect } from "react";

/**
 * Guarantees scroll is unlocked on mount.
 * Fixes mobile scroll lock on initial load.
 */
export default function ScrollUnlock() {
  useEffect(() => {
    document.body.style.overflow = "";
    document.body.style.overflowY = "";
    document.body.style.position = "";
    document.body.style.width = "";
    document.body.style.height = "";
    document.documentElement.style.overflow = "";
    document.documentElement.style.overflowY = "";
  }, []);

  return null;
}
