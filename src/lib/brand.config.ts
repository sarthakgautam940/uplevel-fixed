/**
 * SmartPlay Brand Configuration
 * ──────────────────────────────────
 * Source of truth for all brand tokens.
 * Every design decision traces to the Brand Brief.
 * 
 * Color Psychology:
 * - Primary (Emerald Green #00E676): Growth, vitality, the pitch, forward momentum
 * - Secondary (Azure Blue #0A84FF): Intelligence, trust, technology, mental clarity
 * - Accent (Gold #FFD600): Achievement, energy, premium, personal best
 * - Neutral (#8E99A4): Balance, sophistication, data-neutral  
 * - Background (#060B14): Deep space navy — focused, immersive, performance-stage dark
 * 
 * Typography Rationale:
 * - Display: Satoshi — geometric precision, athletic without aggression, modern tech feel
 * - Body: Inter — maximum legibility at all sizes, variable weight, designed for screens
 * - Mono: JetBrains Mono — data readability for stats/metrics, developer credibility
 */

export const brand = {
  name: 'SmartPlay',
  tagline: 'The Operating System for Youth Athletes',
  subtitle: 'Track. Train. Transform.',
  
  colors: {
    primary:       '#00E676',
    primaryDark:   '#00C853',
    primaryLight:  '#69F0AE',
    secondary:     '#0A84FF',
    secondaryDark: '#0066CC',
    secondaryLight:'#4DA6FF',
    accent:        '#FFD600',
    accentDark:    '#FFC400',
    neutral:       '#8E99A4',
    neutralDark:   '#5A6570',
    neutralLight:  '#B8C0C8',
    background:    '#060B14',
    surface:       '#0D1520',
    surfaceElevated:'#141D2B',
    text:          '#F0F2F5',
    textMuted:     '#8E99A4',
    border:        'rgba(142, 153, 164, 0.12)',
    
    // Semantic
    success:  '#00E676',
    warning:  '#FFD600',
    error:    '#FF5252',
    info:     '#0A84FF',

    // Gradients
    gradientPrimary: 'linear-gradient(135deg, #00E676 0%, #0A84FF 100%)',
    gradientAccent:  'linear-gradient(135deg, #FFD600 0%, #00E676 100%)',
    gradientDark:    'linear-gradient(180deg, #060B14 0%, #0D1520 100%)',
    gradientHero:    'radial-gradient(ellipse at 30% 50%, rgba(0,230,118,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(10,132,255,0.06) 0%, transparent 50%)',
    gradientGlow:    'radial-gradient(circle, rgba(0,230,118,0.15) 0%, transparent 70%)',
  },

  fonts: {
    display: 'Satoshi, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },

  typography: {
    display:   { size: 'clamp(48px, 8vw, 96px)',  weight: 700, tracking: '-0.03em', leading: '1.05' },
    displaySm: { size: 'clamp(36px, 5vw, 64px)',  weight: 700, tracking: '-0.02em', leading: '1.1'  },
    heading:   { size: 'clamp(24px, 4vw, 40px)',   weight: 600, tracking: '-0.015em', leading: '1.2' },
    subheading:{ size: 'clamp(18px, 2.5vw, 24px)', weight: 500, tracking: '0',       leading: '1.4' },
    bodyLg:    { size: '18px', weight: 400, tracking: '0', leading: '1.6' },
    body:      { size: '16px', weight: 400, tracking: '0', leading: '1.6' },
    caption:   { size: '14px', weight: 400, tracking: '0', leading: '1.5' },
    label:     { size: '11px', weight: 600, tracking: '0.08em', leading: '1.4' },
  },

  spacing: {
    xs: '4px',  sm: '8px',  md: '16px',  lg: '24px',
    xl: '32px', '2xl': '48px', '3xl': '64px', '4xl': '96px', '5xl': '128px',
  },

  radii: {
    sm: '8px', md: '12px', lg: '16px', xl: '24px', full: '9999px',
  },

  shadows: {
    card: '0 4px 24px rgba(0, 0, 0, 0.2)',
    cardHover: '0 8px 40px rgba(0, 0, 0, 0.3)',
    glow: '0 0 40px rgba(0, 230, 118, 0.2)',
    glowStrong: '0 0 80px rgba(0, 230, 118, 0.3)',
    glowBlue: '0 0 40px rgba(10, 132, 255, 0.2)',
    elevated: '0 16px 64px rgba(0, 0, 0, 0.4)',
  },

  animation: {
    duration: {
      instant: '100ms',
      fast: '200ms',
      normal: '400ms',
      slow: '700ms',
      dramatic: '1200ms',
    },
    easing: {
      default: 'cubic-bezier(0.16, 1, 0.3, 1)',
      bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1440px',
  },
} as const

export type BrandConfig = typeof brand
