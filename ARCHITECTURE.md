# SmartPlay V3 — Architecture Reference

## File Tree (complete, phases annotated)

```
smartplay-v3/
├── package.json                    ← Pinned deps
├── next.config.ts                  ← Transpile Three.js, raw GLSL loader
├── tailwind.config.ts              ← Brand tokens + animation keyframes
├── tsconfig.json
├── postcss.config.js
│
└── src/
    ├── app/
    │   ├── globals.css             ← Design system: tokens, word-reveal classes, glass utilities
    │   ├── layout.tsx              ← Layer architecture: Canvas (z:0) + DOM (z:10) + Intro (z:200)
    │   └── page.tsx                ← Section shell — all slots pre-architected for phases 2-5
    │
    ├── lib/
    │   └── store.ts                ← Zustand: mouse (+ velocity), scroll (+ velocity), glitch state
    │
    ├── types/
    │   └── r3f.d.ts                ← JSX namespace augmentation for custom shader materials
    │
    └── components/
        ├── canvas/                 ← R3F (client-only)
        │   ├── Scene.tsx           ← Canvas root: gl config, dpr, AdaptiveDpr, error boundary
        │   ├── SceneContent.tsx    ← All 3D children — slot system for phases 2/3/4
        │   ├── SceneErrorBoundary.tsx ← WebGL context loss handler
        │   ├── PostProcessing.tsx  ← SMAA → Bloom → CA (scroll-reactive) → Glitch → Noise → Vignette
        │   ├── CameraRig.tsx       ← Mouse parallax + scroll zoom-in camera controller
        │   │
        │   ├── [Phase 2] HeroObject.tsx        ← Custom GLSL shaderMaterial, simplex noise, Fresnel
        │   ├── [Phase 2] GridBackground.tsx    ← WebGL neon grid floor shader
        │   └── [Phase 4] WebGLCarousel.tsx     ← Curved plane array, useTexture, ripple shader
        │
        └── dom/                    ← React DOM (client-only, ssr:false)
            ├── EventBridge.tsx     ← RAF-based mouse + scroll → store feeder
            ├── LenisRoot.tsx       ← Lenis + GSAP ScrollTrigger sync
            │
            ├── [Phase 3] Intro.tsx         ← Wireframe SVG loader → glitch transition
            ├── [Phase 5] Navbar.tsx        ← Kinetic nav links, magnetic CTA
            ├── [Phase 5] HeroDOM.tsx       ← Word reveals, badge, CTA entrance (above canvas)
            ├── [Phase 5] StatsSection.tsx  ← GSAP counter animation
            ├── [Phase 5] FeaturesSection.tsx ← Pinned horizontal scroll + mouse-tilt cards
            ├── [Phase 5] FooterReveal.tsx  ← GSAP pin + scale masked SMARTPLAY reveal
            └── [Phase 5] AnimatedText.tsx  ← Reusable word-split/reveal utility
```

## Layer Z-Index System

| Layer      | Z-Index | What lives here         |
|------------|---------|-------------------------|
| Canvas     | 0       | R3F WebGL scene         |
| DOM        | 10      | All page content        |
| Navbar     | 50      | Fixed navigation        |
| Intro      | 200     | Fullscreen loader       |

## State Architecture (Zustand store)

```
mouseX, mouseY          — normalized -1..1 (WebGL coords)
mouseRawX, mouseRawY    — pixels (DOM tilt calculations)
mouseVelX, mouseVelY    — delta per frame (glass distortion)
mouseVel                — magnitude, pre-calculated

scrollY                 — raw pixels
scrollProgress          — 0..1 (ScrollTrigger uses this)
scrollVel               — px/frame delta → CA spike on fast scroll

introComplete           — Phase 3 sets true → Phase 2 hero appears
glitchActive            — drives Glitch effect in PostProcessing
glitchStrength          — 0..1, decays exponentially each frame
```

## PostProcessing Pipeline

```
SMAA (AA)
  ↓
Bloom (threshold:0.38, intensity:0.72, mipmap)
  ↓
ChromaticAberration (base:0.0014 + scrollVel*0.0003 + glitchStrength*0.012)
  ↓
Glitch (active: glitchActive, CONSTANT_WILD mode)
  ↓
Noise (opacity:0.022, film grain)
  ↓
Vignette (offset:0.06, darkness:0.90)
```

## Phase Drop-in Checklist

### Phase 2 (HeroObject)
1. Create `src/components/canvas/HeroObject.tsx`
2. Create `src/components/canvas/GridBackground.tsx`
3. Uncomment imports in `SceneContent.tsx`
4. Add JSX type in `src/types/r3f.d.ts`
5. Uncomment `<HeroObject />` and `<GridBackground />` in `SceneContent.tsx`

### Phase 3 (Intro)
1. Create `src/components/dom/Intro.tsx`
2. Uncomment `const Intro = dynamic(...)` in `layout.tsx`
3. Uncomment `<Intro />` in `layout.tsx` body
4. Wire `triggerGlitch()` from store on transition complete

### Phase 4 (WebGLCarousel)
1. Create `src/components/canvas/WebGLCarousel.tsx`
2. Place real images in `public/images/carousel/`
3. Uncomment import + JSX in `SceneContent.tsx`
4. Wire ScrollTrigger to `#carousel-section` in page.tsx

### Phase 5 (DOM Overlay)
1. Create all dom/ components listed above
2. Update imports in `page.tsx`
3. Replace placeholder sections with real components
4. Add `@gsap/react` useGSAP patterns throughout

## npm install command

```bash
npm install next@14.2.20 react@18.3.1 react-dom@18.3.1 \
  three@0.169.0 @react-three/fiber@8.18.0 @react-three/drei@9.122.0 \
  @react-three/postprocessing@2.19.1 postprocessing@6.39.0 \
  gsap@3.12.5 @gsap/react@2.1.2 \
  lenis@1.3.2 \
  zustand@5.0.2 \
  tailwind-merge@2.6.0 clsx@2.1.1 lucide-react@0.468.0

npm install -D @types/node@20.16.12 @types/react@18.3.12 \
  @types/react-dom@18.3.1 @types/three@0.169.0 \
  autoprefixer@10.4.20 postcss@8.4.47 tailwindcss@3.4.14 \
  typescript@5.6.3 eslint@8.57.1 eslint-config-next@14.2.20
```
