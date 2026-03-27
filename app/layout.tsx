import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, Playfair_Display } from 'next/font/google';
import Cursor from '../components/Cursor';
import SmoothScroll from '../components/SmoothScroll';
import './globals.css';

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const display = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'UpLevel Services LLC',
  description: 'Award-caliber digital experiences and AI intelligence systems for luxury service businesses.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-[var(--void)] text-[var(--crisp)] antialiased">
      <body className={`${body.variable} ${display.variable} min-h-screen bg-[var(--void)] text-[var(--crisp)]`}>
        <SmoothScroll>
          <Cursor />
          <div className="noise-overlay" aria-hidden="true" />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
