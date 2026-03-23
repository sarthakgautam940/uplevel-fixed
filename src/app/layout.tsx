/**
 * Root Layout — establishes the 3-layer architecture:
 *
 *   Layer 0 (z:0)   — R3F <Canvas>   fixed, full-screen, pointer-none
 *   Layer 10 (z:10) — DOM content    scrolls normally above canvas
 *   Layer 50 (z:50) — Navbar         fixed, sits above both
 *   Layer 200 (z:200) — Intro overlay fullscreen, fades out (Phase 3)
 *
 * Dynamic import rules:
 *  • Scene:       ssr:false — Three.js/WebGL cannot run server-side
 *  • EventBridge: ssr:false — window/document accessed on mount
 *  • LenisRoot:   ssr:false — needs DOM to calculate scroll height
 *  • Intro:       ssr:false — GSAP animations need browser
 *
 * All other components (Navbar, page content) are server-rendered normally.
 * This gives us full RSC + SEO on the marketing copy while keeping WebGL
 * fully client-side.
 */

import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import dynamic from 'next/dynamic'
import './globals.css'

// ─── Fonts (next/font — zero layout shift, preloaded, no @import) ─────────────
const spaceGrotesk = Space_Grotesk({
  subsets:  ['latin'],
  weight:   ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display:  'swap',
  preload:  true,
})

const jetbrainsMono = JetBrains_Mono({
  subsets:  ['latin'],
  weight:   ['400', '500', '700'],
  variable: '--font-mono',
  display:  'swap',
  preload:  false,   // loaded after display font — only used for labels/code
})

// ─── Dynamic imports (client-only) ────────────────────────────────────────────
const Scene       = dynamic(() => import('@/components/canvas/Scene'),    { ssr: false })
const EventBridge = dynamic(() => import('@/components/dom/EventBridge'), { ssr: false })
const LenisRoot   = dynamic(() => import('@/components/dom/LenisRoot'),   { ssr: false })
// Phase 3 — Intro added here:
// const Intro    = dynamic(() => import('@/components/dom/Intro'),        { ssr: false })

// ─── Metadata ─────────────────────────────────────────────────────────────────
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://smartplay.io')

export const metadata: Metadata = {
  title: {
    default:  'SmartPlay — The Operating System for Youth Athletes',
    template: '%s · SmartPlay',
  },
  description:
    'Training analytics, nutrition intelligence, recovery tracking, and AI coaching — ' +
    'unified in one platform. Built for soccer. Designed for every athlete.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title:       'SmartPlay — The OS for Youth Athletes',
    description: 'Track. Train. Transform.',
    type:        'website',
    siteName:    'SmartPlay',
    url:         SITE_URL,
  },
  twitter: {
    card:        'summary_large_image',
    title:       'SmartPlay',
    description: 'The Operating System for Youth Athletes',
  },
  robots: {
    index:    true,
    follow:   true,
    googleBot: { index: true, follow: true },
  },
}

export const viewport: Viewport = {
  themeColor:    '#04090f',
  width:         'device-width',
  initialScale:  1,
  maximumScale:  5,   // allow user zoom for accessibility
}

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="antialiased overflow-x-hidden"
        style={{
          fontFamily:  'var(--font-display)',
          color:       '#e0e8f0',
          // NO background here — the canvas (z:0) shows through.
          // CSS background on body stacks above the fixed canvas and hides it.
          background:  'transparent',
        }}
      >
        {/* ══════════════════════════════════════════
            LAYER 0 — WebGL Canvas
            Fixed, full-screen, behind everything.
            pointer-events: none so DOM handles clicks.
        ══════════════════════════════════════════ */}
        <Scene />

        {/* ══════════════════════════════════════════
            INFRASTRUCTURE — no visual output
            EventBridge: mouse + scroll → store
            LenisRoot:   smooth scroll + GSAP sync
        ══════════════════════════════════════════ */}
        <EventBridge />
        <LenisRoot />

        {/* ══════════════════════════════════════════
            LAYER 200 — Intro overlay (Phase 3)
            Fullscreen, animates out on complete.
            Uncomment when Phase 3 is built.
        ══════════════════════════════════════════ */}
        {/* <Intro /> */}

        {/* ══════════════════════════════════════════
            LAYER 10 — DOM content
            pointer-events: none on the wrapper so
            canvas mouse events still reach WebGL.
            Individual interactive elements re-enable
            pointer events via pointer-events-auto.
        ══════════════════════════════════════════ */}
        <div
          id="dom-root"
          style={{
            position:       'relative',
            zIndex:         10,
            pointerEvents:  'none',      // pass mouse through to canvas
            background:     'transparent',
          }}
        >
          {children}
        </div>
      </body>
    </html>
  )
}
