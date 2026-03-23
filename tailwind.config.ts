import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Space Grotesk', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        bg:      '#04090f',
        surface: '#080e16',
        border:  'rgba(255,255,255,0.05)',
        neon: {
          green:  '#00FF88',
          blue:   '#00A3FF',
          purple: '#7B2FFF',
        },
        muted:  '#4a6070',
        subtle: '#2a3f52',
      },
      animation: {
        'scroll-line': 'scrollLine 2.1s ease-in-out infinite',
        'pulse-dot':   'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        scrollLine: {
          '0%':   { transform: 'translateY(-14px)', opacity: '0' },
          '40%':  { opacity: '1' },
          '100%': { transform: 'translateY(44px)',  opacity: '0' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1'   },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
