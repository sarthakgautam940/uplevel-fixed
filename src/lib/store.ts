import { create } from 'zustand'

interface SmartPlayStore {
  // Mouse state — normalized -1..1
  mouseX: number
  mouseY: number
  mouseRawX: number
  mouseRawY: number
  setMouse: (x: number, y: number, rx: number, ry: number) => void

  // Scroll
  scrollProgress: number      // 0..1 full page
  scrollY: number             // raw px
  setScroll: (progress: number, y: number) => void

  // Intro
  introComplete: boolean
  setIntroComplete: () => void

  // Glitch trigger — pulse on intro end
  glitchActive: boolean
  triggerGlitch: () => void
}

export const useStore = create<SmartPlayStore>((set) => ({
  mouseX: 0,
  mouseY: 0,
  mouseRawX: 0,
  mouseRawY: 0,
  setMouse: (x, y, rx, ry) => set({ mouseX: x, mouseY: y, mouseRawX: rx, mouseRawY: ry }),

  scrollProgress: 0,
  scrollY: 0,
  setScroll: (progress, y) => set({ scrollProgress: progress, scrollY: y }),

  introComplete: false,
  setIntroComplete: () => set({ introComplete: true }),

  glitchActive: false,
  triggerGlitch: () => {
    set({ glitchActive: true })
    setTimeout(() => set({ glitchActive: false }), 1200)
  },
}))
