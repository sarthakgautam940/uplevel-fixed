import dynamic from 'next/dynamic'
import Navbar       from '@/components/dom/Navbar'
import HeroDOM      from '@/components/dom/HeroDOM'
import StatsSection from '@/components/dom/StatsSection'

// Sections with GSAP — SSR disabled to prevent hydration mismatch
const FeaturesSSR = dynamic(() => import('@/components/dom/FeaturesSection'), { ssr: false })
const FooterSSR   = dynamic(() => import('@/components/dom/FooterReveal'),    { ssr: false })

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero: 100vh — WebGL object floats here in the Canvas layer behind */}
        <HeroDOM />

        {/* Stats strip — tight below hero */}
        <StatsSection />

        {/* Spacer — carousel section trigger point for WebGL image planes */}
        <div id="carousel-section" className="relative z-10" style={{ minHeight: '130vh' }}>
          {/* Label overlay for the WebGL carousel */}
          <div
            className="relative z-10 pt-20 px-8 md:px-24 text-center"
            style={{ pointerEvents: 'none' }}
          >
            <div
              className="font-mono text-[10px] tracking-[0.35em] uppercase mb-4"
              style={{ color: '#00E676' }}
            >
              Athlete Gallery
            </div>
            <h2
              className="font-black tracking-tight"
              style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}
            >
              Performance in motion
            </h2>
          </div>
        </div>

        {/* Horizontal pinned features */}
        <FeaturesSSR />

        {/* Buffer section — roles, testimonials, pricing live here */}
        <ProblemSolutionSections />

        {/* Footer — GSAP pin + scale reveal */}
        <FooterSSR />
      </main>
    </>
  )
}

// ─── Inline sections (no separate files for brevity) ──────────────────────────
function ProblemSolutionSections() {
  return (
    <div className="relative" style={{ zIndex: 10 }}>
      {/* Problem section */}
      <section className="py-28 max-w-[1320px] mx-auto px-8 md:px-16 lg:px-24 text-center">
        <div
          className="font-mono text-[10px] tracking-[0.35em] uppercase mb-6"
          style={{ color: '#00A3FF' }}
        >
          The Problem
        </div>
        <h2
          className="font-black tracking-tight mb-6 max-w-3xl mx-auto"
          style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
        >
          Elite tools have always been{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #00E676, #00A3FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            out of reach
          </span>
        </h2>
        <p
          className="text-lg max-w-2xl mx-auto"
          style={{ color: '#4a6070', lineHeight: 1.7 }}
        >
          GPS vests cost $300+. Elite platforms start at $50/seat per month. Most youth
          athletes are training blind — no data, no feedback, no direction. SmartPlay
          fixes this at $12/month for everything.
        </p>

        {/* Problem cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-16 text-left">
          {[
            { n: '×', title: 'Fragmented data', desc: 'Training in one app, nutrition in another, sleep on a watch. Nothing talks to each other.', color: '#FF5252' },
            { n: '×', title: 'Cost barrier', desc: 'Pro platforms price out the families who need them most. $500/month is not youth sports.', color: '#FFD600' },
            { n: '×', title: 'No ecosystem', desc: 'Coaches, parents, athletes — all using different tools, none with the full picture.', color: '#00A3FF' },
          ].map((p) => (
            <div
              key={p.title}
              className="rounded-2xl p-8"
              style={{
                background: 'rgba(8,14,22,0.7)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div
                className="text-4xl font-black mb-5"
                style={{ color: p.color, opacity: 0.6 }}
              >
                {p.n}
              </div>
              <h3 className="font-bold text-lg mb-3">{p.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#4a6070' }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="py-20 max-w-[1320px] mx-auto px-8 md:px-16 lg:px-24">
        <div
          className="relative rounded-3xl p-12 md:p-16 text-center overflow-hidden"
          style={{
            background: 'rgba(8,14,22,0.9)',
            border: '1px solid rgba(0,230,118,0.12)',
          }}
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,230,118,0.05), transparent 70%)' }}
          />
          <div
            className="font-mono text-[10px] tracking-[0.35em] uppercase mb-6"
            style={{ color: '#00E676' }}
          >
            Pricing
          </div>
          <div
            className="font-black tracking-tighter mb-2"
            style={{ fontSize: 'clamp(72px, 10vw, 128px)', lineHeight: 1, color: 'rgba(255,255,255,0.06)' }}
          >
            $12
          </div>
          <div
            className="font-bold text-2xl mb-4 -mt-6"
            style={{ color: '#e0e8f0' }}
          >
            Per athlete, per month.
          </div>
          <p className="text-base mb-10 max-w-lg mx-auto" style={{ color: '#4a6070' }}>
            All 6 modules. No wearables. No upsells. Less than a bag of sports tape.
          </p>
          <a
            href="/signup"
            className="inline-flex items-center gap-3 px-12 py-5 rounded-full font-bold text-base"
            style={{ background: '#00E676', color: '#060B14', boxShadow: '0 0 40px rgba(0,230,118,0.25)' }}
          >
            Start 14-Day Free Trial →
          </a>
          <p
            className="mt-5 font-mono text-[10px] tracking-[0.2em] uppercase"
            style={{ color: '#2a3f52' }}
          >
            No credit card · No contracts · Cancel anytime
          </p>
        </div>
      </section>
    </div>
  )
}
