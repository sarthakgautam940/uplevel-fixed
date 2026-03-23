'use client'

export default function NavbarShell() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[50] flex items-center justify-between"
      style={{
        padding: '22px clamp(24px,6vw,96px)',
        pointerEvents: 'auto',
        background: 'linear-gradient(to bottom, rgba(4,9,15,0.85), transparent)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="font-black text-[18px] tracking-tight" style={{ color: 'rgba(224,232,240,0.95)' }}>
        Smart<span style={{ color: '#00FF88' }}>Play</span>
      </div>
      <div className="hidden md:flex items-center gap-8">
        {['Features', 'Pricing', 'About'].map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className="font-mono text-[11px] tracking-[0.14em] uppercase transition-colors duration-300"
            style={{ color: 'rgba(0,255,136,0.5)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#00FF88'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(0,255,136,0.5)'
            }}
          >
            {link}
          </a>
        ))}
      </div>
      <a href="/signup" className="btn-primary text-[13px]" style={{ padding: '10px 24px' }}>
        Start Free
      </a>
    </nav>
  )
}
