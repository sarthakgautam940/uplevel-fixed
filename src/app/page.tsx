'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { cn } from '@/lib/utils'
import {
  Activity, Brain, Apple, Heart, Video, Target,
  Zap, Shield, TrendingUp, Star, ChevronDown, ChevronRight,
  BarChart3, Clock, Sparkles, ArrowRight, Check, Play,
  Moon, Droplets, Users, ArrowUpRight, AlertTriangle, CheckCircle2
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════════════════ */

function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0, nx: 0.5, ny: 0.5 })
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setPos({
        x: e.clientX, y: e.clientY,
        nx: e.clientX / window.innerWidth,
        ny: e.clientY / window.innerHeight,
      })
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])
  return pos
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handler = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setProgress(h > 0 ? window.scrollY / h : 0)
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return progress
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.unobserve(el) }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

/* ═══════════════════════════════════════════════════════════════════════
   REACTIVE PARTICLE CANVAS — WebGL-style background
   ═══════════════════════════════════════════════════════════════════════ */

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useMousePosition()
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  mouseRef.current = { x: mouse.nx, y: mouse.ny }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let w = 0, h = 0

    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Particles
    const COUNT = 120
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 0.5,
      baseAlpha: Math.random() * 0.4 + 0.1,
      hue: Math.random() > 0.5 ? 155 : 210, // green or blue
    }))

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const mx = mouseRef.current.x * w
      const my = mouseRef.current.y * h

      for (let i = 0; i < COUNT; i++) {
        const p = particles[i]

        // Mouse repulsion
        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 200) {
          const force = (200 - dist) / 200 * 0.8
          p.vx += (dx / dist) * force * 0.1
          p.vy += (dy / dist) * force * 0.1
        }

        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.99
        p.vy *= 0.99

        // Wrap
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        // Draw particle
        const alpha = p.baseAlpha * (1 + Math.sin(Date.now() * 0.001 + i) * 0.3)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${alpha})`
        ctx.fill()

        // Draw connections
        for (let j = i + 1; j < COUNT; j++) {
          const p2 = particles[j]
          const ddx = p.x - p2.x
          const ddy = p.y - p2.y
          const d = Math.sqrt(ddx * ddx + ddy * ddy)
          if (d < 150) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `hsla(${p.hue}, 80%, 60%, ${(1 - d / 150) * 0.08})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   INTRO ANIMATION — Geometric construction → logo → dissolve
   Like ALCHE: void → guidelines draw → triangle constructs → text resolves
   ═══════════════════════════════════════════════════════════════════════ */

