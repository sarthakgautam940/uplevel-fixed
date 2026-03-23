'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedText from './AnimatedText'

gsap.registerPlugin(ScrollTrigger)

const FEATURES = [
  {
    n: '01',
    title: 'Training Intelligence',
    desc: 'Log every session. Track acute/chronic workload ratio. AI flags overtraining risk before it costs you a game.',
    stat: '34%', statLabel: 'injury reduction',
    color: '#00E676',
  },
  {
    n: '02',
    title: 'Nutrition & Hydration',
    desc: 'Budget-friendly meal planning with macro targeting. Pre/post-match protocols. No dietitian required.',
    stat: '2.4×', statLabel: 'energy consistency',
    color: '#00A3FF',
  },
  {
    n: '03',
    title: 'Recovery & Readiness',
    desc: 'Daily readiness score from sleep quality, soreness, mood, and HRV. Know when to push and when to rest.',
    stat: '87', statLabel: 'avg readiness score',
    color: '#7B2FFF',
  },
  {
    n: '04',
    title: 'Mental Performance',
    desc: 'Evidence-based journaling. Visualization protocols. Anxiety tracking. Sports psychology in your pocket.',
    stat: '91%', statLabel: 'confidence increase',
    color: '#FF6B35',
  },
  {
    n: '05',
    title: 'Video Review + AI',
    desc: 'Upload clips from any device. AI identifies key moments, tracks runs, and generates technical feedback.',
    stat: '6 min', statLabel: 'avg review time',
    color: '#00E676',
  },
  {
    n: '06',
    title: 'SmartPlay AI',
    desc: 'Weekly performance summaries. Pre-match prep protocols. Post-game analysis. Your own AI performance coach.',
    stat: '3.8×', statLabel: 'development velocity',
    color: '#00A3FF',
  },
]

export default function FeaturesSection() {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const trackRef    = useRef<HTMLDivElement>(null)
  const cardsRef    = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const totalWidth = track.scrollWidth
      const viewWidth = track.offsetWidth
      const scrollDist = Math.max(0, totalWidth - viewWidth)

      if (reduced) {
        gsap.set(track, { x: 0 })
        cardsRef.current.forEach((card) => {
          if (card) gsap.set(card, { opacity: 1, y: 0, scale: 1 })
        })
        return
      }

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${scrollDist + window.innerHeight}`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          gsap.set(track, { x: -self.progress * scrollDist })
        },
      })

      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.fromTo(
          card,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: `top+=${i * 80} top`,
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ height: '100vh', zIndex: 10 }}
    >
      {/* Section header — fixed inside pin */}
      <div className="absolute top-0 left-0 right-0 z-10 pt-20 px-8 md:px-16 lg:px-24 pb-10">
        <div className="flex items-end justify-between">
          <div>
            <div
              className="font-mono text-[10px] tracking-[0.35em] uppercase mb-4"
              style={{ color: '#00E676' }}
            >
              Platform Modules
            </div>
            <AnimatedText
              text="Six systems. One platform."
              as="h2"
              className="font-black tracking-tight"
              style={{ fontSize: 'clamp(36px, 4.5vw, 64px)' }}
            />
          </div>
          <div
            className="hidden md:block font-mono text-xs"
            style={{ color: '#2a3f52' }}
          >
            ← Drag to explore →
          </div>
        </div>
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        className="absolute top-0 left-0 flex items-end pb-16 gap-5"
        style={{
          paddingTop: '160px',
          paddingLeft: '8vw',
          paddingRight: '8vw',
          willChange: 'transform',
        }}
      >
        {FEATURES.map((f, i) => (
          <div
            key={f.n}
            ref={el => { cardsRef.current[i] = el }}
            className="flex-shrink-0 relative rounded-2xl p-8 group cursor-default"
            style={{
              width: 'clamp(300px, 28vw, 420px)',
              height: 'clamp(340px, 40vh, 500px)',
              background: 'rgba(8,14,22,0.85)',
              border: '1px solid rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              transform: `translateY(${i % 2 === 0 ? 0 : 32}px)`,   // stagger vertical
            }}
          >
            {/* Corner number */}
            <div
              className="absolute top-8 right-8 font-mono font-bold"
              style={{ fontSize: '11px', color: f.color, opacity: 0.5 }}
            >
              {f.n}
            </div>

            {/* Color accent line */}
            <div
              className="absolute top-0 left-8 right-8 h-px"
              style={{ background: f.color, opacity: 0.4 }}
            />

            {/* Top glow */}
            <div
              className="absolute top-0 left-0 right-0 h-32 rounded-t-2xl pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 50% 0%, ${f.color}08, transparent)` }}
            />

            {/* Content */}
            <div className="flex flex-col h-full">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-6 text-sm font-bold"
                style={{ background: `${f.color}10`, border: `1px solid ${f.color}20`, color: f.color }}
              >
                {i + 1}
              </div>

              <h3 className="font-bold text-xl mb-3 tracking-tight">{f.title}</h3>

              <p
                className="text-sm leading-relaxed flex-1"
                style={{ color: '#4a6070' }}
              >
                {f.desc}
              </p>

              {/* Stat */}
              <div
                className="mt-6 pt-6 border-t flex items-baseline gap-3"
                style={{ borderColor: 'rgba(255,255,255,0.05)' }}
              >
                <span className="font-black text-3xl" style={{ color: f.color }}>{f.stat}</span>
                <span className="font-mono text-xs" style={{ color: '#2a3f52' }}>{f.statLabel}</span>
              </div>
            </div>

            {/* Hover bottom bar */}
            <div
              className="absolute bottom-0 left-8 right-8 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
              style={{ background: f.color }}
            />
          </div>
        ))}

        {/* Final CTA card */}
        <div
          className="flex-shrink-0 rounded-2xl flex flex-col items-center justify-center text-center p-8"
          style={{
            width: 'clamp(240px, 22vw, 340px)',
            height: 'clamp(340px, 40vh, 500px)',
            border: '1px solid rgba(0,230,118,0.15)',
            background: 'rgba(0,230,118,0.03)',
            transform: 'translateY(0px)',
          }}
        >
          <div
            className="text-4xl font-black tracking-tight mb-4"
            style={{
              background: 'linear-gradient(135deg, #00E676, #00A3FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            All 6
            <br />
            Modules
          </div>
          <p className="text-sm mb-6" style={{ color: '#4a6070' }}>
            $12/month. Less than a protein shake per week.
          </p>
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm"
            style={{ background: '#00E676', color: '#060B14' }}
          >
            Start Free →
          </a>
        </div>
      </div>
    </section>
  )
}
