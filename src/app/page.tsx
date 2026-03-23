/**
 * page.tsx — Root page shell.
 *
 * Architecture: each section is a named slot. Phase 2-5 components drop into
 * these slots without touching the page structure.
 *
 * Section map:
 *  <Navbar />              — Phase 5 (kinetic links, magnetic CTA)
 *  <HeroSection />         — Phase 2/3/5 (3D object + DOM overlay + word reveals)
 *  <StatsSection />        — Phase 5 (counter animation)
 *  <CarouselSection />     — Phase 4 (WebGL planes + DOM label)
 *  <FeaturesSection />     — Phase 5 (pinned horizontal scroll + tilt cards)
 *  <ProblemSection />      — Phase 5 (scroll reveals)
 *  <PricingSection />      — Phase 5 (glass card)
 *  <FooterSection />       — Phase 5 (massive GSAP masked text reveal)
 *
 * Right now each section renders a structural placeholder so the page has
 * correct scroll height for testing PostProcessing and CameraRig scroll math.
 */

import dynamic from 'next/dynamic'
import NavbarShell from '@/components/dom/NavbarShell'

// Phase 5 dynamic imports (uncomment as built):
// const Navbar          = dynamic(() => import('@/components/dom/Navbar'))
// const HeroDOM         = dynamic(() => import('@/components/dom/HeroDOM'),         { ssr: false })
// const StatsSection    = dynamic(() => import('@/components/dom/StatsSection'),    { ssr: false })
// const FeaturesSection = dynamic(() => import('@/components/dom/FeaturesSection'), { ssr: false })
// const FooterReveal    = dynamic(() => import('@/components/dom/FooterReveal'),    { ssr: false })

export default function HomePage() {
  return (
    <>
      {/* ── Navbar placeholder ── */}
      <NavbarShell />

      <main>
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        {/* Phase 2: <HeroObject /> in canvas + Phase 5: <HeroDOM /> over it */}
        <HeroSection />

        {/* ── STATS STRIP ──────────────────────────────────────────────── */}
        <StatsSection />

        {/* ── CAROUSEL ─────────────────────────────────────────────────── */}
        {/* Phase 4: WebGL planes scroll-synced via ScrollTrigger */}
        <CarouselSection />

        {/* ── FEATURES ─────────────────────────────────────────────────── */}
        {/* Phase 5: pinned horizontal + tilt cards */}
        <FeaturesSection />

        {/* ── PROBLEM ──────────────────────────────────────────────────── */}
        <ProblemSection />

        {/* ── PRICING ──────────────────────────────────────────────────── */}
        <PricingSection />

        {/* ── FOOTER ───────────────────────────────────────────────────── */}
        {/* Phase 5: massive masked SMARTPLAY text reveal */}
        <FooterSection />
      </main>
    </>
  )
}

// ─── Structural placeholders ──────────────────────────────────────────────────
// Each has exact dimensions so scroll math works now.
// Replace with real components in each phase.

