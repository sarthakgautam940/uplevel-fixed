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
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    lenis = new Lenis({
      lerp:          0.10,
      smoothWheel:   true,
      syncTouch:     false,
      touchMultiplier: 1.8,
      infinite:      false,
      autoRaf:       false,
    })

    const raf = (time: number) => { lenis?.raf(time * 1000) }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const onRefresh = () => lenis?.resize()
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

    ScrollTrigger.addEventListener('refresh', onRefresh)
    ScrollTrigger.refresh()

    return () => {
      lenis?.destroy()
      lenis = null
      gsap.ticker.remove(raf)
      ScrollTrigger.removeEventListener('refresh', onRefresh)
    }
  }, [])

  return null
}
