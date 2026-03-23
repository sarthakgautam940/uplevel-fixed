/**
 * page.tsx — Dark cyber-athletic layout.
 *
 * Hero: dominated by R3F 3D glass canvas. Minimal DOM overlay.
 * Sections: dark theme, neon accents, cyber aesthetic.
 */

import NavbarShell from '@/components/dom/NavbarShell'

export default function HomePage() {
  return (
    <>
      <NavbarShell />

      <main>
        <HeroSection />
        <StatsSection />
        <CarouselSection />
        <FeaturesSection />
        <ProblemSection />
        <PricingSection />
        <FooterSection />
      </main>
    </>
  )
}

// ─── Hero: 3D glass canvas dominates. DOM overlay strictly transparent. ───────
function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-end text-center"
      style={{
        zIndex: 10,
        padding: 'clamp(80px, 12vh, 160px) clamp(24px, 6vw, 96px) clamp(60px, 10vh, 120px)',
        pointerEvents: 'none',
        background: 'transparent',
      }}
    >
      {/* Minimal overlay — 3D glass visible behind. pointer-events: auto for CTAs. */}
      <div style={{ maxWidth: 720, margin: '0 auto', pointerEvents: 'auto' }}>
        <h1
          id="hero-headline"
          className="text-display mb-3"
          style={{
            fontSize: 'clamp(36px, 6vw, 72px)',
            lineHeight: 1.08,
            color: 'rgba(224,232,240,0.95)',
            textShadow: '0 0 60px rgba(0,255,136,0.15)',
          }}
        >
          The Operating System
          <br />
          for <span className="text-gradient">Youth Athletes</span>
        </h1>
        <p
          className="text-mono mb-8"
          style={{ fontSize: 10, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(0,255,136,0.7)' }}
        >
          Training · Analytics · Nutrition · Recovery · AI Coaching
        </p>
        <a href="/signup" className="btn-primary">Start Free Trial →</a>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-mono" style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(0,255,136,0.4)' }}>Scroll</span>
        <div className="w-px h-10" style={{ background: 'linear-gradient(to bottom, rgba(0,255,136,0.5), transparent)' }} />
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
