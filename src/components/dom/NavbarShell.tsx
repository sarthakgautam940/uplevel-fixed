'use client'

export default function NavbarShell() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[50] flex items-center justify-between"
      style={{ padding: '22px clamp(24px,6vw,96px)' }}
    >
      <div className="font-black text-[18px] tracking-tight">
        Smart<span style={{ color: '#00FF88' }}>Play</span>
      </div>
      <div className="hidden md:flex items-center gap-8">
        {['Features', 'Pricing', 'About'].map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className="font-mono text-[11px] tracking-[0.14em] uppercase transition-colors duration-300"
            style={{ color: '#2a3f52' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#00FF88'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#2a3f52'
            }}
          >
            {link}
          </a>
        ))}
      </div>
      <button type="button" className="btn-primary text-[13px]" style={{ padding: '10px 24px' }}>
        Start Free
      </button>
    </nav>
  )
}
