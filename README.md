# SmartPlay — The Operating System for Youth Athletes

> Track. Train. Transform.

SmartPlay is a full-stack youth soccer performance platform built for athletes, coaches, parents, and programs. It combines training tracking, analytics, nutrition, wellness, mindset tools, video review, calendar planning, and AI-generated coaching into one product.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS Variables |
| Animation | GSAP + Framer Motion |
| 3D (planned) | Three.js / React Three Fiber |
| State | Zustand |
| Database | PostgreSQL + Prisma (planned) |
| Auth | Credentials + Google OAuth (planned) |
| Payments | Stripe Checkout |
| Storage | S3 / Cloudflare R2 |
| Hosting | Vercel |
| AI | OpenAI API (planned) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/smartplay.git
cd smartplay

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Accounts

The app includes demo accounts for testing all three roles:

| Role | Email | Password |
|------|-------|----------|
| Athlete | athlete@demo.com | demo |
| Coach | coach@demo.com | demo |
| Parent | parent@demo.com | demo |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Marketing homepage
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   ├── globals.css         # Design system CSS variables
│   ├── pricing/            # Pricing page
│   ├── about/              # About page
│   ├── contact/            # Contact form
│   ├── features/           # Feature showcase
│   ├── login/              # Authentication
│   ├── signup/             # Multi-step registration
│   ├── dashboard/          # Athlete dashboard (layout + pages)
│   │   ├── layout.tsx      # Dashboard shell (sidebar, topbar)
│   │   ├── page.tsx        # Overview dashboard
│   │   ├── training/       # Training log
│   │   ├── nutrition/      # Meal & hydration tracking
│   │   ├── recovery/       # Wellness check-in & readiness
│   │   ├── video/          # Video upload & review
│   │   ├── goals/          # Goal setting & milestones
│   │   ├── calendar/       # Event calendar
│   │   ├── profile/        # Journal (private)
│   │   ├── analytics/      # Performance analytics
│   │   └── settings/       # Account settings
│   ├── coach/              # Coach-specific pages
│   │   ├── roster/         # Team roster management
│   │   ├── plans/          # Training plan builder
│   │   └── review/         # Video review queue
│   └── parent/             # Parent dashboard
├── components/
│   ├── layout/             # Navbar, Footer, DashboardShell
│   ├── sections/           # Homepage sections
│   ├── dashboard/          # Dashboard widgets
│   ├── ui/                 # Reusable UI primitives
│   └── animations/         # GSAP/Framer components
├── hooks/
│   └── useAuth.ts          # Zustand auth store
├── lib/
│   ├── brand.config.ts     # Brand design tokens
│   └── utils.ts            # Utility functions
├── types/
│   └── index.ts            # TypeScript types
└── context/                # React context providers
```

---

## Brand System

The design system is defined in two places:

1. **`src/lib/brand.config.ts`** — TypeScript source of truth for all brand tokens
2. **`src/app/globals.css`** — CSS custom properties consumed by Tailwind and components

### Color Architecture (5-variable system)

| Role | Color | Hex | Psychology |
|------|-------|-----|-----------|
| Primary | Emerald Green | `#00E676` | Growth, vitality, the pitch |
| Secondary | Azure Blue | `#0A84FF` | Intelligence, trust, technology |
| Accent | Gold | `#FFD600` | Achievement, energy, premium |
| Neutral | Slate | `#8E99A4` | Balance, sophistication |
| Background | Deep Navy | `#060B14` | Focus, immersion, performance |

### Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Display | Plus Jakarta Sans | 700-800 | Headlines, stats, nav |
| Body | Inter | 400-500 | Body text, forms, UI |
| Mono | JetBrains Mono | 400-600 | Numbers, scores, data |

---

## Features

### Marketing Site
- [x] Homepage with hero, features, social proof, pricing, FAQ
- [x] Pricing page
- [x] About page with values
- [x] Contact form
- [x] Features showcase
- [x] Responsive navigation with mobile menu
- [x] Footer with CTA

### Authentication
- [x] Login with demo accounts
- [x] Multi-step signup (account → role → profile)
- [x] Password strength indicator
- [x] Role selection (athlete/coach/parent)
- [x] Session-based auth (Zustand + sessionStorage)

### Athlete Dashboard
- [x] Overview with readiness, sleep, hydration, load widgets
- [x] AI insight card
- [x] Readiness trend chart (14-day)
- [x] Training load chart (weekly)
- [x] Upcoming events
- [x] Active goals progress
- [x] Alerts & notifications
- [x] Training session logger with RPE/intensity
- [x] Nutrition tracker with meal logging
- [x] Recovery wellness check-in (5 dimensions)
- [x] Video upload & clip management
- [x] Goal setting with milestones
- [x] Calendar with event management
- [x] Private journal
- [x] Settings & subscription management

### Coach Dashboard
- [x] Team roster with readiness indicators
- [x] Risk flags (overtraining detection)
- [x] Training plan management
- [x] Video review queue
- [x] Shared calendar

### Parent View
- [x] Weekly wellness summary
- [x] Schedule visibility
- [x] Privacy-first design (no journal access)

---

## Logos

All logo variants are in `/public/logos/`:
- `smartplay-icon.svg` — Full icon with gradient
- `smartplay-full.svg` — Icon + wordmark
- `smartplay-mono-light.svg` — White monotone
- `smartplay-mono-dark.svg` — Dark monotone
- `smartplay-mark.svg` — Minimal triangle mark

---

## Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel deploy --prod
```

### Environment Variables

See `.env.example` for all required variables:
- Database URL (PostgreSQL)
- Auth secrets
- Stripe keys
- S3/R2 storage credentials
- OpenAI API key

---

## Roadmap

### Phase 1 (Current)
- [x] Marketing site
- [x] Auth flow
- [x] Athlete dashboard
- [x] Coach dashboard
- [x] Parent view
- [ ] PostgreSQL + Prisma integration
- [ ] Stripe billing

### Phase 2
- [ ] Real AI-powered insights (OpenAI)
- [ ] Video upload to S3/R2
- [ ] Push notifications
- [ ] Google OAuth
- [ ] Mobile PWA optimization

### Phase 3
- [ ] Wearable integrations (optional)
- [ ] Advanced analytics dashboard
- [ ] Community features
- [ ] White-label program tier

---

## License

Proprietary. All rights reserved.

---

Built with precision by SmartPlay.
