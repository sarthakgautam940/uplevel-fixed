'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

interface AnimatedTextProps {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  style?: CSSProperties
  delay?: number
  stagger?: number
  splitBy?: 'words' | 'chars'
  trigger?: 'scroll' | 'immediate'
  onEnter?: () => void
}

export default function AnimatedText({
  text,
  as: Tag = 'h2',
  className,
  style,
  delay = 0,
  stagger = 0.07,
  splitBy = 'words',
  trigger = 'scroll',
  onEnter,
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const el = containerRef.current
    if (!el) return

    // Split words/chars manually (no SplitText plugin needed)
    const units = splitBy === 'words'
      ? text.split(' ').map(w => ({ text: w + ' ', isWord: true }))
      : text.split('').map(c => ({ text: c, isChar: true }))

    el.innerHTML = units
      .map(u => `<span class="sp-clip" style="display:inline-block;overflow:hidden;vertical-align:bottom;"><span class="sp-inner" style="display:inline-block;">${u.text}</span></span>`)
      .join('')

    const inners = Array.from(el.querySelectorAll<HTMLElement>('.sp-inner'))

    gsap.set(inners, {
      y: '105%',
      rotateX: -60,
      opacity: 0,
      transformOrigin: 'bottom center',
    })

    const animProps = {
      y: '0%',
      rotateX: 0,
      opacity: 1,
      duration: 0.85,
      ease: 'power3.out',
      stagger,
      delay,
    }

    let ctx: gsap.Context
    if (trigger === 'scroll') {
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          onEnter: () => {
            gsap.to(inners, { ...animProps, onComplete: onEnter })
          },
          once: true,
        })
      }, el)
    } else {
      ctx = gsap.context(() => {
        gsap.to(inners, { ...animProps, onComplete: onEnter })
      }, el)
    }

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === el) t.kill()
      })
    }
  }, [text, delay, stagger, splitBy, trigger, onEnter])

  return (
    <Tag
      ref={containerRef as React.RefObject<any>}
      className={cn('perspective-[1200px]', className)}
      style={style}
    >
      {text}
    </Tag>
  )
}
