import { create } from 'zustand'
import * as THREE from 'three'

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AppStore {
  // ── Mouse (normalized -1..1 for WebGL, raw px for DOM) ──
  mouseX:    number
  mouseY:    number
  mouseRawX: number
  mouseRawY: number
  // Velocity (delta per frame — fed to glass distortion amplitude)
  mouseVelX: number
  mouseVelY: number
  mouseVel:  number   // magnitude, pre-calculated

  // ── Scroll ──
  scrollY:        number   // raw pixels
  scrollProgress: number   // 0..1 over total document
  scrollVel:      number   // pixels/frame delta (for CA spike)

  // ── Scene state ──
  introComplete:  boolean
  glitchActive:   boolean
  glitchStrength: number   // 0..1 — postprocessing reads this for CA + glitch

  // ── Actions ──
  setMouse:    (x: number, y: number, rawX: number, rawY: number, velX: number, velY: number) => void
  setScroll:   (y: number, progress: number, vel: number) => void
  setIntroComplete: () => void
  triggerGlitch:    (strength?: number) => void
  decayGlitch:      () => void
}

export const useStore = create<AppStore>((set) => ({
  // Mouse
  mouseX:    0, mouseY:    0,
  mouseRawX: 0, mouseRawY: 0,
  mouseVelX: 0, mouseVelY: 0,
  mouseVel:  0,

  // Scroll
  scrollY:        0,
  scrollProgress: 0,
  scrollVel:      0,

  // Scene
  // NOTE: set true here until Phase 3 (Intro) is built.
  // Phase 3 will set this to false initially and fire setIntroComplete() on complete.
  introComplete:  true,
  glitchActive:   false,
  glitchStrength: 0,

  // ── Actions ──
  setMouse: (x, y, rawX, rawY, velX, velY) => set({
    mouseX:    x,    mouseY:    y,
    mouseRawX: rawX, mouseRawY: rawY,
    mouseVelX: velX, mouseVelY: velY,
    mouseVel:  Math.sqrt(velX * velX + velY * velY),
  }),

  setScroll: (y, progress, vel) => set({
    scrollY: y, scrollProgress: progress, scrollVel: vel,
  }),

  setIntroComplete: () => set({ introComplete: true }),

  // Glitch: set strength, flag active, auto-decay in subsequent frames
  triggerGlitch: (strength = 1.0) => set({ glitchActive: true, glitchStrength: strength }),

  // Called every frame from Scene's useFrame — exponential decay
  decayGlitch: () => set((state) => {
    const next = state.glitchStrength * 0.88   // decay rate
    return {
      glitchStrength: next,
      glitchActive:   next > 0.015,
    }
  }),
}))

// ─── Convenience selector hooks ───────────────────────────────────────────────
export const useMouse    = () => useStore((s) => ({ x: s.mouseX, y: s.mouseY, vel: s.mouseVel, velX: s.mouseVelX, velY: s.mouseVelY }))
export const useScroll   = () => useStore((s) => ({ y: s.scrollY, progress: s.scrollProgress, vel: s.scrollVel }))
export const useIntro    = () => useStore((s) => ({ complete: s.introComplete, set: s.setIntroComplete }))
export const useGlitch   = () => useStore((s) => ({ active: s.glitchActive, strength: s.glitchStrength, trigger: s.triggerGlitch, decay: s.decayGlitch }))
