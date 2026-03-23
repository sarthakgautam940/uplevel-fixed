'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function FooterReveal() {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const textRef     = useRef<HTMLDivElement>(null)
  const maskRef     = useRef<HTMLDivElement>(null)
  const bgRef       = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const section = sectionRef.current
    const text    = textRef.current
    const mask    = maskRef.current
    const bg      = bgRef.current
    if (!section || !text || !mask || !bg) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 1.2,
        pin: false,
      },
    })

    // Background fades from transparent to solid black
    tl.fromTo(bg,
      { backgroundColor: 'rgba(4,9,15,0)' },
      { backgroundColor: 'rgba(0,0,0,1)', ease: 'none' },
      0
    )

    // Text scales up from 40px to 200px equivalent — massive reveal
    tl.fromTo(text,
      { scale: 0.3, opacity: 0, filter: 'blur(20px)' },
      { scale: 1,   opacity: 1, filter: 'blur(0px)',   ease: 'power2.out' },
      0
    )

    // Mask height shrinks revealing the giant text underneath
    tl.fromTo(mask,
      { scaleY: 1, transformOrigin: 'top' },
      { scaleY: 0, transformOrigin: 'top', ease: 'power2.inOut' },
      0.1
    )

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === section) t.kill()
      })
    }
  }, [])

  return (
    <footer ref={sectionRef} className="relative overflow-hidden" style={{ minHeight: '100vh', zIndex: 10 }}>
      {/* Animated background that goes to black */}
      <div
        ref={bgRef}
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(4,9,15,0)' }}
      />

      {/* Mask overlay — covers the big text, shrinks away as you scroll */}
      <div
        ref={maskRef}
        className="absolute inset-0 z-10"
        style={{ background: '#04090f', transformOrigin: 'top' }}
      />

      {/* Giant masked text */}
      <div
        ref={textRef}
        className="relative z-20 flex flex-col items-center justify-center h-full py-32 select-none"
        style={{ minHeight: '100vh' }}
      >
        {/* Massive wordmark */}
        <div
          className="font-black tracking-tighter leading-none text-center"
          style={{
            fontSize: 'clamp(72px, 18vw, 260px)',
            background: 'linear-gradient(135deg, rgba(0,230,118,0.08) 0%, rgba(0,163,255,0.05) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          SMART
          <br />
          PLAY
        </div>

        {/* Sub text below big word */}
        <div
          className="mt-16 flex flex-col items-center gap-8"
          style={{ opacity: 0.5 }}
        >
          <p
            className="font-mono text-xs tracking-[0.4em] uppercase"
            style={{ color: '#2a3f52' }}
          >
            The Operating System for Youth Athletes
          </p>

          <div
            className="flex items-center gap-8 font-mono text-[10px] tracking-[0.2em] uppercase"
            style={{ color: '#1a2535' }}
          >
            {['Privacy', 'Terms', 'Contact', 'Status'].map(link => (
              <a
                key={link}
                href="#"
                className="hover:text-[#00E676] transition-colors duration-300"
              >
                {link}
              </a>
            ))}
          </div>

          <p
            className="font-mono text-[9px] tracking-[0.2em]"
            style={{ color: '#1a2535' }}
          >
            © 2026 SmartPlay Inc. · All rights reserved
          </p>
        </div>
      </div>

      {/* CTA inside footer */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 flex flex-col items-center gap-6 pb-20"
        style={{ opacity: 0.9 }}
      >
        <a
          href="/signup"
          className="inline-flex items-center gap-3 px-12 py-5 rounded-full font-bold text-base transition-all duration-300"
          style={{
            background: '#00E676',
            color: '#060B14',
            boxShadow: '0 0 40px rgba(0,230,118,0.2)',
          }}
        >
          Start Free — 14 Days
          <span>→</span>
        </a>
        <p
          className="font-mono text-[10px] tracking-[0.2em] uppercase"
          style={{ color: '#2a3f52' }}
        >
          No credit card · No wearables · Cancel anytime
        </p>
      </div>
    </footer>
  )
}
