# SmartPlay V2 — Master Cursor Build Prompt
# Paste this into Cursor. Use context7 for all library docs.
# Run in order. Do NOT skip steps.

---

## STEP 0 — Project Bootstrap

You are implementing SmartPlay V2, a WebGL + React Three Fiber landing page
for a youth sports SaaS. The full architecture has been scaffolded. Do NOT
modify any architecture decision or folder structure. Your job is to implement
and wire up the code exactly as specified.

Tech stack:
- Next.js 14 App Router + TypeScript
- React Three Fiber (@react-three/fiber) + Drei + Postprocessing
- Three.js with custom GLSL shader materials
- GSAP 3 (ScrollTrigger, timeline)
- Zustand for global state
- Tailwind CSS
- Framer Motion (supplementary DOM transitions only)

All GSAP rules:
- Always `gsap.registerPlugin(ScrollTrigger)` at file top
- All GSAP code inside `useEffect` only — never in render body
- Cleanup: return `() => { tl.kill(); ScrollTrigger.getAll().forEach(t => t.kill()) }`
- Check `prefers-reduced-motion` before animating
- Never animate layout properties — only `transform` and `opacity`

All Three.js rules:
- Dynamic import `{ ssr: false }` on any component using Three.js or GSAP
- Clean up geometries and materials in `useEffect` return
- Use `useMemo` for all geometry and material creation
- `useFrame` never calls `setState` — use refs

---

## STEP 1 — Install Dependencies

Run this exact command:

```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing \
  postprocessing gsap @gsap/react framer-motion lenis zustand \
  lucide-react clsx tailwind-merge @types/three
```

Verify in package.json that all versions installed. Do NOT install anything else.

---

## STEP 2 — Wire the Global Store

File: `src/lib/store.ts`

The store is already written. It holds:
- `mouseX, mouseY` (normalized -1..1 for WebGL)
- `mouseRawX, mouseRawY` (px for DOM)
- `scrollProgress` (0..1), `scrollY` (px)
- `introComplete` boolean
- `glitchActive` boolean + `triggerGlitch()`

Confirm the store is correctly typed with Zustand's `create<T>` pattern.
If `@/lib/store` is missing or has TS errors, fix them now. Do NOT change the
state shape or method names — other files depend on exact naming.

---

## STEP 3 — EventBridge

File: `src/components/dom/EventBridge.tsx`

This component mounts once in layout.tsx and bridges raw DOM events into
the Zustand store using `requestAnimationFrame` for performance.

Requirements:
- `mousemove` → writes `mouseX/Y` (-1..1) and `mouseRawX/Y` (px) via `setMouse`
- `scroll` → writes `scrollProgress` (0..1) and `scrollY` (px) via `setScroll`
- Both use RAF loop — NOT direct event writes to avoid jank
- Returns cleanup canceling both RAF loops and both event listeners
- Component returns `null` — no UI

---

## STEP 4 — Intro Animation

File: `src/components/dom/Intro.tsx`

A full-screen loader that runs ONCE per session (sessionStorage gate).

Sequence:
1. Phase 0 (0ms):    Black void with corner marks
2. Phase 1 (400ms):  SVG grid lines draw via `stroke-dashoffset` CSS transition
3. Phase 2 (1400ms): Hexagonal icosahedron projection draws via `stroke-dashoffset`
4. Phase 3 (2300ms): "SMARTPLAY" wordmark + scramble text resolves (character unscramble)
5. Phase 4 (3400ms): GSAP screen shake (translate X/Y in quick bursts) + call `triggerGlitch()`
6. Phase 5 (3800ms): GSAP `opacity: 0` fade → call `setIntroComplete()` → component unmounts

The SVG must contain:
- Outer construction circle (960px dasharray)
- 7 horizontal grid lines (staggered 0.07s each)
- 10 hex projection edges (staggered 0.05s each)
- Filled hex shape with `url(#iGrad)` gradient
- 6 vertex nodes (scale 0→4px, spring ease, staggered)

