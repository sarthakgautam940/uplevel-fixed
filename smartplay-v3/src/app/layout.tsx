import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import dynamic from 'next/dynamic'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight:  ['400', '500', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight:  ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
})

const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false })

export const metadata: Metadata = {
  title: 'SmartPlay — The Operating System for Youth Athletes',
  description: 'Train smarter. Study harder. Play at your peak.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* LAYER 0 — WebGL canvas. Background lives here, not on body. */}
        <Scene />

        {/* LAYER 10 — DOM overlay. pointer-events:none passes mouse to canvas. */}
        <div
          id="dom-root"
          style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}
        >
          {children}
        </div>
      </body>
    </html>
  )
}
