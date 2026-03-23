'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Smooth scroll + ScrollTrigger sync (Step 1 — lenis dependency).
 * Disabled when prefers-reduced-motion is set.
 */
export default function LenisRoot() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let lenis: Lenis | null = null
    try {
      document.documentElement.classList.add('lenis', 'lenis-smooth')

      lenis = new Lenis({
        duration: 1.15,
        touchMultiplier: 1.5,
      })

      lenis.on('scroll', ScrollTrigger.update)
      requestAnimationFrame(() => ScrollTrigger.refresh())

      const onTick = (time: number) => {
        lenis?.raf(time * 1000)
      }
      gsap.ticker.add(onTick)
      gsap.ticker.lagSmoothing(0)

      return () => {
        gsap.ticker.remove(onTick)
        lenis?.destroy()
        document.documentElement.classList.remove('lenis', 'lenis-smooth')
      }
    } catch (e) {
      console.error('[LenisRoot] smooth scroll disabled:', e)
      document.documentElement.classList.remove('lenis', 'lenis-smooth')
    }
  }, [])

  return null
}
