import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import dynamic from 'next/dynamic'
import './globals.css'

// ─── Fonts ────────────────────────────────────────────────────────────────────
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
})

// ─── Dynamic imports — no SSR for WebGL / GSAP ────────────────────────────────
const Scene       = dynamic(() => import('@/components/canvas/Scene'),       { ssr: false })
const EventBridge = dynamic(() => import('@/components/dom/EventBridge'),    { ssr: false })
const Intro       = dynamic(() => import('@/components/dom/Intro'),          { ssr: false })

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'SmartPlay — The Operating System for Youth Athletes',
  description:
    'Training analytics, nutrition intelligence, recovery tracking, and AI coaching — unified in one platform. Built for soccer. Designed for every athlete. 14-day free trial.',
  metadataBase: new URL('https://smartplay.io'),
  openGraph: {
    title: 'SmartPlay — The OS for Youth Athletes',
    description: 'Track. Train. Transform.',
    type: 'website',
    siteName: 'SmartPlay',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartPlay',
    description: 'The Operating System for Youth Athletes',
  },
}

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body
        className="bg-[#04090f] text-[#e0e8f0] antialiased overflow-x-hidden"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {/* ── Layer 0: WebGL Canvas (fixed, pointer-none) ── */}
        <Scene />

        {/* ── Event bridge: writes mouse + scroll into store ── */}
        <EventBridge />

        {/* ── Intro overlay ── */}
        <Intro />

        {/* ── DOM content ── */}
        <div
          id="dom-root"
          className="relative"
          style={{ zIndex: 10 }}
        >
          {children}
        </div>
      </body>
    </html>
  )
}
