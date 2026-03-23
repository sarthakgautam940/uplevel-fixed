'use client'

/**
 * EventBridge — mounts once in layout, feeds all raw DOM events into the
 * Zustand store via requestAnimationFrame for consistent 60fps reads.
 *
 * Architecture note:
 *  • Mouse: tracks position AND velocity (delta since last frame).
 *    Velocity feeds the glass distortion amplitude in Phase 2.
 *  • Scroll: tracks Y, 0..1 progress, AND velocity (for CA spike).
 *    Scroll velocity is used by postprocessing to punch up ChromaticAberration
 *    on fast scrolls — a key part of the cinematic feel.
 *  • Both update on RAF, not directly on the event, to prevent jank.
 */

import { useEffect } from 'react'
import { useStore } from '@/lib/store'

export default function EventBridge() {
  const { setMouse, setScroll } = useStore()

  useEffect(() => {
    // ── Mouse ──────────────────────────────────────────────────────────────
    let rafMouse     = 0
    let rawNormX     = 0, rawNormY    = 0
    let rawPxX       = 0, rawPxY      = 0
    let prevNormX    = 0, prevNormY   = 0
    let mouseUpdated = false

    const onMouseMove = (e: MouseEvent) => {
      prevNormX = rawNormX
      prevNormY = rawNormY
      rawNormX  =  (e.clientX / window.innerWidth)  * 2 - 1   // -1..1
      rawNormY  = -((e.clientY / window.innerHeight) * 2 - 1)  // -1..1 (Y flipped for WebGL)
      rawPxX    = e.clientX
      rawPxY    = e.clientY
      mouseUpdated = true
    }

    const tickMouse = () => {
      if (mouseUpdated) {
        const velX = rawNormX - prevNormX
        const velY = rawNormY - prevNormY
        setMouse(rawNormX, rawNormY, rawPxX, rawPxY, velX, velY)
        mouseUpdated = false
      }
      rafMouse = requestAnimationFrame(tickMouse)
    }
    tickMouse()
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // ── Scroll ─────────────────────────────────────────────────────────────
    let rafScroll    = 0
    let currentScrollY  = 0
    let prevScrollY     = 0
    let scrollUpdated   = false

    const onScroll = () => {
      prevScrollY    = currentScrollY
      currentScrollY = window.scrollY
      scrollUpdated  = true
    }

    const tickScroll = () => {
      if (scrollUpdated) {
        const totalH   = document.documentElement.scrollHeight - window.innerHeight
        const progress = totalH > 0 ? currentScrollY / totalH : 0
        const vel      = currentScrollY - prevScrollY
        setScroll(currentScrollY, progress, vel)
        scrollUpdated  = false
      }
      rafScroll = requestAnimationFrame(tickScroll)
    }
    tickScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(rafMouse)
      cancelAnimationFrame(rafScroll)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [setMouse, setScroll])

  return null
}
