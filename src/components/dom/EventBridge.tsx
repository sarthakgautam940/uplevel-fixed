'use client'

import { useEffect } from 'react'
import { useStore } from '@/lib/store'

// Mounted once in layout — bridges DOM events into the Zustand store
// so both the WebGL Scene and DOM components share the same state.

export default function EventBridge() {
  const { setMouse, setScroll } = useStore()

  useEffect(() => {
    // ─── Mouse ──────────────────────────────────────────────────────────────
    let rafMouse = 0
    let rawX = 0, rawY = 0
    let normX = 0, normY = 0

    const onMouseMove = (e: MouseEvent) => {
      rawX  = e.clientX
      rawY  = e.clientY
      normX = (e.clientX / window.innerWidth)  * 2 - 1   // -1..1
      normY = -((e.clientY / window.innerHeight) * 2 - 1) // -1..1 (Y inverted for WebGL)
    }

    const tickMouse = () => {
      setMouse(normX, normY, rawX, rawY)
      rafMouse = requestAnimationFrame(tickMouse)
    }
    tickMouse()
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // ─── Scroll ─────────────────────────────────────────────────────────────
    let rafScroll = 0
    let scrollY = 0

    const onScroll = () => { scrollY = window.scrollY }
    const tickScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      const progress = total > 0 ? scrollY / total : 0
      setScroll(progress, scrollY)
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
