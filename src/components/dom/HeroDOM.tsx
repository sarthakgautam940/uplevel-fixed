'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useStore } from '@/lib/store'
import AnimatedText from './AnimatedText'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HeroDOM() {
  const containerRef  = useRef<HTMLDivElement>(null)
  const badgeRef      = useRef<HTMLDivElement>(null)
  const monoRef       = useRef<HTMLParagraphElement>(null)
  const subRef        = useRef<HTMLParagraphElement>(null)
  const ctaRef        = useRef<HTMLDivElement>(null)
  const scrollRef     = useRef<HTMLDivElement>(null)
  const { introComplete, scrollY } = useStore()

  // Entrance animation after intro
  useEffect(() => {
    if (!introComplete) return
    if (!containerRef.current) return

    const badge = badgeRef.current
    const mono = monoRef.current
    const sub = subRef.current
    const cta = ctaRef.current
    const scroll = scrollRef.current
    if (!badge || !mono || !sub || !cta || !scroll) return

    const tl = gsap.timeline({ delay: 0.15 })

    tl.fromTo(badge, { opacity: 0, y: 20, filter: 'blur(4px)' }, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.7,
      ease: 'power3.out',
    })
      .fromTo(mono, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, '-=0.35')
      .fromTo(sub, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.35')
      .fromTo(cta, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
      .fromTo(scroll, { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.2')

    return () => {
      tl.kill()
    }
  }, [introComplete])

  // Parallax fade on scroll
  const heroOpacity = Math.max(0, 1 - scrollY / 500)
  const heroY       = scrollY * -0.18

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ zIndex: 10 }}
    >
      <div
        ref={containerRef}
        className="relative w-full max-w-[1320px] mx-auto px-8 md:px-16 lg:px-24 pt-40 pb-32 text-center"
        style={{
          opacity: heroOpacity,
          transform: `translateY(${heroY}px)`,
        }}
      >
        {/* Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-10 opacity-0"
          style={{
            background: 'rgba(0,230,118,0.06)',
            border: '1px solid rgba(0,230,118,0.18)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#00E676', boxShadow: '0 0 6px #00E676' }}
          />
          <span
            className="text-[11px] font-bold tracking-[0.14em] uppercase"
            style={{ color: '#00E676', fontFamily: 'monospace' }}
          >
            Open Beta — 14 Days Free
          </span>
        </div>

        {/* Headline — AnimatedText handles word-by-word reveal */}
        <div className="mb-6">
          <AnimatedText
            text="The Operating System"
            as="h1"
            className="font-black tracking-tight block"
            style={{ fontSize: 'clamp(52px, 7.5vw, 96px)', lineHeight: 1.05 }}
            delay={0.2}
            stagger={0.07}
            trigger="scroll"
          />
          <div style={{ fontSize: 'clamp(52px, 7.5vw, 96px)', lineHeight: 1.05 }}>
            <AnimatedText
              text="for "
              as="span"
              className="font-black tracking-tight"
              delay={0.55}
              stagger={0.07}
              trigger="scroll"
            />
            <AnimatedText
              text="Youth Athletes"
              as="span"
              className="font-black tracking-tight"
              style={{
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundImage: 'linear-gradient(135deg, #00E676 0%, #00A3FF 100%)',
              }}
              delay={0.65}
              stagger={0.07}
              trigger="scroll"
            />
          </div>
        </div>

        {/* Monospace sub detail */}
        <p
          ref={monoRef}
          className="font-mono text-xs tracking-[0.25em] uppercase mb-4 opacity-0"
          style={{ color: '#2a3f52' }}
        >
          Training · Analytics · Nutrition · Recovery · AI Coaching
        </p>

        {/* Subheadline */}
        <p
          ref={subRef}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-14 leading-relaxed opacity-0"
          style={{ color: '#6a7e8e' }}
        >
          Six integrated performance modules unified in one platform.
          Built for soccer. Designed for every athlete.
        </p>

        {/* CTA */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-5 opacity-0">
          <Link
            href="/signup"
            className="group relative flex items-center gap-3 px-10 py-4 rounded-full font-bold text-[15px] transition-all duration-300"
            style={{
              background: '#00E676',
              color: '#060B14',
              boxShadow: '0 0 32px rgba(0,230,118,0.25)',
            }}
            onMouseEnter={e => {
              gsap.to(e.currentTarget, { scale: 1.04, boxShadow: '0 0 48px rgba(0,230,118,0.45)', duration: 0.3 })
            }}
            onMouseLeave={e => {
              gsap.to(e.currentTarget, { scale: 1, boxShadow: '0 0 32px rgba(0,230,118,0.25)', duration: 0.3 })
            }}
          >
            Start Free Trial
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>

          <Link
            href="/features"
            className="flex items-center gap-3 px-10 py-4 rounded-full font-bold text-[15px] transition-all duration-300"
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#8a9daf',
              backdropFilter: 'blur(10px)',
            }}
            onMouseEnter={e => {
              gsap.to(e.currentTarget, { borderColor: 'rgba(0,230,118,0.4)', color: '#00E676', duration: 0.3 })
            }}
            onMouseLeave={e => {
              gsap.to(e.currentTarget, { borderColor: 'rgba(255,255,255,0.1)', color: '#8a9daf', duration: 0.3 })
            }}
          >
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              ▶
            </span>
            See How It Works
          </Link>
        </div>

        {/* Scroll indicator */}
        <div
          ref={scrollRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0"
          style={{ opacity: Math.max(0, 1 - scrollY / 120) }}
        >
          <span className="font-mono text-[9px] tracking-[0.25em] uppercase" style={{ color: '#2a3f52' }}>
            Scroll to explore
          </span>
          <div
            className="w-px h-14 relative overflow-hidden"
            style={{ background: 'rgba(42,63,82,0.4)' }}
          >
            <div
              className="absolute inset-x-0 top-0 h-5"
              style={{
                background: 'linear-gradient(to bottom, #00E676, transparent)',
                animation: 'scrollLine 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollLine {
          0%   { transform: translateY(-20px); opacity: 0; }
          40%  { opacity: 1; }
          100% { transform: translateY(56px); opacity: 0; }
        }
      `}</style>
    </section>
  )
}
