'use client'

import Link from 'next/link'

const footerLinks = {
  Product: [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'For Athletes', href: '/features#athletes' },
    { label: 'For Coaches', href: '/features#coaches' },
    { label: 'For Parents', href: '/features#parents' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
  ],
  Resources: [
    { label: 'Help Center', href: '#' },
    { label: 'Community', href: '#' },
    { label: 'API Docs', href: '#' },
    { label: 'Status', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="relative border-t border-[rgba(142,153,164,0.08)]">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#00E676]/30 to-transparent" />

      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        {/* CTA Band */}
        <div className="py-16 md:py-24 text-center">
          <h2 className="font-display text-display-sm font-bold tracking-tight mb-4">
            Ready to <span className="text-gradient">level up</span>?
          </h2>
          <p className="text-[#8E99A4] text-lg max-w-lg mx-auto mb-8">
            Join thousands of youth athletes tracking their path to the next level. 14 days free — no card required.
          </p>
          <Link href="/signup" className="btn-primary text-base">
            Start Your Free Trial
          </Link>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-[rgba(142,153,164,0.08)]">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-label font-semibold uppercase tracking-wider text-[#8E99A4] mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-[#5A6570] hover:text-[#F0F2F5] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-[rgba(142,153,164,0.08)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 64 64" fill="none" className="w-7 h-7">
              <defs>
                <linearGradient id="fg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E676"/>
                  <stop offset="100%" stopColor="#0A84FF"/>
                </linearGradient>
              </defs>
              <rect x="4" y="4" width="56" height="56" rx="14" fill="#060B14" stroke="url(#fg)" strokeWidth="1.5"/>
              <path d="M24 18L48 32L24 46V18Z" fill="url(#fg)" opacity="0.95"/>
            </svg>
            <span className="text-sm text-[#5A6570]">&copy; {new Date().getFullYear()} SmartPlay. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            {['Twitter', 'Instagram', 'YouTube', 'Discord'].map((social) => (
              <a key={social} href="#" className="text-sm text-[#5A6570] hover:text-[#00E676] transition-colors">{social}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
