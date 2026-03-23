'use client'

import { useEffect, useRef, useState } from 'react'
import { useStore } from '@/lib/store'
import { gsap } from 'gsap'

// ─── Intro Sequence ────────────────────────────────────────────────────────────
// Phase 0: Void (black)
// Phase 1: Grid lines draw in
// Phase 2: Wireframe icosahedron constructs
// Phase 3: Text unscrambles
// Phase 4: Glitch burst → screen shake → dissolve
// Phase 5: Complete → reveal main site

const TARGET_TEXT = 'THE OPERATING SYSTEM FOR YOUTH ATHLETES'
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._—/\\'

function useScramble(active: boolean, target: string, speed = 25) {
  const [text, setText] = useState(() =>
    Array.from({ length: target.length }, () =>
      CHARS[Math.floor(Math.random() * CHARS.length)]
    ).join('')
  )

  useEffect(() => {
    if (!active) return
    let iteration = 0
    const iv = setInterval(() => {
      setText(
        target.split('').map((char, i) => {
          if (i < iteration) return char
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        }).join('')
      )
      iteration += 0.6
      if (iteration >= target.length) clearInterval(iv)
    }, speed)
    return () => clearInterval(iv)
  }, [active, target, speed])

  return text
}

export default function Intro() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef       = useRef<SVGSVGElement>(null)
  const [phase, setPhase]       = useState(0)
  const [hasVisited]            = useState(() => {
    if (typeof window === 'undefined') return false
    return Boolean(sessionStorage.getItem('sp_v2_visited'))
  })

  const { setIntroComplete, triggerGlitch } = useStore()
  const scrambled = useScramble(phase >= 3, TARGET_TEXT)

  useEffect(() => {
    // Skip intro on repeat visits
    if (hasVisited) {
      setIntroComplete()
      return
    }

    const tl = gsap.timeline()
    const timers: NodeJS.Timeout[] = []

    timers.push(setTimeout(() => setPhase(1), 400))   // grid lines
    timers.push(setTimeout(() => setPhase(2), 1400))  // shape forms
    timers.push(setTimeout(() => setPhase(3), 2300))  // text resolves
    timers.push(setTimeout(() => {
      setPhase(4)   // glitch burst
      triggerGlitch()
      // Screen shake
      if (containerRef.current) {
        gsap.timeline()
          .to(containerRef.current, { x: 6,  y: -4, duration: 0.06, ease: 'none' })
          .to(containerRef.current, { x: -8, y: 6,  duration: 0.06, ease: 'none' })
          .to(containerRef.current, { x: 4,  y: -3, duration: 0.05, ease: 'none' })
          .to(containerRef.current, { x: -3, y: 2,  duration: 0.05, ease: 'none' })
          .to(containerRef.current, { x: 0,  y: 0,  duration: 0.08, ease: 'power2.out' })
      }
    }, 3400))

    timers.push(setTimeout(() => {
      // Flash white, then dissolve
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.in',
          onComplete: () => {
            sessionStorage.setItem('sp_v2_visited', '1')
            setIntroComplete()
          },
        })
      }
    }, 3800))

    return () => {
      timers.forEach(clearTimeout)
      tl.kill()
    }
  }, [hasVisited, setIntroComplete, triggerGlitch])

  if (hasVisited) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
      style={{ background: '#04090f' }}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
        }}
      />

      {/* Corner marks */}
      {['top-8 left-8 border-l border-t', 'top-8 right-8 border-r border-t',
        'bottom-8 left-8 border-l border-b', 'bottom-8 right-8 border-r border-b'].map((cls, i) => (
        <div
          key={i}
          className={`absolute w-8 h-8 ${cls} transition-opacity duration-700`}
          style={{
            borderColor: 'rgba(0,230,118,0.2)',
            opacity: phase >= 1 ? 1 : 0,
          }}
        />
      ))}

      {/* Center geometry construction */}
      <div className="relative w-[380px] h-[380px]">
        <svg
          ref={svgRef}
          viewBox="0 0 380 380"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <linearGradient id="iGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#00E676" />
              <stop offset="50%"  stopColor="#00A3FF" />
              <stop offset="100%" stopColor="#7B2FFF" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Outer construction circle */}
          <circle
            cx="190" cy="190" r="145"
            fill="none"
            stroke="rgba(0,230,118,0.06)"
            strokeWidth="0.5"
            strokeDasharray="912"
            strokeDashoffset={phase >= 1 ? 0 : 912}
            style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.16,1,0.3,1)' }}
          />

          {/* Grid lines */}
          {[80, 120, 160, 200, 240, 280, 310].map((y, i) => (
            <line
              key={`h${i}`}
              x1="20" y1={y} x2="360" y2={y}
              stroke="rgba(0,163,255,0.04)"
              strokeWidth="0.5"
              strokeDasharray="340"
              strokeDashoffset={phase >= 1 ? 0 : 340}
              style={{ transition: `stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s` }}
            />
          ))}

          {/* Icosahedron projection lines (5 of 12 vertices projected to 2D) */}
          {[
            'M190 50 L320 145',  // vertex A → B
            'M320 145 L310 285', // B → C
            'M310 285 L190 330', // C → D
            'M190 330 L70 285',  // D → E
            'M70 285 L60 145',   // E → F
            'M60 145 L190 50',   // F → A (close top)
            'M190 50 L190 190',  // center cross
            'M60 145 L310 145',  // horizontal mid
            'M70 285 L320 145',  // diagonals
            'M310 285 L60 145',
          ].map((d, i) => (
            <path
              key={`e${i}`}
              d={d}
              fill="none"
              stroke="rgba(0,230,118,0.12)"
              strokeWidth="0.8"
              strokeDasharray="400"
              strokeDashoffset={phase >= 2 ? 0 : 400}
              style={{ transition: `stroke-dashoffset 0.9s cubic-bezier(0.16,1,0.3,1) ${0.05 * i}s` }}
            />
          ))}

          {/* Main shape outline — glows on phase 2 */}
          <path
            d="M190 50 L320 145 L310 285 L190 330 L70 285 L60 145 Z"
            fill="url(#iGrad)"
            fillOpacity={phase >= 2 ? 0.04 : 0}
            stroke="url(#iGrad)"
            strokeWidth="1.5"
            filter="url(#glow)"
            strokeDasharray="960"
            strokeDashoffset={phase >= 2 ? 0 : 960}
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)' }}
          />

          {/* Vertex nodes */}
          {[[190,50],[320,145],[310,285],[190,330],[70,285],[60,145]].map(([cx,cy], i) => (
            <circle
              key={`v${i}`}
              cx={cx} cy={cy}
              r={phase >= 2 ? 4 : 0}
              fill={i % 2 === 0 ? '#00E676' : '#00A3FF'}
              filter="url(#glow)"
              style={{ transition: `r 0.4s cubic-bezier(0.34,1.56,0.64,1) ${0.6 + i * 0.1}s` }}
            />
          ))}
        </svg>

        {/* Wordmark + tagline */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <div
            className="font-black tracking-tight text-4xl mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Smart<span style={{ color: '#00E676' }}>Play</span>
          </div>
          <div
            className="font-mono text-[10px] tracking-[0.25em] text-[#3a4a5a]"
            style={{ letterSpacing: '0.22em' }}
          >
            {phase >= 3 ? scrambled : ''}
          </div>
        </div>
      </div>

      {/* System readout — bottom left */}
      <div
        className="absolute bottom-10 left-10 font-mono text-[9px] text-[#1a2535] space-y-1"
        style={{ opacity: phase >= 1 ? 1 : 0, transition: 'opacity 1s ease 0.5s' }}
      >
        {['SYS_INIT', 'WEBGL_CTX ........ OK', 'SHADER_COMPILE ... OK', 'SCENE_READY ..... OK'].map((line, i) => (
          <div
            key={i}
            style={{
              opacity: phase >= i + 1 ? 1 : 0,
              transition: `opacity 0.4s ease ${i * 0.3}s`,
              color: i === 3 ? '#00E676' : undefined,
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Version tag */}
      <div
        className="absolute bottom-10 right-10 font-mono text-[9px] text-[#1a2535]"
        style={{ opacity: phase >= 1 ? 0.6 : 0, transition: 'opacity 1s ease' }}
      >
        V2.0.0 / BETA
      </div>
    </div>
  )
}
