"use client";

import { useTextScramble } from "../hooks/useTextScramble";

interface ScrambleTextProps {
  text: string;
  trigger: boolean;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function ScrambleText({
  text,
  trigger,
  duration = 800,
  className,
  style,
}: ScrambleTextProps) {
  const { chars } = useTextScramble(text, trigger, duration);

  return (
    <span
      className={className}
      style={{ fontVariantNumeric: "tabular-nums", ...style }}
      aria-label={text}
    >
      {chars.map((sc, i) => (
        <span
          key={i}
          className="scramble-char"
          style={{
            opacity: sc.opacity,
            transition: sc.resolved ? "opacity 100ms ease" : "none",
          }}
        >
          {sc.char}
        </span>
      ))}
    </span>
  );
}
