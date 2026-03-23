'use client'

/**
 * LenisRoot — initialises Lenis smooth scroll and syncs it to GSAP's
 * ScrollTrigger ticker. This is the correct integration pattern:
 *
 *   Lenis scroll → update GSAP ticker → ScrollTrigger recalculates
 *
 * Without this, GSAP ScrollTrigger runs against native scroll position
 * while Lenis provides a different interpolated position, causing
 * jitter and missed triggers.
 *
 * Architecture notes:
 *  • Lenis is initialised ONCE globally — do NOT create multiple instances.
 *  • lerp: 0.1 → smooth, responsive but not laggy.
 *  • smoothWheel: true, smoothTouch: false → desktop-optimised.
 *  • prefers-reduced-motion: auto-disables Lenis so users get native scroll.
 */

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

export function getLenis() { return lenis }

export default function LenisRoot() {
  useEffect(() => {
    // Respect prefers-reduced-motion
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    lenis = new Lenis({
      lerp:          0.10,
      smoothWheel:   true,
      syncTouch:     false,
      touchMultiplier: 1.8,
      infinite:      false,
      autoRaf:       false,   // We drive it manually via GSAP ticker
    })

    // ── Sync Lenis → GSAP ticker ──────────────────────────────────────────
    // GSAP's ticker is frame-synced. Lenis must update in the same frame
    // so ScrollTrigger reads the correct interpolated scroll position.
    gsap.ticker.add((time) => {
      lenis?.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)   // disable lag smoothing for accurate times

    // ── Tell ScrollTrigger to use Lenis scroll values ─────────────────────
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length && lenis) {
          lenis.scrollTo(value as number, { immediate: true })
        }
        return lenis?.scroll ?? window.scrollY
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
      },
      pinType: document.body.style.transform ? 'transform' : 'fixed',
    })

    ScrollTrigger.addEventListener('refresh', () => lenis?.resize())
    ScrollTrigger.refresh()

    return () => {
      lenis?.destroy()
      lenis = null
      gsap.ticker.remove(() => {})
      ScrollTrigger.removeEventListener('refresh', () => {})
    }
  }, [])

  return null
}
