"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useDeviceProfile } from "../hooks/useDeviceProfile";
import { useHaptics } from "../hooks/useHaptics";

const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });
const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });
const ScrollUnlock = dynamic(() => import("./ScrollUnlock"), { ssr: false });
const CopyToast = dynamic(() => import("./CopyToast"), { ssr: false });
const NoiseOverlay = dynamic(() => import("./NoiseOverlay"), { ssr: false });
const GridLayer = dynamic(() => import("./GridLayer"), { ssr: false });
const WarmGlowLayer = dynamic(() => import("./WarmGlowLayer"), { ssr: false });

export default function ClientShell() {
  const profile = useDeviceProfile();
  const { vibrate } = useHaptics();

  useEffect(() => {
    const firedSections = new Set<string>();
    const sectionIds = ["manifesto", "portfolio", "process", "testimonials", "contact"];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting && id && !firedSections.has(id)) {
            firedSections.add(id);
            vibrate([12, 50, 8]);
          }
        }
      },
      { threshold: 0.3 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [vibrate]);

  return (
    <>
      {/* Fixed background layers — disabled on low-power devices */}
      {!profile.isLowPower && <WarmGlowLayer />}
      {!profile.isLowPower && <GridLayer />}
      {!profile.isLowPower && <ParticleField />}
      {!profile.isLowPower && <NoiseOverlay />}
      {/* UI overlays — always rendered */}
      <CustomCursor />
      <ScrollUnlock />
      <CopyToast />
    </>
  );
}
