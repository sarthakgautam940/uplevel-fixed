import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'SmartPlay — The Operating System for Youth Athletes',
  description: 'Track training, nutrition, wellness, and performance. AI-powered insights for youth soccer players, coaches, and parents. Start your 14-day free trial.',
  keywords: ['youth soccer', 'athlete performance', 'training tracker', 'sports analytics', 'soccer development'],
  openGraph: {
    title: 'SmartPlay — The Operating System for Youth Athletes',
    description: 'Track. Train. Transform. The all-in-one platform for youth soccer development.',
    type: 'website',
    locale: 'en_US',
    siteName: 'SmartPlay',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#060B14',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-brand-bg text-brand-text font-body antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