Text scramble: Replace each character with random from `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._—/`
every 25ms, revealing left to right at 0.6 chars/tick.

System readout (bottom-left, monospace, dim):
```
SYS_INIT
WEBGL_CTX ........ OK
SHADER_COMPILE ... OK
SCENE_READY ..... OK
```
Each line fades in as its corresponding phase completes.

On repeat visits: skip entirely, call `setIntroComplete()` immediately.

---

## STEP 5 — Glass Shader Material

File: `src/components/canvas/GlassMaterial.tsx`

Create a custom shader material using `shaderMaterial` from `@react-three/drei`.
Extend R3F's JSX namespace so `<glassMaterialImpl />` is a valid element.

Uniforms:
```typescript
uTime:       0         // float — elapsed seconds
uMouse:      Vector2   // -1..1 normalized
uDistortion: 1.0       // float — multiplier
uEnvMap:     null      // CubeTexture from CubeCamera
uIOR:        1.45      // index of refraction
uColorA:     Color     // neon green #00ff88
uColorB:     Color     // neon blue  #00a3ff
uOpacity:    0.85
uRoughness:  0.05
```

Vertex shader requirements:
- Layered smoothNoise (3D hash-based) for organic "breathing" displacement (+0.04 units)
- Mouse proximity wave: `sin(dist * 8.0 - uTime * 2.0) * 0.02` where dist = `length(position.xy - uMouse * 0.5)`
- Mouse push: `exp(-dist * 3.0) * 0.08 * uDistortion`
- Fresnel: `pow(1.0 - max(0, dot(n, viewDir)), 3.0)` — pass as `vFresnel`
- Edge ripple: `vFresnel * sin(uTime * 1.5 + position.y * 4.0) * 0.015`
- Pass `vNormal`, `vWorldPosition`, `vViewDirection`, `vUv`, `vFresnel` to fragment

Fragment shader requirements:
- Chromatic refraction: sample uEnvMap 3 times with IOR ±0.025 for R/G/B channels
- Prismatic scatter: `abs(sin(atan(N.y, N.x) * 6.0 + time * 0.5)) * 0.5 + 0.5`
- Green→blue gradient via `mix(uColorA, uColorB, gradientFactor)` where factor = vUv.y + N.y
- Thin-film iridescence: `sin(dot(N, V) * 12.0 + time * 0.8)` → mix between colorA/B
- Mouse intensity boost: `length(uMouse) * 0.8` added to scatterColor
- Composite: `mix(refraction, reflection, fresnel * 0.8)` then add scatter + iridescence
- Edge glow: `neonColor * pow(fresnel, 1.5) * 0.6` — bloom catches this
- Opacity: `mix(uOpacity * 0.3, uOpacity * 0.85, fresnel)` — transparent center, opaque edges

---

## STEP 6 — HeroObject

File: `src/components/canvas/HeroObject.tsx`

The main 3D glass object. Must use the GlassMaterial from Step 5.

Geometry (useMemo):
- `new THREE.IcosahedronGeometry(1.4, 2)` — 80+ triangles
- Compress Z axis by 0.72 (shield silhouette)
- Add ±6% random scale variance per vertex on X and Y
- Call `computeVertexNormals()` after modification

Structure:
```
<group ref={groupRef}>                    ← mouse rotation + scroll drift applied here
  <CubeCamera resolution={128}>
    {(texture) => (
      <Float speed={1.2} floatIntensity={0.5}>
        <mesh geometry={geo}>
          <glassMaterialImpl ref={matRef} uEnvMap={texture} ... />
        </mesh>
        <CoreGeometry />                   ← inner dark IcosahedronGeometry(0.65, 1)
        <WireframeOverlay />               ← bright green wireframe, fades after intro
      </Float>
    )}
  </CubeCamera>
  <NeonGlowPoints />                      ← tiny spheres at all unique vertices
  <OrbitingLights />                      ← 3 pointLights rotating around object
</group>
```

