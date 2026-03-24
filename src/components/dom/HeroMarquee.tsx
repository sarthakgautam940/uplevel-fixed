'use client'

/**
 * HeroMarquee — infinite horizontal scrolling readout.
 * Uses CSS animation only — zero JS overhead.
 * Mask gradient fades edges so it feels infinite.
 * Items repeat twice (w-[200%]) so the loop is seamless.
 */

const ITEMS = [
  '[ TRAINING LOG ]',
  '[ AI COACHING ]',
  '[ SCHOOL BALANCE ]',
  '[ RECOVERY ]',
  '[ TEAM PLANNER ]',
  '[ VIDEO REVIEW ]',
  '[ NUTRITION ]',
  '[ READINESS SCORE ]',
]

export default function HeroMarquee() {
  const doubled = [...ITEMS, ...ITEMS]

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        maskImage: 'linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)',
        borderTop:    '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        padding:      '14px 0',
      }}
    >
      {/* Animate at constant speed — no JS */}
      <div
        className="flex whitespace-nowrap"
        style={{ animation: 'marqueeScroll 28s linear infinite' }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-6"
            style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      11,
              letterSpacing: '0.18em',
              color:         i % 4 === 0 ? '#00FF88' : i % 4 === 2 ? '#00A3FF' : '#2a3f52',
              textTransform: 'uppercase',
            }}
          >
            {item}
            <span style={{ color: '#1a2535', fontSize: 6 }}>◆</span>
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