function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0) // 0=void, 1=lines, 2=triangle, 3=text, 4=dissolve
  const [scrambledText, setScrambledText] = useState('')
  const targetText = 'Track. Train. Transform.'
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._ '

  useEffect(() => {
    // Check if visited before
    if (typeof window !== 'undefined' && sessionStorage.getItem('sp_visited')) {
      onComplete()
      return
    }

    const timers: NodeJS.Timeout[] = []
    timers.push(setTimeout(() => setPhase(1), 300))   // lines start drawing
    timers.push(setTimeout(() => setPhase(2), 1200))   // triangle forms
    timers.push(setTimeout(() => setPhase(3), 2000))   // text unscrambles
    timers.push(setTimeout(() => setPhase(4), 3200))   // dissolve out
    timers.push(setTimeout(() => {
      if (typeof window !== 'undefined') sessionStorage.setItem('sp_visited', '1')
      onComplete()
    }, 3800))

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  // Text unscramble effect
  useEffect(() => {
    if (phase < 3) {
      setScrambledText(Array.from({ length: targetText.length }, () => chars[Math.floor(Math.random() * chars.length)]).join(''))
      return
    }
    let iteration = 0
    const interval = setInterval(() => {
      setScrambledText(
        targetText.split('').map((char, i) => {
          if (i < iteration) return char
          return chars[Math.floor(Math.random() * chars.length)]
        }).join('')
      )
      iteration += 0.8
      if (iteration >= targetText.length) clearInterval(interval)
    }, 30)
    return () => clearInterval(interval)
  }, [phase])

  if (phase === -1) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] bg-[#060B14] flex items-center justify-center transition-opacity duration-700',
        phase >= 4 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      )}
    >
      <div className="relative w-[400px] h-[400px]">
        {/* Geometric construction lines */}
        <svg
          viewBox="0 0 400 400"
          className={cn('absolute inset-0 transition-opacity duration-700', phase >= 1 ? 'opacity-100' : 'opacity-0')}
        >
          {/* Circle guides */}
          <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(142,153,164,0.08)" strokeWidth="0.5"
            strokeDasharray="880" strokeDashoffset={phase >= 1 ? '0' : '880'}
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)' }} />
          <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(142,153,164,0.06)" strokeWidth="0.5"
            strokeDasharray="628" strokeDashoffset={phase >= 1 ? '0' : '628'}
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1) 0.2s' }} />

          {/* Horizontal rules */}
          {[100, 150, 200, 250, 300].map((y, i) => (
            <line key={`h${i}`} x1="40" y1={y} x2="360" y2={y}
              stroke="rgba(142,153,164,0.05)" strokeWidth="0.5"
              strokeDasharray="320" strokeDashoffset={phase >= 1 ? '0' : '320'}
              style={{ transition: `stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1) ${0.1 * i}s` }} />
          ))}

          {/* Diagonal construction lines */}
          <line x1="200" y1="60" x2="80" y2="320" stroke="rgba(142,153,164,0.06)" strokeWidth="0.5"
            strokeDasharray="340" strokeDashoffset={phase >= 1 ? '0' : '340'}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1) 0.3s' }} />
          <line x1="200" y1="60" x2="320" y2="320" stroke="rgba(142,153,164,0.06)" strokeWidth="0.5"
            strokeDasharray="340" strokeDashoffset={phase >= 1 ? '0' : '340'}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1) 0.4s' }} />
          <line x1="80" y1="320" x2="320" y2="320" stroke="rgba(142,153,164,0.06)" strokeWidth="0.5"
            strokeDasharray="240" strokeDashoffset={phase >= 1 ? '0' : '240'}
            style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s' }} />

          {/* The triangle — draws on phase 2 */}
          <path
            d="M200 80 L320 300 L80 300 Z"
            fill="none"
            stroke="url(#introGrad)"
            strokeWidth="2"
            strokeDasharray="680"
            strokeDashoffset={phase >= 2 ? '0' : '680'}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)', filter: phase >= 2 ? 'drop-shadow(0 0 20px rgba(0,230,118,0.3))' : 'none' }}
          />

          {/* Vertex nodes */}
          {[[200, 80], [320, 300], [80, 300]].map(([cx, cy], i) => (
            <circle key={`n${i}`} cx={cx} cy={cy} r={phase >= 2 ? 4 : 0}
              fill={i === 1 ? '#0A84FF' : '#00E676'}
              style={{ transition: `r 0.4s cubic-bezier(0.34,1.56,0.64,1) ${0.7 + i * 0.15}s` }} />
          ))}

          {/* Play triangle fill (reveals last) */}
          <path
            d="M200 80 L320 300 L80 300 Z"
            fill="url(#introGrad)"
            opacity={phase >= 2 ? 0.15 : 0}
            style={{ transition: 'opacity 0.8s ease 0.3s' }}
          />

          <defs>
            <linearGradient id="introGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E676" />
              <stop offset="100%" stopColor="#0A84FF" />
            </linearGradient>
          </defs>
        </svg>

        {/* Logo text */}
        <div className={cn(
          'absolute inset-0 flex flex-col items-center justify-center transition-all duration-700',
          phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}>
          <span className="font-display font-extrabold text-3xl tracking-tight mb-3" style={{ transitionDelay: '0.2s' }}>
            Smart<span className="text-gradient">Play</span>
          </span>
          <span className="font-mono text-sm tracking-[0.2em] text-[#8E99A4] h-5">
            {scrambledText}
          </span>
        </div>
      </div>

      {/* Corner construction marks */}
      <div className={cn('absolute top-8 left-8 w-8 h-8 border-l border-t border-[rgba(142,153,164,0.1)] transition-opacity duration-500', phase >= 1 ? 'opacity-100' : 'opacity-0')} />
      <div className={cn('absolute top-8 right-8 w-8 h-8 border-r border-t border-[rgba(142,153,164,0.1)] transition-opacity duration-500', phase >= 1 ? 'opacity-100' : 'opacity-0')} />
      <div className={cn('absolute bottom-8 left-8 w-8 h-8 border-l border-b border-[rgba(142,153,164,0.1)] transition-opacity duration-500', phase >= 1 ? 'opacity-100' : 'opacity-0')} />
      <div className={cn('absolute bottom-8 right-8 w-8 h-8 border-r border-b border-[rgba(142,153,164,0.1)] transition-opacity duration-500', phase >= 1 ? 'opacity-100' : 'opacity-0')} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   ANIMATED TEXT — Words reveal one by one with 3D transform
   ═══════════════════════════════════════════════════════════════════════ */

function AnimatedWords({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const { ref, inView } = useInView(0.2)
  return (
    <span ref={ref} className={cn('flex flex-wrap justify-center gap-x-[0.35em] gap-y-1.5 w-full', className)}>
      {text.split(' ').map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
        >
          <span
            className="inline-block transition-all duration-700"
            style={{
              transform: inView ? 'translateY(0) rotateX(0)' : 'translateY(100%) rotateX(-28deg)',
              opacity: inView ? 1 : 0,
              transitionDelay: `${delay + i * 80}ms`,
              transformOrigin: 'bottom center',
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   PARALLAX SECTION WRAPPER — moves children at different z-depths
   ═══════════════════════════════════════════════════════════════════════ */

function ParallaxLayer({ children, speed = 0, className }: { children: React.ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handler = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const center = rect.top + rect.height / 2
      const viewCenter = window.innerHeight / 2
      setOffset((center - viewCenter) * speed * -0.1)
    }
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [speed])

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: `translate3d(0, ${offset}px, 0)`, willChange: 'transform' }}
    >
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   FLOATING 3D CARD — tilts on hover, glassmorphism
   ═══════════════════════════════════════════════════════════════════════ */

function Float3DCard({ children, className, glowColor = 'rgba(0,230,118,0.15)' }: { children: React.ReactNode; className?: string; glowColor?: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)')
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rotateX = (y - 0.5) * -12
    const rotateY = (x - 0.5) * 12
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`)
    setGlowPos({ x: x * 100, y: y * 100 })
  }

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)')
    setGlowPos({ x: 50, y: 50 })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('relative transition-transform duration-300 ease-out', className)}
      style={{ transform, transformStyle: 'preserve-3d' }}
    >
      {/* Glow follow cursor */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, ${glowColor}, transparent 60%)`,
        }}
      />
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   SCROLL REVEAL — fades/slides in when scrolled into view with 3D
   ═══════════════════════════════════════════════════════════════════════ */

function ScrollReveal({ children, className, delay = 0, direction = 'up' }: {
  children: React.ReactNode; className?: string; delay?: number; direction?: 'up' | 'down' | 'left' | 'right' | 'scale'
}) {
  const { ref, inView } = useInView(0.1)
  const transforms = {
    up: 'translate3d(0, 60px, 0) rotateX(-5deg)',
    down: 'translate3d(0, -60px, 0) rotateX(5deg)',
    left: 'translate3d(80px, 0, 0) rotateY(-5deg)',
    right: 'translate3d(-80px, 0, 0) rotateY(5deg)',
    scale: 'scale3d(0.9, 0.9, 0.9)',
  }
  return (
    <div
      ref={ref}
      className={cn('transition-all duration-1000 ease-out', className)}
      style={{
        transform: inView ? 'translate3d(0,0,0) rotateX(0) rotateY(0) scale3d(1,1,1)' : transforms[direction],
        opacity: inView ? 1 : 0,
        transitionDelay: `${delay}ms`,
        perspective: '1200px',
      }}
    >
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION: HERO
   3D depth layers, reactive gradients, floating badge, parallax text
   ═══════════════════════════════════════════════════════════════════════ */

function HeroSection() {
  const mouse = useMousePosition()
  const scrollProgress = useScrollProgress()
  const heroScale = 1 + scrollProgress * 2
  const heroOpacity = Math.max(0, 1 - scrollProgress * 4)

  return (
    <section className="relative min-h-[110vh] flex items-center justify-center overflow-hidden" style={{ perspective: '1200px' }}>
      {/* Depth Layer 0 — Grid background */}
      <div className="absolute inset-0 grid-bg opacity-30" style={{
        transform: `translate3d(${(mouse.nx - 0.5) * -10}px, ${(mouse.ny - 0.5) * -10}px, -100px) scale(1.1)`,
      }} />

      {/* Depth Layer 1 — Large gradient orbs (react to mouse) */}
      <div className="absolute inset-0 pointer-events-none" style={{ transform: 'translateZ(-50px)' }}>
        <div className="absolute w-[900px] h-[900px] rounded-full" style={{
          background: 'radial-gradient(circle, rgba(0,230,118,0.1) 0%, transparent 60%)',
          left: `${20 + (mouse.nx - 0.5) * 15}%`,
          top: `${25 + (mouse.ny - 0.5) * 15}%`,
          transition: 'left 0.6s ease-out, top 0.6s ease-out',
        }} />
        <div className="absolute w-[700px] h-[700px] rounded-full" style={{
          background: 'radial-gradient(circle, rgba(10,132,255,0.08) 0%, transparent 60%)',
          right: `${10 + (mouse.nx - 0.5) * -10}%`,
          top: `${15 + (mouse.ny - 0.5) * -10}%`,
          transition: 'right 0.6s ease-out, top 0.6s ease-out',
        }} />
        <div className="absolute w-[500px] h-[500px] rounded-full" style={{
          background: 'radial-gradient(circle, rgba(255,214,0,0.04) 0%, transparent 60%)',
          left: `${50 + (mouse.nx - 0.5) * 20}%`,
          bottom: `${10 + (mouse.ny - 0.5) * -8}%`,
          transition: 'left 0.8s ease-out, bottom 0.8s ease-out',
        }} />
      </div>

      {/* Depth Layer 2 — Floating 3D geometric accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating triangle — parallax */}
        <div className="absolute top-[15%] right-[12%] opacity-20" style={{
          transform: `translate3d(${(mouse.nx - 0.5) * 40}px, ${(mouse.ny - 0.5) * 30}px, 0) rotateZ(${scrollProgress * 90}deg)`,
          transition: 'transform 0.4s ease-out',
        }}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <path d="M40 5L75 70L5 70Z" stroke="url(#fgrad1)" strokeWidth="1" />
            <defs><linearGradient id="fgrad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00E676"/><stop offset="100%" stopColor="#0A84FF"/></linearGradient></defs>
          </svg>
        </div>
        {/* Floating ring */}
        <div className="absolute bottom-[25%] left-[8%] opacity-15" style={{
          transform: `translate3d(${(mouse.nx - 0.5) * -30}px, ${(mouse.ny - 0.5) * -20}px, 0) rotateX(${(mouse.ny - 0.5) * 30}deg) rotateY(${(mouse.nx - 0.5) * 30}deg)`,
          transition: 'transform 0.5s ease-out',
        }}>
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" stroke="#0A84FF" strokeWidth="1" />
            <circle cx="50" cy="50" r="25" stroke="#00E676" strokeWidth="0.5" />
          </svg>
        </div>
        {/* Floating dot cluster */}
        <div className="absolute top-[40%] left-[20%] opacity-20" style={{
          transform: `translate3d(${(mouse.nx - 0.5) * 25}px, ${(mouse.ny - 0.5) * 20}px, 0)`,
          transition: 'transform 0.3s ease-out',
        }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-[#00E676]" style={{
              left: `${Math.cos(i * 1.256) * 20}px`,
              top: `${Math.sin(i * 1.256) * 20}px`,
            }} />
          ))}
        </div>
      </div>

      {/* Noise overlay */}
      <div className="absolute inset-0 noise pointer-events-none" />

      {/* Content Layer — Main hero text */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-8 md:px-16 lg:px-24 pt-40 pb-32 text-center"
        style={{ opacity: heroOpacity, transform: `translate3d(0, ${scrollProgress * -80}px, 0)` }}>

        {/* Badge — glassmorphism */}
        <ScrollReveal delay={200}>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-10"
            style={{
              background: 'rgba(0,230,118,0.06)',
              border: '1px solid rgba(0,230,118,0.15)',
              backdropFilter: 'blur(12px)',
            }}>
            <Sparkles size={14} className="text-[#00E676]" />
            <span className="text-xs font-semibold tracking-[0.1em] uppercase text-[#00E676]">Now in Open Beta — 14 Days Free</span>
          </div>
        </ScrollReveal>

        {/* Headline — centered stack; wrapped lines stay visually aligned */}
        <h1
          className="font-display font-extrabold tracking-tight mb-8 mx-auto w-full max-w-5xl flex flex-col items-center gap-2 md:gap-3 text-center"
          style={{ fontSize: 'clamp(40px, 6.5vw, 92px)', lineHeight: 1.08 }}
        >
          <AnimatedWords text="The Operating System" delay={400} />
          <div className="flex flex-wrap justify-center items-baseline gap-x-[0.35em] gap-y-1 w-full">
            <AnimatedWords text="for" delay={640} className="!w-auto shrink-0" />
            <span className="overflow-hidden inline-block">
              <span className="inline-block text-gradient" style={{
                animation: 'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.85s both',
              }}>Youth Athletes</span>
            </span>
          </div>
        </h1>

        {/* Subheadline */}
        <ScrollReveal delay={600}>
          <p className="text-lg md:text-xl text-[#8E99A4] max-w-2xl mx-auto mb-12 leading-relaxed">
            Training analytics, nutrition intelligence, recovery tracking, and AI coaching — unified in one platform. Built for soccer. Designed for every athlete.
          </p>
        </ScrollReveal>

        {/* CTA Buttons — 3D hover */}
        <ScrollReveal delay={800}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/signup" className="group relative">
              <div className="btn-primary text-base gap-2 relative z-10" style={{ padding: '16px 36px' }}>
                Start Free Trial
                <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
              <div className="absolute inset-0 rounded-full bg-[#00E676] opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500" />
            </Link>
            <Link href="/features" className="btn-secondary text-base gap-2 group" style={{
              padding: '16px 36px',
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(8px)',
            }}>
              <Play size={16} className="group-hover:scale-110 transition-transform" />
              See How It Works
            </Link>
          </div>
        </ScrollReveal>
      </div>

      {/* Scroll indicator with animated line */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
        style={{ opacity: Math.max(0, 1 - scrollProgress * 8) }}>
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#5A6570]">Scroll to explore</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#5A6570] to-transparent relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-4 bg-[#00E676] animate-[slideDown_2s_ease-in-out_infinite]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          0% { transform: translateY(-16px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(48px); opacity: 0; }
        }
      `}</style>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION: DASHBOARD PREVIEW — 3D perspective card with parallax
   ═══════════════════════════════════════════════════════════════════════ */

function DashboardPreview() {
  const mouse = useMousePosition()
  const { ref, inView } = useInView(0.1)

  return (
    <section ref={ref} className="relative py-8 -mt-20 z-20" style={{ perspective: '1400px' }}>
      <div className="max-w-[1100px] mx-auto px-8 md:px-16">
        <div
          className="relative transition-all duration-1000 ease-out"
          style={{
            transform: inView
              ? `rotateX(${(mouse.ny - 0.5) * 4}deg) rotateY(${(mouse.nx - 0.5) * -4}deg) translateZ(0)`
              : 'rotateX(15deg) translateY(100px) scale(0.9)',
            opacity: inView ? 1 : 0,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Card container — glassmorphism */}
          <div className="rounded-2xl overflow-hidden relative" style={{
            background: 'rgba(13,21,32,0.7)',
            border: '1px solid rgba(142,153,164,0.1)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 40px 120px rgba(0,0,0,0.5), 0 0 60px rgba(0,230,118,0.05)',
          }}>
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[rgba(142,153,164,0.06)]" style={{
              background: 'rgba(10,15,24,0.8)',
            }}>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-6 py-1.5 rounded-lg text-xs text-[#5A6570] font-mono" style={{
                  background: 'rgba(142,153,164,0.06)',
                }}>app.smartplay.io/dashboard</div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="p-6 md:p-8 grid grid-cols-12 gap-5 min-h-[420px]">
              {/* Sidebar */}
              <div className="col-span-2 hidden lg:flex flex-col gap-2" style={{ transform: 'translateZ(20px)' }}>
                {[
                  { icon: <BarChart3 size={15} />, label: 'Overview', active: true },
                  { icon: <Activity size={15} />, label: 'Training' },
                  { icon: <Apple size={15} />, label: 'Nutrition' },
                  { icon: <Heart size={15} />, label: 'Recovery' },
                  { icon: <Video size={15} />, label: 'Video' },
                  { icon: <Target size={15} />, label: 'Goals' },
                ].map((item) => (
                  <div key={item.label} className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors',
                    item.active ? 'bg-[rgba(0,230,118,0.08)] text-[#00E676]' : 'text-[#5A6570]'
                  )}>{item.icon}{item.label}</div>
                ))}
              </div>

              {/* Cards */}
              <div className="col-span-12 lg:col-span-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Readiness */}
                <div className="rounded-xl p-5 relative overflow-hidden" style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(142,153,164,0.08)',
                  transform: 'translateZ(30px)',
                }}>
                  <div className="text-xs text-[#8E99A4] mb-2 font-medium">Today&apos;s Readiness</div>
                  <div className="flex items-end gap-3">
                    <span className="text-5xl font-display font-bold text-[#00E676]">87</span>
                    <span className="text-xs text-[#00E676] mb-2 flex items-center gap-1"><TrendingUp size={12} /> +5</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-[rgba(142,153,164,0.06)] overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#00E676] to-[#0A84FF]" style={{ width: '87%' }} />
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2" style={{ background: 'radial-gradient(circle, rgba(0,230,118,0.08), transparent)' }} />
                </div>

                {/* Weekly Load */}
                <div className="rounded-xl p-5" style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(142,153,164,0.08)',
                  transform: 'translateZ(25px)',
                }}>
                  <div className="text-xs text-[#8E99A4] mb-2 font-medium">Weekly Load</div>
                  <div className="text-4xl font-display font-bold text-[#F0F2F5]">2,430 <span className="text-sm text-[#8E99A4] font-normal">AU</span></div>
                  <div className="mt-4 flex items-end gap-1.5 h-16">
                    {[40,65,55,80,70,90,45].map((h,i) => (
                      <div key={i} className="flex-1 rounded-sm" style={{
                        height: `${h}%`,
                        background: 'linear-gradient(to top, rgba(10,132,255,0.7), rgba(10,132,255,0.15))',
                      }} />
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="rounded-xl p-5" style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(142,153,164,0.08)',
                  transform: 'translateZ(20px)',
                }}>
                  <div className="text-xs text-[#8E99A4] mb-3 font-medium">This Week</div>
                  <div className="space-y-4">
                    {[
                      { label: 'Sessions', value: '5/6', color: '#00E676' },
                      { label: 'Avg Sleep', value: '7.8h', color: '#0A84FF' },
                      { label: 'Streak', value: '12 days', color: '#FFD600' },
                    ].map(s => (
                      <div key={s.label} className="flex items-center justify-between">
                        <span className="text-xs text-[#5A6570]">{s.label}</span>
                        <span className="text-sm font-semibold font-mono" style={{ color: s.color }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart */}
                <div className="md:col-span-2 rounded-xl p-5" style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(142,153,164,0.08)',
                  transform: 'translateZ(15px)',
                }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-[#8E99A4] font-medium">Readiness Trend — Last 14 Days</span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold" style={{ background: 'rgba(0,230,118,0.08)', color: '#00E676', border: '1px solid rgba(0,230,118,0.15)' }}>
                      <Sparkles size={10} /> AI Insight
                    </span>
                  </div>
                  <div className="flex items-end gap-1.5 h-32">
                    {[72,68,75,80,77,82,85,78,84,88,86,90,87,89].map((v,i) => (
                      <div key={i} className="flex-1 rounded-t-sm" style={{
                        height: `${v}%`,
                        background: v >= 80
                          ? 'linear-gradient(to top, rgba(0,230,118,0.7), rgba(0,230,118,0.15))'
                          : 'linear-gradient(to top, rgba(10,132,255,0.6), rgba(10,132,255,0.1))',
                      }} />
                    ))}
                  </div>
                </div>

                {/* Upcoming */}
                <div className="rounded-xl p-5" style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(142,153,164,0.08)',
                  transform: 'translateZ(10px)',
                }}>
                  <div className="text-xs text-[#8E99A4] mb-3 font-medium">Upcoming</div>
                  <div className="space-y-3">
                    {[
                      { time: '4:00 PM', event: 'Team Practice', color: '#00E676' },
                      { time: '6:30 PM', event: 'Meal Prep', color: '#0A84FF' },
                      { time: 'Tomorrow', event: 'Recovery Day', color: '#FFD600' },
                    ].map(item => (
                      <div key={item.event} className="flex items-center gap-3">
                        <div className="w-1 h-8 rounded-full" style={{ background: item.color }} />
                        <div>
                          <div className="text-xs font-medium">{item.event}</div>
                          <div className="text-[10px] text-[#5A6570]">{item.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reflection/glow under card */}
          <div className="absolute -bottom-8 left-[10%] right-[10%] h-20 rounded-[50%] blur-3xl" style={{
            background: 'linear-gradient(90deg, rgba(0,230,118,0.08), rgba(10,132,255,0.06))',
          }} />
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION: SOCIAL PROOF — horizontal scroll marquee
   ═══════════════════════════════════════════════════════════════════════ */

function SocialProofStrip() {
  const stats = [
    { n: '2,400+', l: 'Active Athletes' },
    { n: '180+', l: 'Teams' },
    { n: '96%', l: 'Retention Rate' },
    { n: '4.9', l: 'App Store Rating', icon: true },
  ]
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(0,230,118,0.02)] to-transparent" />
      <div className="max-w-[1280px] mx-auto px-8 md:px-16 lg:px-24">
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <ScrollReveal key={s.l} delay={i * 120} direction="up">
                <div className="text-center group">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl md:text-5xl font-display font-extrabold text-gradient">{s.n}</span>
                    {s.icon && <Star size={18} className="text-[#FFD600] fill-[#FFD600]" />}
                  </div>
                  <span className="text-sm text-[#5A6570] mt-2 block">{s.l}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION: PROBLEM — cards with 3D tilt and glassmorphism
   ═══════════════════════════════════════════════════════════════════════ */

function ProblemSection() {
  const problems = [
    { icon: <Clock size={28} />, title: 'Fragmented Data', desc: 'Training in one app, nutrition in another, sleep on a watch. Nothing connects.', color: '#FF5252' },
    { icon: <Shield size={28} />, title: 'Cost Barrier', desc: 'GPS vests cost $300+. Elite platforms start at $50/seat. Most families can\'t afford it.', color: '#FFD600' },
    { icon: <Users size={28} />, title: 'No Ecosystem', desc: 'Coaches, parents, and athletes all use different tools — nobody has the full picture.', color: '#0A84FF' },
  ]

  return (
    <section className="relative py-28 overflow-hidden" style={{ perspective: '1200px' }}>
      <div className="max-w-[960px] mx-auto px-8 md:px-16 text-center">
        <ScrollReveal>
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-[0.08em] uppercase mb-8"
            style={{ background: 'rgba(10,132,255,0.08)', color: '#0A84FF', border: '1px solid rgba(10,132,255,0.2)' }}>
            The Problem
          </span>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h2 className="font-display font-extrabold tracking-tight mb-6" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
            <AnimatedWords text="Youth athletes deserve elite-level tools" delay={200} />
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="text-lg text-[#8E99A4] max-w-2xl mx-auto mb-16 leading-relaxed">
            Most performance platforms cost $500+/month, require wearables, and are built for pro teams.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <ScrollReveal key={p.title} delay={300 + i * 150} direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}>
              <Float3DCard className="group" glowColor={`${p.color}20`}>
                <div className="h-full rounded-2xl p-7 text-left" style={{
                  background: 'rgba(13,21,32,0.6)',
                  border: '1px solid rgba(142,153,164,0.08)',
                  backdropFilter: 'blur(16px)',
                }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" style={{
                    background: `${p.color}10`, border: `1px solid ${p.color}20`, color: p.color,
                  }}>{p.icon}</div>
                  <h3 className="font-display font-bold text-lg mb-3">{p.title}</h3>
                  <p className="text-sm text-[#8E99A4] leading-relaxed">{p.desc}</p>
                </div>
              </Float3DCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION: FEATURES — staggered parallax grid with 3D depth
   ═══════════════════════════════════════════════════════════════════════ */

function FeaturesSection() {
  const features = [
    { icon: <Activity size={24} />, title: 'Training Intelligence', desc: 'Log sessions, track load metrics, and let AI flag overtraining risk.', color: '#00E676' },
    { icon: <Apple size={24} />, title: 'Nutrition & Hydration', desc: 'Budget-friendly meal ideas, macro tracking, and AI nutrition suggestions.', color: '#0A84FF' },
    { icon: <Heart size={24} />, title: 'Recovery & Wellness', desc: 'Daily readiness scoring from sleep, mood, soreness, and energy.', color: '#FFD600' },
    { icon: <Brain size={24} />, title: 'Mental Performance', desc: 'Guided journaling, visualization prompts, and mindset tracking.', color: '#E040FB' },
    { icon: <Video size={24} />, title: 'Video Review', desc: 'Upload clips, tag moments, get AI-generated technical feedback.', color: '#FF5252' },
    { icon: <Sparkles size={24} />, title: 'SmartPlay AI', desc: 'Weekly summaries, personalized recommendations, and contextual coaching.', color: '#00E676' },
  ]

  return (
    <section className="relative py-28 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] rounded-full" style={{
        background: 'radial-gradient(circle, rgba(0,230,118,0.03) 0%, transparent 60%)',
      }} />

      <div className="max-w-[1280px] mx-auto px-8 md:px-16 lg:px-24 relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-[0.08em] uppercase mb-8"
              style={{ background: 'rgba(0,230,118,0.08)', color: '#00E676', border: '1px solid rgba(0,230,118,0.2)' }}>
              Features
            </span>
            <h2 className="font-display font-extrabold tracking-tight mb-4" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
              Everything in <span className="text-gradient">one place</span>
            </h2>
            <p className="text-lg text-[#8E99A4] max-w-xl mx-auto">Six integrated modules that work together seamlessly.</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 100} direction={i % 2 === 0 ? 'up' : 'scale'}>
              <Float3DCard className="group h-full" glowColor={`${f.color}15`}>
                <div className="h-full rounded-2xl p-7 relative overflow-hidden" style={{
                  background: 'rgba(13,21,32,0.5)',
                  border: '1px solid rgba(142,153,164,0.08)',
                  backdropFilter: 'blur(12px)',
                }}>
                  {/* Hover gradient */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[inherit]" style={{
                    background: `radial-gradient(circle at 30% 30%, ${f.color}08, transparent 70%)`,
                  }} />

                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg" style={{
                      background: `${f.color}10`, border: `1px solid ${f.color}20`, color: f.color,
                    }}>{f.icon}</div>
                    <h3 className="font-display font-bold text-lg mb-3 group-hover:text-[#F0F2F5] transition-colors">{f.title}</h3>
                    <p className="text-sm text-[#8E99A4] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </Float3DCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION: ROLES — 3D tab switcher with animated content
   ═══════════════════════════════════════════════════════════════════════ */

function RolesSection() {
  const [activeRole, setActiveRole] = useState<'athlete' | 'coach' | 'parent'>('athlete')
  const mouse = useMousePosition()

  const roles = {
    athlete: {
      title: 'For Athletes', subtitle: 'Your performance command center',
      features: ['Personal readiness dashboard with daily scoring','Training session logging with RPE tracking','Nutrition planner with budget-friendly meals','Video upload with AI clip analysis','Goal setting with streaks and milestones','Shareable recruiting profile','Mental performance journal','AI-generated weekly summaries'],
    },
    coach: {
      title: 'For Coaches', subtitle: 'See your whole team at a glance',
      features: ['Team roster with readiness indicators','Training plan builder with drill assignments','Video review workflow with comments','Overtraining risk flags','Performance comparison tools','Team announcements','Bulk action tools','Readiness overview dashboard'],
    },
    parent: {
      title: 'For Parents', subtitle: 'Stay connected without micromanaging',
      features: ['Weekly wellness summary','Schedule and calendar visibility','Goal progress tracking','Coach-approved notes visibility','Nutrition and sleep trends','Privacy-first (no journal access)','Push notifications for updates','Direct coach messaging'],
    },
  }

  const data = roles[activeRole]

  return (
    <section className="relative py-28" style={{ perspective: '1200px' }}>
      <div className="max-w-[1280px] mx-auto px-8 md:px-16 lg:px-24">
        <ScrollReveal>
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-[0.08em] uppercase mb-8"
              style={{ background: 'rgba(255,214,0,0.08)', color: '#FFD600', border: '1px solid rgba(255,214,0,0.2)' }}>
              Built for Everyone
            </span>
            <h2 className="font-display font-extrabold tracking-tight mb-4" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
              Three roles, <span className="text-gradient">one platform</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Tabs — glassmorphism pill */}
        <ScrollReveal delay={100}>
          <div className="flex justify-center mb-14">
            <div className="inline-flex p-1.5 rounded-full" style={{
              background: 'rgba(13,21,32,0.8)', border: '1px solid rgba(142,153,164,0.1)', backdropFilter: 'blur(12px)',
            }}>
              {(['athlete', 'coach', 'parent'] as const).map(role => (
                <button key={role} onClick={() => setActiveRole(role)}
                  className={cn('px-7 py-3 rounded-full text-sm font-semibold transition-all duration-500',
                    activeRole === role ? 'bg-[#00E676] text-[#060B14] shadow-[0_0_20px_rgba(0,230,118,0.3)]' : 'text-[#8E99A4] hover:text-[#F0F2F5]'
                  )}>{role.charAt(0).toUpperCase() + role.slice(1)}</button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Content — 3D layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left">
            <div>
              <h3 className="font-display text-3xl font-bold mb-3">{data.title}</h3>
              <p className="text-lg text-[#8E99A4] mb-8">{data.subtitle}</p>
              <div className="space-y-3.5">
                {data.features.map((f, i) => (
                  <div key={f} className="flex items-start gap-3 opacity-0 animate-fade-up" style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'forwards' }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{
                      background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.2)',
                    }}><Check size={11} className="text-[#00E676]" /></div>
                    <span className="text-sm text-[#B8C0C8]">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* 3D mock card */}
          <ScrollReveal direction="right">
            <div className="relative" style={{
              transform: `perspective(1000px) rotateY(${(mouse.nx - 0.5) * 5}deg) rotateX(${(mouse.ny - 0.5) * -3}deg)`,
              transition: 'transform 0.4s ease-out',
            }}>
              <div className="rounded-2xl p-7 relative" style={{
                background: 'rgba(13,21,32,0.6)',
                border: '1px solid rgba(142,153,164,0.1)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
              }}>
                {activeRole === 'athlete' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Good Morning, Jordan</span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold" style={{ background: 'rgba(0,230,118,0.08)', color: '#00E676' }}>
                        <Zap size={10} /> Day 12 Streak
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[{ l: 'Readiness', v: '87', c: '#00E676' }, { l: 'Sleep', v: '8.2h', c: '#0A84FF' }, { l: 'Load', v: '340', c: '#FFD600' }].map(s => (
                        <div key={s.l} className="rounded-xl p-3 text-center" style={{ background: 'rgba(142,153,164,0.04)' }}>
                          <div className="text-[10px] text-[#5A6570] mb-1">{s.l}</div>
                          <div className="text-2xl font-display font-bold" style={{ color: s.c }}>{s.v}</div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl p-4" style={{ background: 'rgba(0,230,118,0.04)', border: '1px solid rgba(0,230,118,0.1)' }}>
                      <div className="flex items-center gap-1.5 text-[#00E676] text-xs font-semibold mb-2"><Sparkles size={12} /> AI Insight</div>
                      <p className="text-xs text-[#B8C0C8] leading-relaxed">Readiness is excellent. Great time for high-intensity training. Consider finishing drills or 1v1 scenarios.</p>
                    </div>
                  </div>
                )}
                {activeRole === 'coach' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">U17 Elite — Team Overview</span>
                      <span className="text-xs text-[#8E99A4]">18 athletes</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[{ l: 'Avg Readiness', v: '79', c: '#00E676' }, { l: 'At Risk', v: '2', c: '#FF5252' }, { l: 'Reviews', v: '5', c: '#0A84FF' }].map(s => (
                        <div key={s.l} className="rounded-xl p-3 text-center" style={{ background: 'rgba(142,153,164,0.04)' }}>
                          <div className="text-[10px] text-[#5A6570] mb-1">{s.l}</div>
                          <div className="text-2xl font-display font-bold" style={{ color: s.c }}>{s.v}</div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {[{ n: 'Jordan R.', r: 87, c: '#00E676' }, { n: 'Alex T.', r: 62, c: '#FFD600' }, { n: 'Sam K.', r: 45, c: '#FF5252' }].map(a => (
                        <div key={a.n} className="flex items-center justify-between py-2 border-b border-[rgba(142,153,164,0.06)] last:border-0">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: a.c }} />
                            <span className="text-xs font-medium">{a.n}</span>
                          </div>
                          <span className="text-xs font-mono" style={{ color: a.c }}>{a.r}/100</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeRole === 'parent' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Jordan&apos;s Weekly Summary</span>
                      <span className="text-xs text-[#8E99A4]">Mar 15–22</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[{ l: 'Sessions', v: '5 of 6', i: <Activity size={12} /> }, { l: 'Avg Sleep', v: '7.8 hrs', i: <Moon size={12} /> }, { l: 'Goals', v: '72%', i: <Target size={12} /> }, { l: 'Mood', v: 'Good', i: <Sparkles size={12} /> }].map(s => (
                        <div key={s.l} className="rounded-xl p-3" style={{ background: 'rgba(142,153,164,0.04)' }}>
                          <div className="flex items-center gap-1.5 text-[#5A6570] text-[10px] mb-1">{s.i} {s.l}</div>
                          <div className="text-sm font-semibold">{s.v}</div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl p-3" style={{ background: 'rgba(10,132,255,0.04)', border: '1px solid rgba(10,132,255,0.1)' }}>
                      <p className="text-xs text-[#B8C0C8]">Coach Martinez: &quot;Jordan showed great focus during tactical drills this week.&quot;</p>
                    </div>
                  </div>
                )}
              </div>
              {/* Depth shadow */}
              <div className="absolute -bottom-6 left-[8%] right-[8%] h-16 rounded-[50%] blur-2xl" style={{ background: 'rgba(0,230,118,0.06)' }} />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION: TESTIMONIALS — floating glassmorphism cards
   ═══════════════════════════════════════════════════════════════════════ */

function TestimonialsSection() {
  const testimonials = [
    { name: 'Maria Gonzalez', role: 'Parent, ECNL U15', quote: 'My daughter finally has structure to her development. The readiness score alone has prevented two potential injuries.' },
    { name: 'Coach David Chen', role: 'Director, Valley FC Academy', quote: 'I can see my entire roster\'s wellness in 30 seconds. The overtraining flags have changed how I manage load.' },
    { name: 'Marcus J.', role: 'Athlete, MLS NEXT U17', quote: 'I used to keep everything in my head. Now I can actually see my progress. The AI summaries help me prep for ID camps.' },
    { name: 'Dr. Sarah Kim', role: 'Sports Psychologist', quote: 'The mental performance journaling module is genuinely well-designed. Evidence-based practices in an accessible format.' },
  ]

  return (
    <section className="relative py-28 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-8 md:px-16 lg:px-24">
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2 className="font-display font-extrabold tracking-tight" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
              Trusted by <span className="text-gradient">athletes and coaches</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 120} direction={i % 2 === 0 ? 'left' : 'right'}>
              <Float3DCard className="group h-full">
                <div className="h-full rounded-2xl p-7" style={{
                  background: 'rgba(13,21,32,0.5)',
                  border: '1px solid rgba(142,153,164,0.08)',
                  backdropFilter: 'blur(12px)',
                }}>
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className="text-[#FFD600] fill-[#FFD600]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#B8C0C8] leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-[#5A6570]">{t.role}</div>
                  </div>
                </div>
              </Float3DCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION: PRICING — 3D tilt cards with center-stage effect
   ═══════════════════════════════════════════════════════════════════════ */

function PricingSection() {
  const tiers = [
    { name: 'Player', price: '$12', period: '/mo', desc: 'Full access for individual athletes.', features: ['Full athlete dashboard','Training & wellness logging','Nutrition planner + AI','Video upload & AI review','Goal tracking with streaks','Mental performance journal','Weekly AI summaries','Recruiting profile'], cta: 'Start 14-Day Free Trial', highlighted: true, badge: 'Most Popular' },
    { name: 'Coach', price: '$49', period: '/mo', desc: 'Manage your team with full visibility.', features: ['Everything in Player','Team roster management','Readiness & risk dashboard','Training plan builder','Video review assignments','Team announcements','Performance comparison','Up to 25 athletes'], cta: 'Coming Soon', highlighted: false, badge: 'Teams' },
    { name: 'Program', price: '$199', period: '/mo', desc: 'Multi-team management for clubs.', features: ['Everything in Coach','Unlimited teams & athletes','Admin dashboards','Custom branding','API access','Priority support','Bulk onboarding','Annual reporting'], cta: 'Contact Sales', highlighted: false, badge: 'Organizations' },
  ]

  return (
    <section className="relative py-28" style={{ perspective: '1200px' }}>
      <div className="max-w-[1280px] mx-auto px-8 md:px-16 lg:px-24">
        <ScrollReveal>
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-[0.08em] uppercase mb-8"
              style={{ background: 'rgba(255,214,0,0.08)', color: '#FFD600', border: '1px solid rgba(255,214,0,0.2)' }}>
              Pricing
            </span>
            <h2 className="font-display font-extrabold tracking-tight mb-4" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
              Simple, <span className="text-gradient">transparent</span> pricing
            </h2>
            <p className="text-lg text-[#8E99A4] max-w-xl mx-auto">14-day free trial. No credit card required.</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <ScrollReveal key={tier.name} delay={i * 150} direction="up">
              <Float3DCard className="group h-full" glowColor={tier.highlighted ? 'rgba(0,230,118,0.12)' : 'rgba(142,153,164,0.05)'}>
                <div className={cn('h-full rounded-2xl p-7 relative', tier.highlighted && 'scale-[1.03]')} style={{
                  background: tier.highlighted ? 'rgba(13,21,32,0.8)' : 'rgba(13,21,32,0.5)',
                  border: tier.highlighted ? '2px solid rgba(0,230,118,0.25)' : '1px solid rgba(142,153,164,0.08)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: tier.highlighted ? '0 0 60px rgba(0,230,118,0.08)' : 'none',
                }}>
                  {tier.badge && (
                    <span className={cn('absolute -top-3.5 left-6 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                      tier.highlighted
                        ? 'bg-[rgba(0,230,118,0.1)] text-[#00E676] border border-[rgba(0,230,118,0.2)]'
                        : 'bg-[rgba(142,153,164,0.08)] text-[#8E99A4] border border-[rgba(142,153,164,0.15)]'
                    )}>{tier.badge}</span>
                  )}

                  <div className="mb-6 pt-2">
                    <h3 className="font-display font-bold text-xl mb-2">{tier.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-display font-extrabold">{tier.price}</span>
                      <span className="text-sm text-[#8E99A4]">{tier.period}</span>
                    </div>
                    <p className="text-sm text-[#5A6570] mt-2">{tier.desc}</p>
                  </div>

                  <div className="space-y-3 mb-8">
                    {tier.features.map(f => (
                      <div key={f} className="flex items-start gap-2.5">
                        <Check size={14} className="text-[#00E676] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-[#B8C0C8]">{f}</span>
                      </div>
                    ))}
                  </div>

                  <Link href={tier.highlighted ? '/signup' : '/contact'}
                    className={cn('w-full text-center py-3.5 rounded-full text-sm font-semibold transition-all block',
                      tier.highlighted ? 'bg-[#00E676] text-[#060B14] hover:shadow-[0_0_30px_rgba(0,230,118,0.3)]' : 'border border-[rgba(142,153,164,0.15)] text-[#8E99A4] hover:border-[#00E676] hover:text-[#00E676]'
                    )}>{tier.cta}</Link>
                </div>
              </Float3DCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION: FAQ — animated accordion
   ═══════════════════════════════════════════════════════════════════════ */

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const faqs = [
    { q: 'Is SmartPlay only for soccer?', a: 'Optimized for soccer with position-specific features, but the core platform works for any sport. Expanding sport-specific modules in 2026.' },
    { q: 'Do I need wearables or special equipment?', a: 'No. SmartPlay works entirely through manual logging and AI insights. No GPS vest, no heart rate monitor required.' },
    { q: 'How does the 14-day free trial work?', a: 'Sign up, start using every feature immediately. No credit card. After 14 days, $12/month via Stripe. Cancel anytime.' },
    { q: 'Can coaches see private journal entries?', a: 'No. Coaches see training data and wellness scores. Private journals are athlete-only. Privacy by design.' },
    { q: 'Is my child\'s data safe?', a: 'Encryption at rest and in transit. COPPA-compliant. We never sell data. Parent accounts have oversight without surveillance.' },
  ]

  return (
    <section className="relative py-28">
      <div className="max-w-[800px] mx-auto px-8 md:px-16">
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2 className="font-display font-extrabold tracking-tight" style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}>
              Common questions
            </h2>
          </div>
        </ScrollReveal>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="rounded-xl overflow-hidden transition-all" style={{
                background: openIndex === i ? 'rgba(13,21,32,0.6)' : 'rgba(13,21,32,0.3)',
                border: `1px solid ${openIndex === i ? 'rgba(0,230,118,0.1)' : 'rgba(142,153,164,0.06)'}`,
                backdropFilter: 'blur(8px)',
              }}>
                <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between px-6 py-5 text-left">
                  <span className="text-sm font-medium pr-4">{faq.q}</span>
                  <ChevronDown size={18} className={cn('text-[#5A6570] transition-transform duration-500 flex-shrink-0', openIndex === i && 'rotate-180 text-[#00E676]')} />
                </button>
                <div className={cn('transition-all duration-500 overflow-hidden', openIndex === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0')}>
                  <p className="px-6 pb-5 text-sm text-[#8E99A4] leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN PAGE ASSEMBLY
   ═══════════════════════════════════════════════════════════════════════ */

export default function HomePage() {
  const [introComplete, setIntroComplete] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Intro Animation */}
      {!introComplete && <IntroAnimation onComplete={handleIntroComplete} />}

      {/* Reactive particle background — always present */}
      <ParticleField />

      {/* Main site */}
      <div className={cn('transition-opacity duration-1000', introComplete ? 'opacity-100' : 'opacity-0')}>
        <Navbar />
        <main>
          <HeroSection />
          <DashboardPreview />
          <SocialProofStrip />
          <ProblemSection />
          <FeaturesSection />
          <RolesSection />
          <TestimonialsSection />
          <PricingSection />
          <FAQSection />
        </main>
        <Footer />
      </div>
    </>
  )
}