Intro scale animation (useEffect on `introComplete`):
- Pre-intro: `gsap.set(scale, { x: 0, y: 0, z: 0 })`
- Post-intro: scale to 1.15 (0.6s, back.out(2)) then back to 1 (0.4s)
- Simultaneously: position.y from -0.5 to 0 (0.8s, power3.out)

useFrame:
- Lerp `currentMouse` toward `targetMouse` at factor 0.04
- Update `matRef.current.uTime`, `uMouse`, `uDistortion` (sine breathing)
- `groupRef.rotation.x` lerps toward `currentMouse.y * 0.25` at 0.03
- `groupRef.rotation.y` lerps toward `currentMouse.x * -0.35` at 0.03
- Slow auto-rotation: `rotation.y += 0.002` when `|mouseX| + |mouseY| < 0.05`
- `position.y = -scrollY * 0.003`

WireframeOverlay:
- `meshBasicMaterial` wireframe, color `#00E676`
- `gsap.to(material, { opacity: 0, duration: 0.8 })` when `introComplete` becomes true

NeonGlowPoints:
- Extract unique vertex positions from `IcosahedronGeometry(1.45, 1)`
- Each vertex: `SphereGeometry(0.018)` with `MeshBasicMaterial`
- Alternate colors: even = `#00E676`, odd = `#00A3FF`

OrbitingLights (useFrame):
- light1: green `#00E676`, intensity 4, orbit at radius 3, speed 0.7
- light2: blue `#00A3FF`, intensity 3, orbit at radius 2.5, speed 0.5, phase +2.1
- light3: white, intensity 1.5, orbit at radius 2, speed 0.4, phase +4.2

---

## STEP 7 — Grid Background

File: `src/components/canvas/GridBackground.tsx`

An infinite floor plane at y=-2.2 with a WebGL grid shader.

Fragment shader (inline GLSL):
- Primary grid: 2-unit spacing, `fwidth` for anti-aliasing, 40% opacity
- Secondary grid: 10-unit spacing, 80% opacity
- Distance fade: `1 - smoothstep(15, 45, length(worldPos.xz))`
- Breathing: `0.7 + sin(time * 0.5) * 0.05`
- uFade uniform: `max(0, 1 - scrollY / 600)` — fades as user scrolls away from hero
- Colors: uColorA = green `#00E676` at 25% brightness, uColorB = blue at 35%

Mesh:
- `PlaneGeometry(120, 120, 1, 1)` rotated `-Math.PI / 2`
- `extensions={{ derivatives: true }}` on ShaderMaterial
- `transparent: true, depthWrite: false`

---

## STEP 8 — WebGL Carousel

File: `src/components/canvas/WebGLCarousel.tsx`

5 image planes on a horizontal track. Driven by GSAP ScrollTrigger.

Each ImagePlane:
- `PlaneGeometry(3.2, 2.0, 32, 20)` — 32×20 subdivision for smooth ripple
- Custom shader: ripple vertex (sine wave + scroll bend + hover expand) + ripple fragment (chromatic aberration + vignette + neon tint on hover)
- `scrollXRef.current` drives `meshRef.position.x = position[0] - scrollXRef.current`
- Hover: `gsap.to(hoverRef, { current: 1, duration: 0.4 })` via `onPointerEnter`
- Alpha fade: planes within ±9 units of center fade to opacity 1, outside to 0

If real images aren't available, generate gradient canvas textures:
```javascript
// For each of 5 features — dark gradient + feature name label
const grd = ctx.createLinearGradient(0, 0, 512, 512)
grd.addColorStop(0, `hsla(${hues[i]}, 80%, 15%, 1)`)
grd.addColorStop(1, `hsla(${hues[i]+40}, 90%, 8%, 1)`)
```

GSAP ScrollTrigger (useEffect):
```javascript
ScrollTrigger.create({
  trigger: '#carousel-section',
  start: 'top bottom',
  end: 'bottom top',
  scrub: 1.5,
  onUpdate: (self) => {
    gsap.to(scrollXRef, {
      current: self.progress * SPACING * (COUNT - 1),
      duration: 0.6,
      ease: 'power2.out',
      overwrite: true,
    })
  },
})
```

