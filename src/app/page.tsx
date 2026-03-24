'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrambleText from '@/components/ui/ScrambleText'
import GlowButton   from '@/components/ui/GlowButton'
import HeroMarquee  from '@/components/dom/HeroMarquee'

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  const [introReady, setIntroReady] = useState(false)
  const navRef   = useRef<HTMLElement>(null)
  const heroRef  = useRef<HTMLElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const subRef   = useRef<HTMLParagraphElement>(null)
  const ctaRef   = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const navScrolled = useRef(false)

  // Trigger scramble + fade-ins on mount
  useEffect(() => {
    const t = setTimeout(() => setIntroReady(true), 300)
    return () => clearTimeout(t)
  }, [])

  // GSAP entrance cascade after scramble starts
  useEffect(() => {
    if (!introReady) return
    const ctx = gsap.context(() => {
      gsap.set([badgeRef.current, subRef.current, ctaRef.current, statsRef.current], {
        opacity: 0, y: 28,
      })
      const tl = gsap.timeline({ delay: 0.3 })
      tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' })
        .to(subRef.current,   { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.45')
        .to(ctaRef.current,   { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.45')
        .to(statsRef.current, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.45')
    })
    return () => ctx.revert()
  }, [introReady])

  // Navbar scroll state
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 50
      if (scrolled !== navScrolled.current && navRef.current) {
        navScrolled.current = scrolled
        gsap.to(navRef.current, {
          backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'blur(0px)',
          backgroundColor: scrolled ? 'rgba(4,9,15,0.8)' : 'rgba(4,9,15,0)',
          borderBottomColor: scrolled ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0)',
          duration: 0.4,
          ease: 'power2.out',
        })
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════
          NAVBAR
      ════════════════════════════════════════════════════════════════ */}
      <nav
        ref={navRef}
        style={{
          position:        'fixed',
          top:             0,
          left:            0,
          right:           0,
          zIndex:          50,
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'space-between',
          padding:         '20px clamp(24px, 6vw, 80px)',
          background:      'rgba(4,9,15,0)',
          borderBottom:    '1px solid rgba(255,255,255,0)',
          transition:      'all 0.4s ease',
          pointerEvents:   'auto',
        }}
      >
        {/* Logo — slot text effect */}
        <a href="/" style={{ textDecoration: 'none' }}>
          <div
            style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: '#e0e8f0', position: 'relative', overflow: 'hidden' }}
          >
            <span>Smart</span>
            <span style={{ color: '#00FF88' }}>Play</span>
          </div>
        </a>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          {['Features', 'Pricing', 'Coaches', 'About'].map(l => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              style={{
                fontFamily:   'var(--font-mono)',
                fontSize:     11,
                letterSpacing:'0.12em',
                textTransform:'uppercase',
                color:        '#2a3f52',
                textDecoration: 'none',
                transition:   'color 0.3s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#00FF88')}
              onMouseLeave={e => (e.currentTarget.style.color = '#2a3f52')}
            >
              {l}
            </a>
          ))}
        </div>

        {/* CTA */}
        <GlowButton href="/login" color="#00FF88">
          Get Started →
        </GlowButton>
      </nav>

      {/* ════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        id="hero"
        style={{
          minHeight:      '100vh',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          textAlign:      'center',
          padding:        '160px clamp(24px, 6vw, 96px) 0',
          pointerEvents:  'auto',
          position:       'relative',
          zIndex:         10,
        }}
      >
        {/* Badge */}
        <div
          ref={badgeRef}
          style={{
            display:        'inline-flex',
            alignItems:     'center',
            gap:            8,
            padding:        '8px 20px',
            borderRadius:   100,
            border:         '1px solid rgba(0,255,136,0.22)',
            background:     'rgba(0,255,136,0.05)',
            backdropFilter: 'blur(10px)',
            marginBottom:   32,
            fontFamily:     'var(--font-mono)',
            fontSize:       10,
            letterSpacing:  '0.14em',
            textTransform:  'uppercase',
            color:          '#00FF88',
          }}
        >
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#00FF88', boxShadow: '0 0 8px #00FF88',
            animation: 'pulseDot 2s ease-in-out infinite',
            display: 'inline-block',
          }} />
          Open Beta — 14 Days Free
        </div>

        {/* Headline — ScrambleText on all three lines */}
        <h1
          style={{
            fontSize:      'clamp(52px, 8vw, 100px)',
            fontWeight:    800,
            letterSpacing: '-0.035em',
            lineHeight:    1.02,
            marginBottom:  20,
            color:         '#e0e8f0',
            maxWidth:      900,
          }}
        >
          <div style={{ overflow: 'hidden', marginBottom: '0.05em' }}>
            <ScrambleText
              text="Train smarter."
              trigger={introReady}
              delay={0}
              style={{ display: 'block' }}
            />
          </div>
          <div style={{ overflow: 'hidden', marginBottom: '0.05em' }}>
            <ScrambleText
              text="Study harder."
              trigger={introReady}
              delay={180}
              style={{ display: 'block', color: '#c8d8e8' }}
            />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <ScrambleText
              text="Play at your peak."
              trigger={introReady}
              delay={360}
              style={{
                display:              'block',
                background:           'linear-gradient(135deg, #00FF88, #00A3FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
              }}
            />
          </div>
        </h1>

        {/* Sub */}
        <p
          ref={subRef}
          style={{
            fontSize:    18,
            color:       '#4a6070',
            maxWidth:    520,
            margin:      '0 auto 48px',
            lineHeight:  1.65,
            fontWeight:  400,
          }}
        >
          The only platform that unifies training load, academic stress,
          and recovery to maximize your soccer performance.
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <GlowButton href="/signup?role=athlete" color="#00FF88">
            I&apos;m an Athlete →
          </GlowButton>
          <GlowButton href="/signup?role=coach" color="#00A3FF">
            I&apos;m a Coach
          </GlowButton>
        </div>

        {/* Social proof */}
        <div
          ref={statsRef}
          style={{
            marginTop:  56,
            display:    'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap:        32,
          }}
        >
          {[
            { n: '10k+',  label: 'Athletes',  color: '#00FF88' },
            { n: '500+',  label: 'Coaches',   color: '#00A3FF' },
            { n: '4.9★', label: 'App Store', color: '#7B2FFF' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              {i > 0 && (
                <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.05)' }} />
              )}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize:      26,
                  fontWeight:    800,
                  color:         s.color,
                  letterSpacing: '-0.03em',
                  lineHeight:    1,
                  marginBottom:  4,
                }}>
                  <ScrambleText text={s.n} trigger={introReady} delay={600 + i * 80} />
                </div>
                <div style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      10,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color:         '#2a3f52',
                }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position:       'absolute',
            bottom:         28,
            left:           '50%',
            transform:      'translateX(-50%)',
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            gap:            8,
            opacity:        introReady ? 1 : 0,
            transition:     'opacity 1s ease 1.5s',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#1a2535' }}>
            Scroll
          </span>
          <div style={{ width: 1, height: 44, background: 'linear-gradient(to bottom, #1a2535, transparent)', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position:   'absolute',
              inset:      '0 0 auto',
              height:     14,
              background: '#00FF88',
              animation:  'scrollLine 2.1s ease-in-out infinite',
            }} />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          MARQUEE — Huly-style infinite readout
      ════════════════════════════════════════════════════════════════ */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <HeroMarquee />
      </div>

      {/* ════════════════════════════════════════════════════════════════
          CAROUSEL SECTION
          The WebGL carousel renders at Y=-4 in 3D space and is
          revealed as the camera zooms forward on scroll.
          This DOM section provides the scroll height + label.
      ════════════════════════════════════════════════════════════════ */}
      <section
        id="carousel-section"
        style={{
          minHeight:     '200vh',
          position:      'relative',
          zIndex:        10,
          pointerEvents: 'none',
        }}
      >
        {/* Sticky header — visible while carousel scrolls */}
        <div
          style={{
            position:       'sticky',
            top:            0,
            height:         '100vh',
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'flex-start',
            paddingTop:     72,
          }}
        >
          <div style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      10,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color:         '#00FF88',
            marginBottom:  12,
          }}>
            Platform
          </div>
          <h2 style={{
            fontSize:      'clamp(28px, 4vw, 52px)',
            fontWeight:    800,
            letterSpacing: '-0.03em',
            textAlign:     'center',
          }}>
            Performance in motion
          </h2>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          PROBLEM SECTION
      ════════════════════════════════════════════════════════════════ */}
      <section
        id="features"
        style={{
          padding:        'clamp(64px,10vw,128px) clamp(24px,6vw,96px)',
          position:       'relative',
          zIndex:         10,
          pointerEvents:  'auto',
        }}
      >
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      10,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color:         '#00A3FF',
            marginBottom:  14,
          }}>
            The Problem
          </div>
          <h2 style={{
            fontSize:      'clamp(34px, 5vw, 64px)',
            fontWeight:    800,
            letterSpacing: '-0.03em',
            marginBottom:  18,
            maxWidth:      680,
          }}>
            Elite tools have always been{' '}
            <span style={{
              background:           'linear-gradient(135deg, #00FF88, #00A3FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}>
              out of reach.
            </span>
          </h2>
          <p style={{ fontSize: 17, color: '#4a6070', maxWidth: 520, lineHeight: 1.65, marginBottom: 56 }}>
            GPS vests cost $300+. Elite platforms charge $50/seat.
            Most youth athletes train blind. SmartPlay changes this at $12/month.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {[
              { x: '×', title: 'Fragmented Data',  desc: 'Training in one app, nutrition in another, sleep on a watch. Nothing connects.',             color: '#FF5252' },
              { x: '×', title: 'Cost Barrier',      desc: 'Pro platforms price out the families who need them most. $500/month is not youth sports.', color: '#FFD600' },
              { x: '×', title: 'No Ecosystem',      desc: 'Coaches, parents, athletes — all on different tools, none with the full picture.',          color: '#00A3FF' },
            ].map(p => (
              <div
                key={p.title}
                style={{
                  background:     'rgba(8,14,22,0.88)',
                  border:         '1px solid rgba(255,255,255,0.05)',
                  borderRadius:   20,
                  padding:        28,
                  backdropFilter: 'blur(20px)',
                  transition:     'border-color 0.3s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${p.color}22`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)')}
              >
                <div style={{ fontSize: 38, fontWeight: 900, color: p.color, opacity: 0.55, marginBottom: 14 }}>{p.x}</div>
                <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 9 }}>{p.title}</div>
                <div style={{ fontSize: 13, color: '#4a6070', lineHeight: 1.6 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          PRICING
      ════════════════════════════════════════════════════════════════ */}
      <section
        id="pricing"
        style={{
          padding:       '0 clamp(24px,6vw,96px) clamp(64px,10vw,128px)',
          position:      'relative',
          zIndex:        10,
          pointerEvents: 'auto',
        }}
      >
        <div
          style={{
            maxWidth:       1320,
            margin:         '0 auto',
            background:     'rgba(8,14,22,0.9)',
            border:         '1px solid rgba(0,255,136,0.12)',
            borderRadius:   28,
            padding:        'clamp(48px,8vw,80px)',
            textAlign:      'center',
            position:       'relative',
            overflow:       'hidden',
          }}
        >
          <div
            style={{
              position:       'absolute',
              inset:          0,
              background:     'radial-gradient(ellipse at 50% 0%, rgba(0,255,136,0.07), transparent 60%)',
              pointerEvents:  'none',
            }}
          />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#00FF88', marginBottom: 14 }}>
            Pricing
          </div>
          <div style={{ fontSize: 'clamp(80px,14vw,180px)', fontWeight: 900, letterSpacing: '-0.06em', color: 'rgba(255,255,255,0.04)', lineHeight: 1 }}>
            $12
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, marginTop: -16 }}>Per athlete, per month.</div>
          <p style={{ fontSize: 15, color: '#4a6070', maxWidth: 400, margin: '0 auto 36px', lineHeight: 1.6 }}>
            All 6 modules. No wearables. No upsells.
          </p>
          <GlowButton href="/signup" color="#00FF88">
            Start 14-Day Free Trial →
          </GlowButton>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2a3f52', marginTop: 18 }}>
            No credit card · No contracts · Cancel anytime
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════ */}
      <footer
        id="footer"
        style={{
          minHeight:     '100vh',
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          justifyContent:'center',
          position:      'relative',
          zIndex:        10,
          pointerEvents: 'auto',
          overflow:      'hidden',
        }}
      >
        {/* Massive masked text reveal */}
        <div
          id="footer-text"
          style={{
            fontSize:             'clamp(72px, 20vw, 280px)',
            fontWeight:           900,
            letterSpacing:        '-0.06em',
            lineHeight:           0.85,
            textAlign:            'center',
            background:           'linear-gradient(135deg, rgba(0,255,136,0.08), rgba(0,163,255,0.06))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor:  'transparent',
            backgroundClip:       'text',
            position:             'relative',
            zIndex:               2,
            userSelect:           'none',
          }}
        >
          SMART
          <br />
          PLAY
        </div>

        {/* Footer CTA */}
        <div style={{ position: 'absolute', bottom: 64, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, zIndex: 10 }}>
          <GlowButton href="/signup" color="#00FF88">
            Start Free — 14 Days →
          </GlowButton>
          <div style={{ display: 'flex', gap: 24, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2a3f52' }}>
            {['Privacy', 'Terms', 'Contact', 'Status'].map(l => (
              <a key={l} href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s' }}
                 onMouseEnter={e => (e.currentTarget.style.color = '#00FF88')}
                 onMouseLeave={e => (e.currentTarget.style.color = '#2a3f52')}>
                {l}
              </a>
            ))}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#1a2535', letterSpacing: '0.15em' }}>
            © 2026 SmartPlay Inc. · All rights reserved
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulseDot  { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes scrollLine{ 0%{transform:translateY(-14px);opacity:0} 40%{opacity:1} 100%{transform:translateY(44px);opacity:0} }
      `}</style>
    </>
  )
}
