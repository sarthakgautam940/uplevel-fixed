"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDeviceProfile } from "../hooks/useDeviceProfile";

export default function ScrollBar() {
  const profile = useDeviceProfile();
  const [scrollPercent, setScrollPercent] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(80);

  const handleScroll = useCallback(() => {
    const el = document.documentElement;
    const scrollTop = window.scrollY;
    const maxScroll = el.scrollHeight - el.clientHeight;
    setScrollPercent(maxScroll > 0 ? scrollTop / maxScroll : 0);
  }, []);

  useEffect(() => {
    if (profile.isMobile) return;
    const updateThumb = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = window.innerHeight / document.documentElement.scrollHeight;
      setThumbHeight(Math.max(40, Math.min(window.innerHeight, window.innerHeight * ratio)));
    };
    updateThumb();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateThumb);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateThumb);
    };
  }, [profile.isMobile, handleScroll]);

  const handleTrackClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const percent = clickY / rect.height;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: percent * maxScroll, behavior: "smooth" });
  }, []);

  if (profile.isMobile) return null;

  const thumbTop = scrollPercent * (window.innerHeight - thumbHeight);

  return (
    <div
      className="fixed right-0 top-0 bottom-0 z-[9999] hidden lg:block"
      style={{
        width: "8px",
        height: "100vh",
        background: "rgba(196,154,76,0.15)",
      }}
      aria-hidden="true"
    >
      {/* Track — gold line */}
      <div
        onClick={handleTrackClick}
        className="absolute cursor-pointer"
        style={{
          right: "3px",
          top: 0,
          bottom: 0,
          width: "2px",
          background: "rgba(196,154,76,0.4)",
        }}
      />
      {/* Thumb — ice blue indicator */}
      <motion.div
        className="absolute right-0 rounded-t"
        style={{
          width: "8px",
          height: thumbHeight,
          top: thumbTop,
          background: "rgba(139,168,196,0.85)",
        }}
        animate={{ top: thumbTop }}
        transition={{ type: "tween", duration: 0 }}
      />
    </div>
  );
}