---

## STEP 9 — Camera Rig

File: `src/components/canvas/CameraRig.tsx`

Smooth camera movement. No group mesh — just imperatively moves `camera`.

useFrame:
- `targetPos.x = mouseX * 0.4`
- `targetPos.y = mouseY * 0.2 + 0.3 - scrollY * 0.0012`
- `targetPos.z = 5.5 - scrollY * 0.0015`
- `currentPos.lerp(targetPos, 0.025)` — smooth lag
- `camera.position.copy(currentPos)`
- `camera.lookAt(0, 0.2 - scrollY * 0.0008, 0)`

---

## STEP 10 — Scene (R3F Canvas)

File: `src/components/canvas/Scene.tsx`

Root R3F Canvas. Fixed position, z-index: 0, pointer-events: none.

Canvas props:
```javascript
camera={{ position: [0, 0.3, 5.5], fov: 45, near: 0.1, far: 100 }}
gl={{ antialias: false, alpha: true, powerPreference: 'high-performance',
      stencil: false, depth: true, toneMapping: 3, toneMappingExposure: 1.2 }}
dpr={[1, 1.5]}
```

EffectComposer (inside Suspense):
```javascript
<EffectComposer disableNormalPass multisampling={2}>
  <Bloom luminanceThreshold={0.55} luminanceSmoothing={0.9} intensity={1.2} mipmapBlur radius={0.8} />
  <ChromaticAberration offset={new Vector2(glitchActive ? 0.008 : 0.0012, ...)} />
  <Glitch active={glitchActive} mode={GlitchMode.CONSTANT_WILD} duration={new Vector2(0.15, 0.4)} />
  <Noise opacity={0.025} />
  <Vignette offset={0.1} darkness={0.85} />
</EffectComposer>
```

Reads `glitchActive` from Zustand store.
Also include: `<AdaptiveDpr pixelated />`, `<AdaptiveEvents />`, `<PerformanceMonitor />`
`<Environment preset="night" backgroundBlurriness={1} backgroundIntensity={0} />`

---

## STEP 11 — DOM Typography (HeroDOM)

File: `src/components/dom/HeroDOM.tsx`

DOM overlay for the hero section. Sits at z-index: 10 above Canvas.

On `introComplete` (useEffect):
```javascript
const tl = gsap.timeline({ delay: 0.15 })
tl.fromTo(badgeRef.current, { opacity: 0, y: 20, filter: 'blur(4px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7 })
  .fromTo(subRef.current,   { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
  .fromTo(ctaRef.current,   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
```

AnimatedText component handles headline word-by-word reveal:
- Split text into words, wrap each in: `<span class="sp-clip"><span class="sp-inner"></span></span>`
- Set initial: `{ y: '105%', rotateX: -60, opacity: 0 }`
- Animate: `{ y: '0%', rotateX: 0, opacity: 1, stagger: 0.07, ease: 'power3.out' }`
- ScrollTrigger: `start: 'top 88%'`, once: true

Scroll-driven parallax on container:
- `opacity = max(0, 1 - scrollY / 500)`
- `transform = translateY(scrollY * -0.18px)`

---

## STEP 12 — Features Section (Horizontal Pin)

File: `src/components/dom/FeaturesSection.tsx`

Pinned horizontal scroll section. 6 feature cards on a track.

GSAP ScrollTrigger:
```javascript
ScrollTrigger.create({
  trigger: section,
  start: 'top top',
  end: () => `+=${track.scrollWidth - track.offsetWidth + window.innerHeight}`,
  pin: true,
  scrub: 1,
  onUpdate: (self) => {
    gsap.set(track, { x: -(self.progress * (track.scrollWidth - track.offsetWidth)) })
  },
})
```

Each card:
- Width: `clamp(300px, 28vw, 420px)`, height: `clamp(340px, 40vh, 500px)`
- Glass surface: `background: rgba(8,14,22,0.85)`, `backdropFilter: blur(20px)`
- Vertical offset: odd cards translated down 32px
- Top accent line: 1px neon color, 0.4 opacity
- Corner number: monospace, right-aligned
- Bottom hover bar: `scaleX(0) → scaleX(1)` on group-hover, 500ms

