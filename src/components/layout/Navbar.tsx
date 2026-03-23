'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <>
      <nav className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled ? 'py-3 bg-[#060B14]/80 backdrop-blur-xl border-b border-white/[0.06]' : 'py-5 bg-transparent'
      )}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9">
              <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
                <defs>
                  <linearGradient id="navg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00E676"/>
                    <stop offset="100%" stopColor="#0A84FF"/>
                  </linearGradient>
                </defs>
                <rect x="4" y="4" width="56" height="56" rx="14" fill="#060B14" stroke="url(#navg)" strokeWidth="1.5"/>
                <path d="M24 18L48 32L24 46V18Z" fill="url(#navg)" opacity="0.95"/>
                <circle cx="24" cy="18" r="3" fill="#00E676"/>
                <circle cx="48" cy="32" r="3" fill="#0A84FF"/>
                <circle cx="24" cy="46" r="3" fill="#00E676"/>
              </svg>
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Smart<span className="text-gradient">Play</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href ? 'text-[#00E676]' : 'text-[#8E99A4] hover:text-[#F0F2F5]'
                )}>{link.label}</Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="px-5 py-2.5 rounded-full text-sm font-medium text-[#8E99A4] hover:text-[#F0F2F5] transition-colors">Log in</Link>
            <Link href="/signup" className="btn-primary !px-6 !py-2.5 text-sm">Start Free Trial</Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-[#8E99A4] hover:text-[#F0F2F5]" aria-label="Toggle menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        'fixed inset-0 z-40 md:hidden transition-all duration-500',
        mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}>
        <div className="absolute inset-0 bg-[#060B14]/95 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />
        <div className={cn(
          'absolute top-20 left-6 right-6 bg-[#0D1520] border border-[rgba(142,153,164,0.12)] rounded-2xl p-6 transition-all duration-500',
          mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        )}>
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={cn('px-4 py-3 rounded-xl text-base font-medium transition-colors',
                  pathname === link.href ? 'text-[#00E676] bg-[rgba(0,230,118,0.05)]' : 'text-[#8E99A4] hover:text-[#F0F2F5]'
                )}>{link.label}</Link>
            ))}
          </div>
          <div className="border-t border-[rgba(142,153,164,0.12)] mt-4 pt-4 flex flex-col gap-3">
            <Link href="/login" className="btn-ghost w-full justify-center">Log in</Link>
            <Link href="/signup" className="btn-primary w-full justify-center">Start Free Trial</Link>
          </div>
        </div>
      </div>
    </>
  )
}
