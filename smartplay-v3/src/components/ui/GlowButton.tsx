'use client'

import { useRef } from 'react'

interface GlowButtonProps {
  children:  React.ReactNode
  href?:     string
  onClick?:  () => void
  color?:    string   // neon color hex
  className?: string
}

/**
 * GlowButton — layered radial gradient approach from Huly.
 * Structure:
 *   Outer glow div  — large blur, opacity 0 → 1 on hover
 *   Button surface  — dark bg, rounded border, overflow hidden
 *     Inner highlight — radial gradient visible on hover
 *     Text
 */
export default function GlowButton({
  children,
  href,
  onClick,
  color     = '#00FF88',
  className = '',
}: GlowButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const Tag = href ? 'a' : 'button'

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center z-10 group cursor-pointer ${className}`}
      style={{ pointerEvents: 'auto' }}
    >
      {/* ── Outer glow — large radial behind the button ─────────────────── */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ width: 'calc(100% + 40px)', height: 'calc(100% + 40px)' }}
      >
        <div
          className="absolute inset-0 rounded-full blur-[18px] opacity-50"
          style={{ background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)` }}
        />
      </div>

      {/* ── Button surface ─────────────────────────────────────────────── */}
      <Tag
        href={href}
        onClick={onClick}
        className="relative z-10 flex h-12 items-center justify-center rounded-full overflow-hidden px-8 transition-all duration-300"
        style={{
          background:  '#0B0C0F',
          border:      '1px solid rgba(255,255,255,0.15)',
          // border transitions to neon on hover — done via group
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = `${color}55`
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'
        }}
      >
        {/* Inner radial highlight — appears on hover */}
        <div
          className="absolute -z-10 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-md pointer-events-none"
          style={{
            width:      '150%',
            height:     '150%',
            top:        '50%',
            left:       '50%',
            transform:  'translate(-50%, -50%)',
            background: `radial-gradient(ellipse at center, ${color} 0%, #00A3FF 50%, transparent 80%)`,
          }}
        />

        {/* Text */}
        <span
          className="relative font-mono text-xs uppercase tracking-widest font-bold"
          style={{ color, letterSpacing: '0.12em' }}
        >
          {children}
        </span>
      </Tag>
    </div>
  )
}
