'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedText from './AnimatedText'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { value: 2400,  suffix: '+',  label: 'Active Athletes',  prefix: '',  decimals: 0 },
  { value: 96,    suffix: '%',  label: 'Retention Rate',   prefix: '',  decimals: 0 },
  { value: 4.9,   suffix: '',   label: 'App Store Rating', prefix: '',  decimals: 1 },
  { value: 12,    suffix: '/mo',label: 'Per Athlete',      prefix: '$', decimals: 0 },
]

function StatItem({ value, suffix, label, prefix, decimals, index }: typeof STATS[0] & { index: number }) {
  const numRef  = useRef<HTMLSpanElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!numRef.current || !cardRef.current) return

    const el = numRef.current
    const card = cardRef.current

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`
      return
    }

    const obj = { val: 0 }

    const st = ScrollTrigger.create({
      trigger: card,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: value,
          duration: 1.8,
          delay: index * 0.15,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${prefix}${obj.val.toFixed(decimals)}${suffix}`
          },
        })
      },
    })

    return () => {
      st.kill()
    }
  }, [value, suffix, prefix, decimals, index])

  return (
    <div
      ref={cardRef}
      className="relative flex flex-col items-center text-center group py-10 px-6"
    >
      {/* Vertical separator */}
      {index > 0 && (
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-16 hidden md:block"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        />
      )}

      <span
        ref={numRef}
        className="font-black tracking-tighter block mb-2"
        style={{
          fontSize: 'clamp(52px, 6vw, 80px)',
          background: 'linear-gradient(135deg, #00E676 0%, #00A3FF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
        }}
      >
        {prefix}0{suffix}
      </span>

      <span
        className="font-mono text-[10px] tracking-[0.2em] uppercase"
        style={{ color: '#2a3f52' }}
      >
        {label}
      </span>

      {/* Hover underline */}
      <div
        className="absolute bottom-0 left-[20%] right-[20%] h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
        style={{ background: 'linear-gradient(90deg, #00E676, #00A3FF)' }}
      />
    </div>
  )
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { opacity: 1 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true,
          },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-12"
      style={{ zIndex: 10, opacity: 0 }}
    >
      {/* Hairline borders top + bottom */}
      <div
        className="absolute top-0 left-8 right-8 h-px"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      />
      <div
        className="absolute bottom-0 left-8 right-8 h-px"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      />

      {/* Background gradient strip */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,230,118,0.02), transparent 70%)' }}
      />

      <div className="max-w-[1320px] mx-auto px-8 md:px-16 lg:px-24">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s, i) => (
            <StatItem key={s.label} {...s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
