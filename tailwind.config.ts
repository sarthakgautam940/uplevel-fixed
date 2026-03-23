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
        neon: {
          green:  '#00E676',
          blue:   '#00A3FF',
          purple: '#7B2FFF',
        },
        muted:   '#4a6070',
        subtle:  '#2a3f52',
      },
      animation: {
        'fade-up':     'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both',
        'neon-pulse':  'neonPulse 2s ease-in-out infinite',
        'scroll-line': 'scrollLine 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(32px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        neonPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
        scrollLine: {
          '0%':   { transform: 'translateY(-20px)', opacity: '0' },
          '40%':  { opacity: '1' },
          '100%': { transform: 'translateY(56px)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
