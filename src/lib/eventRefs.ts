/**
 * eventRefs — Ref-based high-frequency input (mouse, scroll).
 *
 * WHY REFS:
 *   EventBridge updates 60+ times/sec on mouse/scroll. Writing to Zustand
 *   causes 60+ re-renders of HeroObject, CameraRig, GridBackground, PostProcessing.
 *   That triggers React #185 (maximum update depth exceeded).
 *
 *   Refs never trigger re-renders. Components read in useFrame only.
 *   Zero state updates = zero render loops.
 */

export interface EventRefs {
  mouseX: number
  mouseY: number
  mouseVel: number
  mouseVelX: number
  mouseVelY: number
  scrollY: number
  scrollProgress: number
  scrollVel: number
}

export const eventRefs: EventRefs = {
  mouseX:      0,
  mouseY:      0,
  mouseVel:    0,
  mouseVelX:   0,
  mouseVelY:   0,
  scrollY:     0,
  scrollProgress: 0,
  scrollVel:   0,
}