---

## STEP 13 — Footer Reveal

File: `src/components/dom/FooterReveal.tsx`

GSAP-pinned scroll section. Giant text scales in as user scrolls.

ScrollTrigger timeline (scrub 1.2):
- Background: `rgba(4,9,15,0)` → `rgba(0,0,0,1)`
- Text: `scale(0.3), opacity(0), blur(20px)` → `scale(1), opacity(1), blur(0px)`, ease: power2.out
- Mask overlay: `scaleY(1)` → `scaleY(0)` via `transformOrigin: top`, ease: power2.inOut, startOffset: 0.1

Giant text styles:
```css
font-size: clamp(72px, 18vw, 260px);
background: linear-gradient(135deg, rgba(0,230,118,0.08), rgba(0,163,255,0.05));
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

Text content: "SMART\nPLAY"
Below: tagline + nav links + copyright in font-mono

---

## STEP 14 — Stats Section

File: `src/components/dom/StatsSection.tsx`

4-column grid: 2400+ athletes, 96% retention, 4.9 rating, $12/mo.

Each stat uses GSAP counter animation:
```javascript
const obj = { val: 0 }
ScrollTrigger.create({
  trigger: card,
  start: 'top 85%',
  once: true,
  onEnter: () => {
    gsap.to(obj, {
      val: targetValue,
      duration: 1.8,
      delay: index * 0.15,
      ease: 'power2.out',
      onUpdate: () => { el.textContent = `${prefix}${obj.val.toFixed(decimals)}${suffix}` },
    })
  },
})
```

Numbers: gradient text (`linear-gradient(135deg, #00E676, #00A3FF)`), `font-size: clamp(52px, 6vw, 80px)`
Labels: `font-mono`, 10px, tracking 0.2em
Vertical separator lines between columns (hidden on mobile)

---

## STEP 15 — Final Wiring + Verification

1. Confirm `layout.tsx` imports Scene, EventBridge, and Intro all as dynamic with `{ ssr: false }`
2. Confirm Scene has `position: fixed; inset: 0; z-index: 0; pointer-events: none` on Canvas
3. Confirm all DOM sections have `position: relative; z-index: 10` or higher
4. Confirm `#carousel-section` exists in page.tsx as the WebGL carousel scroll trigger target
5. Run `npm run build` — must produce zero TypeScript errors and zero unresolved imports
6. Run `npm run dev` — verify:
   - Intro plays on first load, skips on refresh
   - Glass object visible in hero
   - Object rotates with mouse
   - Grid visible and fades on scroll
   - Features section pins and scrolls horizontally
   - Stats counter animates in
   - Footer text reveals on scroll

---

## Performance Targets
- LCP < 2.5s (Canvas deferred, fonts preloaded)
- CLS = 0 (fixed Canvas, explicit font-display: swap)
- INP < 200ms
- WebGL: 60fps desktop, 30fps mobile (AdaptiveDpr handles)
- Max bundle size: 850kb gzipped (Three.js ~580kb, GSAP ~80kb)

## Known Gotchas
- `GlitchMode` must be imported from `postprocessing` not `@react-three/postprocessing`
- `shaderMaterial` creates a class — use `extend({ GlassMaterialImpl })` then `<glassMaterialImpl />`
- CubeCamera `frames={Infinity}` for live reflections — use `frames={1}` if performance tanks
- `ScrollTrigger` must be registered before any `.create()` call — always at file top
- GSAP `scrub` + `pin` together: set `end` as a function `() =>` to account for dynamic height

## use context7 for:
- @react-three/fiber useFrame, useThree types
- @react-three/drei shaderMaterial, Float, CubeCamera, Environment
- @react-three/postprocessing EffectComposer types
- gsap ScrollTrigger.create, timeline, scrub patterns
- three BufferGeometry, ShaderMaterial, CubeTexture types
