/**
 * page.tsx — Raw hero: Canvas (3D) + headline only.
 * Stats, Features, Pricing COMMENTED OUT until 3D is visible.
 */

export default function HomePage() {
  return (
    <main className="relative z-10 bg-transparent pointer-events-none min-h-screen">
      {/* ═══ HERO: 3D canvas fills viewport behind. Headline on top. ═══ */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center text-center bg-transparent"
        style={{ pointerEvents: 'none' }}
      >
        <h1
          className="text-display font-bold"
          style={{
            fontSize: 'clamp(32px, 6vw, 72px)',
            lineHeight: 1.1,
            color: 'rgba(224,232,240,0.95)',
            pointerEvents: 'auto',
          }}
        >
          The Operating System
          <br />
          for <span className="text-gradient">Youth Athletes</span>
        </h1>
      </section>

      {/* ─── COMMENTED OUT until 3D visible ─────────────────────────────────
      <NavbarShell />
      <StatsSection />
      <CarouselSection />
      <FeaturesSection />
      <ProblemSection />
      <PricingSection />
      <FooterSection />
      ───────────────────────────────────────────────────────────────────── */}
    </main>
  )
}
