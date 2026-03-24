'use client'

import { useEffect, useRef, useState } from 'react'

// Exact character set from Alche's source
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._—/'

interface ScrambleTextProps {
  text:       string
  className?: string
  style?:     React.CSSProperties
  delay?:     number   // ms delay before starting
  speed?:     number   // interval ms (Alche uses 28)
  trigger?:   boolean  // external trigger; true = start, rerenders restart
  as?:        keyof JSX.IntrinsicElements
}

export default function ScrambleText({
  text,
  className,
  style,
  delay   = 0,
  speed   = 28,
  trigger = true,
  as:     Tag = 'span',
}: ScrambleTextProps) {
  const [displayed, setDisplayed] = useState(() =>
    // Initial state: full scramble
    text.split('').map(c => (c === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)])).join('')
  )
  const iterRef    = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef  = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!trigger) return

    // Clear any running animation
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current)  clearTimeout(timeoutRef.current)
    iterRef.current = 0

    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        const iter = iterRef.current

        setDisplayed(
          text.split('').map((char, i) => {
            // Characters before current iter: resolved (show real char)
            if (i < Math.floor(iter)) return char
            // Space: always space
            if (char === ' ') return ' '
            // Characters after: random scramble
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          }).join('')
        )

        iterRef.current += 0.55  // Alche's exact increment

        // Done: all characters resolved
        if (iterRef.current >= text.length + 1) {
          setDisplayed(text)
          if (intervalRef.current) clearInterval(intervalRef.current)
        }
      }, speed)
    }, delay)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current)  clearTimeout(timeoutRef.current)
    }
  }, [text, delay, speed, trigger])

  return (
    // @ts-expect-error dynamic tag
    <Tag className={className} style={style}>
      {displayed}
    </Tag>
  )
}