function HeroSection() {
  // 100vh — WebGL object fills this in Phase 2; Phase 5 adds DOM overlay
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center text-center"
      style={{ zIndex: 10, padding: '160px clamp(24px,6vw,96px) 80px' }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-10 glass-neon"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#00FF88' }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: '#00FF88', boxShadow: '0 0 7px #00FF88' }} />
          Open Beta — 14 Days Free
        </div>

        {/* Headline — Phase 5 splits these into .word-clip/.word-inner */}
        <h1
          id="hero-headline"
          className="text-display mb-5"
          style={{ fontSize: 'clamp(48px, 7.5vw, 96px)', lineHeight: 1.04 }}
        >
          The Operating System
          <br />
          for{' '}
          <span className="text-gradient">Youth Athletes</span>
        </h1>

        {/* Mono tag */}
        <p
          id="hero-mono"
          className="text-mono mb-5"
          style={{ fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#28394a' }}
        >
          Training · Analytics · Nutrition · Recovery · AI Coaching
        </p>

        {/* Sub */}
        <p
          id="hero-sub"
          style={{ fontSize: 17, color: '#4a6070', maxWidth: 520, margin: '0 auto 48px', lineHeight: 1.65 }}
        >
          Six integrated performance modules unified in one platform.
          Built for soccer. Designed for every athlete.
        </p>

        {/* CTAs */}
        <div id="hero-cta" className="flex gap-4 justify-center flex-wrap">
          <a href="/signup" className="btn-primary">Start Free Trial →</a>
          <a href="#features" className="btn-secondary">▶&nbsp;&nbsp;See How It Works</a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-mono" style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#1a2535' }}>Scroll</span>
        <div className="w-px h-11 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #1a2535, transparent)' }}>
          <div className="absolute inset-x-0 top-0 h-3.5 animate-scroll-line" style={{ background: '#00FF88' }} />
        </div>
      </div>
    </section>
  )
}

function StatsSection() {
  const stats = [
    { n: '2,400+', label: 'Active Athletes',  target: 2400, pfx: '',  sfx: '+',  dec: 0 },
    { n: '96%',    label: 'Retention Rate',   target: 96,   pfx: '',  sfx: '%',  dec: 0 },
    { n: '4.9',    label: 'App Store Rating', target: 4.9,  pfx: '',  sfx: '',   dec: 1 },
    { n: '$12/mo', label: 'Per Athlete',      target: 12,   pfx: '$', sfx: '/mo',dec: 0 },
  ]
  return (
    <section
      id="stats"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', zIndex: 10, position: 'relative' }}
    >
      <div className="section-max" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
        {stats.map((s, i) => (
          <div
            key={s.label}
            data-stat
            data-target={s.target}
            data-pfx={s.pfx}
            data-sfx={s.sfx}
            data-dec={s.dec}
            className="text-center"
            style={{ padding: '40px 20px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
          >
            <div
              className="stat-number text-gradient font-black"
              style={{ fontSize: 'clamp(44px,5vw,64px)', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 6 }}
            >
              {s.n}
            </div>
            <div className="text-mono" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2a3f52' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function CarouselSection() {
  // Phase 4: WebGL planes positioned at Y=-4.5 in scene, appear as user scrolls here
  return (
    <section
      id="carousel-section"
      className="relative"
      style={{ minHeight: '150vh', zIndex: 10 }}
    >
      <div className="sticky top-0 flex flex-col items-center justify-center" style={{ height: '100vh', pointerEvents: 'none' }}>
        <div className="eyebrow text-center">Athlete Gallery</div>
        <h2
          className="text-display text-center"
          style={{ fontSize: 'clamp(32px, 4.5vw, 58px)' }}
        >
          Performance in motion
        </h2>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    { n:'01', title:'Training Intelligence',  color:'#00FF88' },
    { n:'02', title:'Nutrition & Hydration',  color:'#00A3FF' },
    { n:'03', title:'Recovery & Readiness',   color:'#7B2FFF' },
    { n:'04', title:'Mental Performance',     color:'#FF6B35' },
    { n:'05', title:'Video Review + AI',      color:'#00FF88' },
    { n:'06', title:'SmartPlay AI',           color:'#00A3FF' },
  ]
  return (
    <section id="features" className="section-py section-px" style={{ position: 'relative', zIndex: 10 }}>
      <div className="section-max">
        <div className="eyebrow">Platform Modules</div>
        <h2 className="text-display mb-16" style={{ fontSize: 'clamp(30px, 4.5vw, 58px)' }}>
          Six systems. One platform.
        </h2>
        {/* Phase 5: becomes horizontal pinned scroll + tilt cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          {features.map(f => (
            <div key={f.n} className="feat-card">
              <div className="text-mono mb-4" style={{ fontSize: 10, color: f.color, opacity: 0.5 }}>{f.n}</div>
              <div className="font-bold text-[17px] tracking-tight">{f.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProblemSection() {
  return (
    <section id="problem" className="section-py section-px" style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
      <div className="section-max">
        <div className="eyebrow" style={{ color: '#00A3FF' }}>The Problem</div>
        <h2 className="text-display mb-5" style={{ fontSize: 'clamp(34px, 5vw, 62px)', maxWidth: 680, margin: '0 auto 18px' }}>
          Elite tools have always been <span className="text-gradient">out of reach</span>
        </h2>
        <p style={{ fontSize: 17, color: '#4a6070', maxWidth: 520, margin: '0 auto 60px', lineHeight: 1.65 }}>
          GPS vests cost $300+. Elite platforms start at $50/seat. Youth athletes
          are training blind. SmartPlay changes this at $12/month.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, textAlign: 'left' }}>
          {[
            { x: '×', title: 'Fragmented Data',  desc: 'Training in one app, nutrition in another, sleep on a watch. Nothing connects.', color: '#FF5252' },
            { x: '×', title: 'Cost Barrier',      desc: 'Pro platforms price out families. $500/month is not youth sports.',             color: '#FFD600' },
            { x: '×', title: 'No Ecosystem',      desc: 'Coaches, parents, athletes — different tools, none with the full picture.',     color: '#00A3FF' },
          ].map(p => (
            <div key={p.title} className="feat-card">
              <div className="font-black text-[38px] mb-4" style={{ color: p.color, opacity: 0.55 }}>{p.x}</div>
              <div className="font-bold text-[17px] mb-2">{p.title}</div>
              <div style={{ fontSize: 13, color: '#4a6070', lineHeight: 1.6 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  return (
    <section id="pricing" className="section-px" style={{ paddingBottom: 'clamp(64px,8vw,128px)', position: 'relative', zIndex: 10 }}>
      <div className="section-max">
        <div
          className="glass-neon rounded-[28px] text-center relative overflow-hidden"
          style={{ padding: 'clamp(48px,8vw,80px)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,255,136,0.06), transparent 65%)' }}
          />
          <div className="eyebrow">Pricing</div>
          <div className="font-black" style={{ fontSize: 'clamp(80px,12vw,160px)', letterSpacing: '-0.06em', color: 'rgba(255,255,255,0.04)', lineHeight: 1 }}>$12</div>
          <div className="font-bold text-[22px] mb-3 -mt-5">Per athlete, per month.</div>
          <p style={{ fontSize: 15, color: '#4a6070', maxWidth: 400, margin: '0 auto 36px', lineHeight: 1.6 }}>
            All 6 modules. No wearables. No upsells.
          </p>
          <a href="/signup" className="btn-primary">Start 14-Day Free Trial →</a>
          <div className="text-mono mt-5" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2a3f52' }}>
            No credit card · No contracts · Cancel anytime
          </div>
        </div>
      </div>
    </section>
  )
}

function FooterSection() {
  // Phase 5: giant SMARTPLAY text scales in, background transitions to black
  return (
    <footer
      id="footer"
      className="relative overflow-hidden"
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      <div
        id="footer-text"
        className="font-black text-center leading-none select-none"
        style={{
          fontSize:  'clamp(72px, 20vw, 280px)',
          letterSpacing: '-0.06em',
          background: 'linear-gradient(135deg, rgba(0,255,136,0.07), rgba(0,163,255,0.05))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          position: 'relative',
          zIndex: 2,
        }}
      >
        SMART
        <br />
        PLAY
      </div>
      <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center gap-5 z-10">
        <a href="/signup" className="btn-primary">Start Free — 14 Days →</a>
        <div className="flex gap-6 text-mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2a3f52' }}>
          {['Privacy', 'Terms', 'Contact', 'Status'].map(l => (
            <a key={l} href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
        <div className="text-mono" style={{ fontSize: 9, color: '#1a2535', letterSpacing: '0.15em' }}>
          © 2026 SmartPlay Inc. · All rights reserved
        </div>
      </div>
    </footer>
  )
}
