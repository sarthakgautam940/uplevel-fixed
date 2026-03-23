'use client'

/**
 * EventBridge — mounts once in layout, feeds all raw DOM events into
 * eventRefs for high-frequency reads (60fps). Refs never trigger re-renders,
 * which fixes React #185 (max update depth) caused by R3F components
 * re-rendering 60×/sec when mouse/scroll were in Zustand.
 *
 * Architecture:
 *  • Mouse: position + velocity → eventRefs (HeroObject, CameraRig read in useFrame)
 *  • Scroll: Y, progress, velocity → eventRefs (PostProcessing, GridBackground read in useFrame)
 *  • Store still used for introComplete, glitch (low-frequency).
 */

import { useEffect } from 'react'
import { eventRefs } from '@/lib/eventRefs'
import { getLenis } from './LenisRoot'

export default function EventBridge() {
  useEffect(() => {
    let rawNormX     = 0, rawNormY    = 0
    let prevNormX    = 0, prevNormY   = 0
    let mouseUpdated = false

    const onMouseMove = (e: MouseEvent) => {
      prevNormX = rawNormX
      prevNormY = rawNormY
      rawNormX  =  (e.clientX / window.innerWidth)  * 2 - 1
      rawNormY  = -((e.clientY / window.innerHeight) * 2 - 1)
      mouseUpdated = true
    }

    const tickMouse = () => {
      if (mouseUpdated) {
        const velX = rawNormX - prevNormX
        const velY = rawNormY - prevNormY
        eventRefs.mouseX    = rawNormX
        eventRefs.mouseY    = rawNormY
        eventRefs.mouseVelX = velX
        eventRefs.mouseVelY = velY
        eventRefs.mouseVel  = Math.sqrt(velX * velX + velY * velY)
        mouseUpdated = false
      }
      requestAnimationFrame(tickMouse)
    }
    tickMouse()
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // ── Scroll: sample every frame (Lenis interpolates, so we need per-frame reads)
    let prevScrollY = 0

    const tickScroll = () => {
      const lenis = getLenis()
      const scroll = lenis ? lenis.scroll : window.scrollY
      const totalH = document.documentElement.scrollHeight - window.innerHeight
      const progress = totalH > 0 ? scroll / totalH : 0
      const vel = scroll - prevScrollY
      prevScrollY = scroll
      eventRefs.scrollY = scroll
      eventRefs.scrollProgress = progress
      eventRefs.scrollVel = vel
      requestAnimationFrame(tickScroll)
    }
    tickScroll()

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return null
}
