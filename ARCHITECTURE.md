# SmartPlay V2 — WebGL Architecture

## File Structure

```
src/
├── app/
│   ├── layout.tsx              ← Root layout: global Canvas (fixed), DOM overlay structure, Lenis init
│   ├── page.tsx                ← Page assembly — sections stacked on top of Canvas
│   └── globals.css             ← CSS vars, keyframes, Tailwind base
│
├── components/
│   ├── canvas/
│   │   ├── Scene.tsx           ← R3F Canvas + EffectComposer pipeline (Bloom, Glitch, ChromaticAberration)
│   │   ├── HeroObject.tsx      ← 3D glass shield/icosahedron — Float, mouse reactive, shader driven
│   │   ├── GlassMaterial.tsx   ← shaderMaterial helper: glass.vert + glass.frag
│   │   ├── GridBackground.tsx  ← Infinite 3D grid plane, fades with scroll
│   │   ├── WebGLCarousel.tsx   ← Image planes on curved path, ripple shader, GSAP ScrollTrigger
│   │   ├── Particles.tsx       ← GPU instanced particles, react to mouse
│   │   └── CameraRig.tsx       ← Scroll-linked camera movement via GSAP
│   │
│   ├── dom/
│   │   ├── Intro.tsx           ← Wireframe loader → glitch → reveal (sessionStorage gate)
│   │   ├── HeroDOM.tsx         ← Text overlay on hero — SplitText GSAP stagger
│   │   ├── Navbar.tsx          ← Minimal fixed nav, blur on scroll
│   │   ├── FeaturesSection.tsx ← Scroll-pinned horizontal feature reveal
│   │   ├── StatsSection.tsx    ← Kinetic number counters with GSAP
│   │   ├── FooterReveal.tsx    ← GSAP pin + scale masked text reveal to black
│   │   └── AnimatedText.tsx    ← Reusable SplitText GSAP component
│   │
│   └── ui/
│       ├── MagneticButton.tsx  ← Magnetic cursor effect on primary CTA
│       └── GlitchText.tsx      ← Hover glitch effect on nav items
│
├── shaders/
│   ├── glass.vert.glsl         ← Mouse distortion, normal bending
│   ├── glass.frag.glsl         ← Fresnel, refraction, neon scatter
│   ├── ripple.vert.glsl        ← Sine-wave vertex displacement for carousel planes
│   └── ripple.frag.glsl        ← Texture + edge fade for carousel planes
│
├── hooks/
│   ├── useMouseNormalized.ts   ← Smooth lerped normalized mouse -1..1
│   ├── useScrollProgress.ts    ← 0..1 page scroll progress via Lenis
│   └── useLenis.ts             ← Lenis instance provider + GSAP ScrollTrigger sync
│
├── lib/
│   ├── store.ts                ← Zustand: mouse, scroll, intro state — shared between Canvas + DOM
│   └── utils.ts                ← cn(), lerp(), clamp()
│
└── types/
    └── three.d.ts              ← Augment JSX.IntrinsicElements for custom shader materials
```

## Install Command

```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing \
  gsap @gsap/react framer-motion lenis zustand \
  @types/three

# Dev deps
npm install -D glsl-literal @types/node
```

## Render Architecture

```
┌─────────────────────────────────────────────┐
│  layout.tsx                                 │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  <Scene /> (fixed, z-0, pointer-none)│   │
│  │  R3F Canvas — WebGL layer           │   │
│  │   ├── <EffectComposer>              │   │
│  │   │    ├── <Bloom>                  │   │
│  │   │    ├── <ChromaticAberration>    │   │
│  │   │    └── <Glitch> (intro only)    │   │
│  │   ├── <GridBackground>              │   │
│  │   ├── <Particles>                   │   │
│  │   ├── <HeroObject>                  │   │
│  │   ├── <WebGLCarousel>               │   │
│  │   └── <CameraRig>                   │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  DOM Overlay (relative, z-10)       │   │
│  │   ├── <Navbar>                      │   │
│  │   ├── <HeroDOM>                     │   │
│  │   ├── <FeaturesSection>             │   │
│  │   ├── <StatsSection>                │   │
│  │   └── <FooterReveal>                │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## Key Rules

- Canvas is `position: fixed; inset: 0; z-index: 0; pointer-events: none`
- All DOM sections have `position: relative; z-index: 10`
- Zustand store bridges scroll/mouse state between WebGL and DOM
- All GSAP: register → animate → kill() on unmount
- All Three.js components: dynamic import with `{ ssr: false }`
- Shaders imported as raw strings via `?raw` Vite flag or next.config bundleRaw
