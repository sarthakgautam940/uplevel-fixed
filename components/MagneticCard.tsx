'use client';

import { useRef } from 'react';

type MagneticCardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function MagneticCard({ children, className = '' }: MagneticCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element) return;

    const bounds = element.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width;
    const py = (event.clientY - bounds.top) / bounds.height;

    const rotateY = (px - 0.5) * 12;
    const rotateX = (0.5 - py) * 12;

    element.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02,1.02,1.02)`;
    element.style.setProperty('--glare-x', `${(px * 100).toFixed(2)}%`);
    element.style.setProperty('--glare-y', `${(py * 100).toFixed(2)}%`);
  };

  const reset = () => {
    const element = ref.current;
    if (!element) return;
    element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    element.style.setProperty('--glare-x', '50%');
    element.style.setProperty('--glare-y', '50%');
  };

  return (
    <div
      ref={ref}
      data-magnetic="true"
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={`relative isolate will-change-transform transition-transform duration-200 ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        ['--glare-x' as string]: '50%',
        ['--glare-y' as string]: '50%',
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
        style={{
          background:
            'radial-gradient(360px circle at var(--glare-x) var(--glare-y), rgba(255,255,255,0.22), rgba(255,255,255,0.03) 40%, transparent 70%)',
          mixBlendMode: 'screen',
        }}
      />
      {children}
    </div>
  );
}
