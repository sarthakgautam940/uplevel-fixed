"use client";

import { useState, useEffect } from "react";

export type DeviceProfile = {
  isMobile: boolean;
  isTouch: boolean;
  isLowPower: boolean;
  prefersReducedMotion: boolean;
};

export function useDeviceProfile(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>({
    isMobile: false,
    isTouch: false,
    isLowPower: false,
    prefersReducedMotion: false,
  });

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const touch = navigator.maxTouchPoints > 0;
    const lowPower = mobile || touch;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    setProfile({
      isMobile: mobile,
      isTouch: touch,
      isLowPower: lowPower,
      prefersReducedMotion: reducedMotion,
    });
  }, []);

  return profile;
}
