'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useStore } from '@/lib/store'
import Link from 'next/link'

function GlitchLink({ href, children }: { href: string; children: string }) {
  const ref = useRef<HTMLAnchorElement>(null)

  const handleEnter = () => {
    const el = ref.current
    if (!el) return
    const tl = gsap.timeline()
    tl.to(el, { skewX: 10, duration: 0.05, ease: 'none' })
      .to(el, { skewX: -6, duration: 0.04, ease: 'none' })
      .to(el, { skewX: 3, duration: 0.04, ease: 'none' })
      .to(el, { skewX: 0, duration: 0.08, ease: 'power2.out' })
  }

  return (
    <Link
      ref={ref}
      href={href}
      className="relative font-mono text-xs tracking-[0.15em] uppercase transition-colors duration-300 group"
      style={{ color: '#3a4f62', display: 'inline-block' }}
      onMouseEnter={handleEnter}
    >
      <span className="group-hover:text-[#00E676] transition-colors duration-300">{children}</span>
      <span
        className="absolute bottom-0 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
        style={{ background: '#00E676' }}
      />
    </Link>
  )
}

export default function Navbar() {
  const navRef       = useRef<HTMLElement>(null)
  const { scrollY, introComplete } = useStore()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!introComplete) return
    const el = navRef.current
    if (!el) return
    gsap.fromTo(
      el,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.2 }
    )
    setVisible(true)
  }, [introComplete])

  const scrolled = scrollY > 40

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 opacity-0"
      style={{
        padding: scrolled ? '14px 0' : '22px 0',
        background: scrolled ? 'rgba(4,9,15,0.75)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.04)' : 'none',
        transition: 'padding 0.4s ease, background 0.4s ease',
      }}
    >
      <div className="max-w-[1320px] mx-auto px-8 md:px-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.2)' }}
          >
            <span className="text-[10px] font-black" style={{ color: '#00E676' }}>SP</span>
          </div>
          <span className="font-black text-sm tracking-tight">
            Smart<span style={{ color: '#00E676' }}>Play</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <GlitchLink href="/features">Features</GlitchLink>
          <GlitchLink href="/pricing">Pricing</GlitchLink>
          <GlitchLink href="/about">About</GlitchLink>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden md:block font-mono text-xs tracking-[0.12em] uppercase transition-colors duration-300"
            style={{ color: '#3a4f62' }}
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 rounded-full font-bold text-xs tracking-wide transition-all duration-300"
            style={{
              background: '#00E676',
              color: '#060B14',
              boxShadow: '0 0 20px rgba(0,230,118,0.2)',
            }}
          >
            Start Free
          </Link>
        </div>
      </div>

      {/* Bottom neon line — only when scrolled */}
      <div
        className="absolute bottom-0 left-0 h-px transition-opacity duration-500"
        style={{
          width: `${Math.min(100, scrollY / 10)}%`,
          background: 'linear-gradient(90deg, transparent, #00E676, transparent)',
          opacity: scrolled ? 0.6 : 0,
        }}
      />
    </nav>
  )
}
