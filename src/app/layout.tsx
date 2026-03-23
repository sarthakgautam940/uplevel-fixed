import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SmartPlay — Train Smarter. Study Harder. Play at Your Peak.',
  description: 'The only operating system that balances your training load, academic stress, and recovery to maximize performance.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
