"use client";

import { useEffect, useState, useCallback } from "react";

export default function ScrollProgress() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [thumbHeight, setThumbHeight] = useState(60);

  const updateScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? scrollTop / docHeight : 0;
    setScrollPercent(percent);
    const ratio = window.innerHeight / document.documentElement.scrollHeight;
    setThumbHeight(Math.max(40, Math.min(200, ratio * window.innerHeight)));
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, [isMobile, updateScroll]);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPercent = (e.clientY - rect.top) / rect.height;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: clickPercent * maxScroll, behavior: "smooth" });
  };

  if (isMobile) return null;

  const thumbTop = typeof window !== "undefined"
    ? scrollPercent * (window.innerHeight - thumbHeight)
    : 0;

  return (
    <div
      onClick={handleTrackClick}
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        width: "6px",
        height: "100vh",
        zIndex: 9999,
        cursor: "pointer",
      }}
      aria-hidden="true"
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "1px",
          background: "rgba(196,154,76,0.25)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: `${thumbHeight}px`,
          top: `${thumbTop}px`,
          background: "rgba(139,168,196,0.75)",
          borderRadius: "0 0 3px 3px",
          transition: "top 50ms linear",
        }}
      />
    </div>
  );
}
