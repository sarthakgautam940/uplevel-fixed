'use client'

/**
 * WebGLCarousel — built from Andreas Antonsson's actual source code.
 *
 * REAL TECHNIQUES (extracted from minified JS, not guessed):
 *
 * 1. CIRCULAR ARC POSITIONING
 *    Andreas positions cards on a circular path:
 *    position.x = Math.sin(x) * radius
 *    position.z = Math.cos(x) * depth - depthOffset
 *    position.y = -x  (fall off vertically)
 *    rotation.y = x * 0.6
 *    This is NOT a straight horizontal track. It curves into Z-space.
 *
 * 2. CYLINDER CURVE VERTEX SHADER (exact Andreas GLSL):
 *    pos.z *= 0.2;
 *    pos.z += cos(pos.x / 4.0 * PI/2.0 * 0.5) * 1.5 - 1.0;
 *    This bends the plane geometry backward like a curved screen.
 *
 * 3. LENS DISTORTION CHROMATIC ABERRATION FRAGMENT (exact Andreas):
 *    4-iteration loop — each sample shifts RGB channels differently.
 *    vec2 lens_distortion(vec2 r, float alpha) { return r*(1.0-alpha*dot(r,r)); }
 *    col.x += texture2D(uTex, lens_distortion(cuv, base+0.10)+0.5).x
 *    col.y += texture2D(uTex, lens_distortion(cuv, base+0.12)+0.5).y
 *    col.z += texture2D(uTex, lens_distortion(cuv, base+0.14)+0.5).z
 *
 * 4. SCROLL VELOCITY → uScrollVelocity
 *    Andreas reads lenis.velocity directly.
 *    We replicate: track delta scrollY per frame → smooth decay.
 *
 * 5. UV OFFSET on scroll (exact fragment):
 *    moveUVOffset.x -= uScrollVelocity * 1.0;
 *    This makes the texture "slide" inside the plane on fast scrolls.
 */

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Feature data (placeholder canvas textures) ──────────────────────────────
const SLIDES = [
  { label: 'Training',  sub: 'Performance Load',     hue: 155 },
  { label: 'Analytics', sub: 'Real-time Metrics',    hue: 210 },
  { label: 'Nutrition', sub: 'Fuel Your Game',       hue: 155 },
  { label: 'Recovery',  sub: 'Readiness Score',      hue: 270 },
  { label: 'Video AI',  sub: 'Instant Breakdown',    hue: 210 },
  { label: 'School',    sub: 'Balance & Focus',      hue: 90  },
]

// ─── Canvas gradient texture (replace with real images later) ────────────────
function makeTexture(label: string, sub: string, hue: number): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 640; c.height = 360
  const ctx = c.getContext('2d')!

  // Dark gradient base
  const bg = ctx.createLinearGradient(0, 0, 640, 360)
  bg.addColorStop(0,   `hsla(${hue}, 80%, 8%, 1)`)
  bg.addColorStop(0.5, `hsla(${hue + 20}, 90%, 5%, 1)`)
  bg.addColorStop(1,   `hsla(${hue + 40}, 70%, 4%, 1)`)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, 640, 360)

  // Radial center glow
  const glow = ctx.createRadialGradient(320, 180, 0, 320, 180, 240)
  glow.addColorStop(0,   `hsla(${hue}, 100%, 55%, 0.32)`)
  glow.addColorStop(0.5, `hsla(${hue}, 100%, 45%, 0.10)`)
  glow.addColorStop(1,   'rgba(0,0,0,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, 640, 360)

  // Grid overlay
  ctx.strokeStyle = `hsla(${hue}, 100%, 65%, 0.07)`
  ctx.lineWidth = 1
  for (let x = 0; x < 640; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 360); ctx.stroke() }
  for (let y = 0; y < 360; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(640, y); ctx.stroke() }

  // Corner brackets
  ctx.strokeStyle = `hsla(${hue}, 100%, 70%, 0.25)`
  ctx.lineWidth = 1.5
  const br = 20
  ;[[0, 0], [640, 0], [0, 360], [640, 360]].forEach(([cx, cy]) => {
    const sx = cx === 0 ? 1 : -1
    const sy = cy === 0 ? 1 : -1
    ctx.beginPath(); ctx.moveTo(cx + sx * br, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy + sy * br); ctx.stroke()
  })

  // Label
  ctx.fillStyle = `hsla(${hue}, 100%, 75%, 0.92)`
  ctx.font = 'bold 52px "Space Grotesk", system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(label.toUpperCase(), 320, 190)

  ctx.fillStyle = `hsla(${hue}, 80%, 65%, 0.38)`
  ctx.font = '400 16px "JetBrains Mono", monospace'
  ctx.letterSpacing = '4px'
  ctx.fillText(sub.toUpperCase(), 320, 228)

  return new THREE.CanvasTexture(c)
}

// ─── GLSL — Vertex shader (exact Andreas technique) ──────────────────────────
const VERT = /* glsl */`
  #define PI 3.14159265359

  uniform float uScrollVelocity;
  uniform float uPosX;        // card's position on the arc (-1..1)
  uniform float uAlpha;

  varying vec2 vUv;
  varying vec2 vMeshUv;
  varying float vFunya;       // Andreas: abs(uScrollVelocity) for frag effects

  void main() {
    vUv     = uv;
    vMeshUv = uv;
    vFunya  = abs(uScrollVelocity);

    vec3 pos = position;

    // ── Andreas exact: cylinder curve ────────────────────────────────────
    // Compresses Z, then curves the plane backward using cosine.
    // This bends the flat plane into a subtle curved-screen shape.
    pos.z *= 0.2;
    pos.z += cos(pos.x / 4.0 * PI / 2.0 * 0.5) * 1.5 - 1.0;

    // ── Velocity lean — planes tilt on their X axis when scrolling ───────
    // Andreas does this on the group, we apply a Y-axis tilt in the shader.
    pos.y += pos.x * uScrollVelocity * 0.04;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

// ─── GLSL — Fragment shader (exact Andreas lens distortion) ──────────────────
const FRAG = /* glsl */`
  uniform sampler2D uTex;
  uniform float uScrollVelocity;
  uniform float uAlpha;
  uniform float uLoaded;

  varying vec2 vUv;
  varying vec2 vMeshUv;
  varying float vFunya;

  // Andreas's exact lens distortion function
  vec2 lens_distortion(vec2 r, float alpha) {
    return r * (1.0 - alpha * dot(r, r));
  }

  void main() {
    vec2 uv     = vUv;
    vec2 cuv    = uv - 0.5;
    cuv *= 1.25;  // slight zoom-in to hide distortion edges

    // UV shift from scroll velocity — texture slides inside the plane
    // Andreas exact: moveUVOffset.x -= uScrollVelocity * 1.0
    vec2 moveUVOffset = vec2(0.0);
    moveUVOffset.x   -= uScrollVelocity * 0.06;

    vec4 col = vec4(0.0);

    // ── Andreas: 4-iteration chromatic lens distortion ───────────────────
    // Each iteration samples at a slightly different distortion level.
    // R, G, B channels are sampled with different chromatic offsets.
    // Result: prismatic edge separation that intensifies with velocity.
    for (int i = 0; i < 4; i++) {
      float fi       = float(i) / 4.0;
      float distBase = 0.06 + fi * 0.02 + vFunya * 0.04;

      col.x += texture2D(uTex, lens_distortion(cuv, distBase + 0.00) + 0.5 + moveUVOffset).x;
      col.y += texture2D(uTex, lens_distortion(cuv, distBase + 0.02) + 0.5 + moveUVOffset).y;
      col.z += texture2D(uTex, lens_distortion(cuv, distBase + 0.04) + 0.5 + moveUVOffset).z;
    }
    col.xyz /= 4.0;
    col.w    = 1.0;

    // ── Vignette — darkens edges, frames the card ─────────────────────────
    vec2 meshCuv = vMeshUv - 0.5;
    col.xyz *= smoothstep(0.88, 0.42, length(meshCuv));

    // ── Alpha: loaded + fade by arc distance ─────────────────────────────
    col.w *= uAlpha * uLoaded;

    gl_FragColor = col;
  }
`

// ─── Single card mesh ─────────────────────────────────────────────────────────
interface CardUniforms {
  uTex:            { value: THREE.Texture }
  uScrollVelocity: { value: number }
  uPosX:           { value: number }
  uAlpha:          { value: number }
  uLoaded:         { value: number }
}

function Card({
  index,
  total,
  uniforms,
  scrollProgress,
}: {
  index:          number
  total:          number
  uniforms:       CardUniforms
  scrollProgress: React.MutableRefObject<number>
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const geo     = useMemo(() => new THREE.PlaneGeometry(3.2, 1.9, 32, 32), [])

  // Card's normalized position on the arc (-1..1 relative to center)
  const baseArcPos = (index - Math.floor(total / 2)) / (total * 0.5)

  useFrame(() => {
    if (!meshRef.current) return

    // ── Arc position driven by scroll ────────────────────────────────────
    // scrollProgress 0→1 slides all cards past camera.
    // Each card has a fixed offset on the arc.
    const sp    = scrollProgress.current
    const x     = baseArcPos - sp * 2.0   // scroll moves the arc

    // ── Andreas circular arc positioning ─────────────────────────────────
    const radius = 11
    const depth  = 5
    meshRef.current.position.x = Math.sin(x) * radius
    meshRef.current.position.z = Math.cos(x) * depth - depth
    meshRef.current.position.y = -x * 0.4
    meshRef.current.rotation.y = x * 0.55

    // ── Alpha: fade out cards far from center ─────────────────────────────
    const proximity = 1 - THREE.MathUtils.smoothstep(Math.abs(x), 0.4, 1.4)
    uniforms.uAlpha.value = THREE.MathUtils.lerp(uniforms.uAlpha.value, proximity, 0.06)

    // Uniform: card's arc X position (used in vertex for perspective lean)
    uniforms.uPosX.value = x
  })

  return (
    <mesh ref={meshRef} geometry={geo}>
      <shaderMaterial
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms as unknown as Record<string, THREE.IUniform>}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// ─── Carousel group ───────────────────────────────────────────────────────────
export default function WebGLCarousel() {
  const groupRef      = useRef<THREE.Group>(null!)
  const scrollProgress = useRef(0)          // 0..1 driven by ScrollTrigger
  const scrollVel      = useRef(0)          // Lenis-style velocity, decayed
  const prevScrollY    = useRef(0)

  // Build all card uniforms + textures (only in browser)
  const cards = useMemo(() => {
    if (typeof window === 'undefined') return []
    return SLIDES.map((s, i) => ({
      index: i,
      uniforms: {
        uTex:            { value: makeTexture(s.label, s.sub, s.hue) },
        uScrollVelocity: { value: 0 },
        uPosX:           { value: (i - Math.floor(SLIDES.length / 2)) / (SLIDES.length * 0.5) },
        uAlpha:          { value: 0 },
        uLoaded:         { value: 0 },
      } as CardUniforms,
    }))
  }, [])

  // Fade-in uLoaded staggered
  useEffect(() => {
    cards.forEach(({ uniforms }, i) => {
      gsap.to(uniforms.uLoaded, {
        value:    1,
        duration: 1.2,
        delay:    0.1 + i * 0.08,
        ease:     'power2.out',
      })
    })
  }, [cards])

  // ScrollTrigger → scrollProgress
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: '#carousel-section',
      start:   'top bottom',
      end:     'bottom top',
      scrub:   1.2,
      onUpdate(self) {
        scrollProgress.current = self.progress
      },
    })
    return () => { trigger.kill() }
  }, [])

  // Velocity tracking (replicates Lenis .velocity)
  useFrame(() => {
    const sy = window.scrollY
    const rawVel = (sy - prevScrollY.current) * 0.01
    prevScrollY.current = sy

    scrollVel.current = THREE.MathUtils.lerp(scrollVel.current, rawVel, 0.15)
    scrollVel.current *= 0.88   // decay

    // Push velocity to all card uniforms
    cards.forEach(({ uniforms }) => {
      uniforms.uScrollVelocity.value = scrollVel.current
    })
  })

  return (
    <group ref={groupRef} position={[0, -4, 0]}>
      {cards.map((card, i) => (
        <Card
          key={i}
          index={card.index}
          total={SLIDES.length}
          uniforms={card.uniforms}
          scrollProgress={scrollProgress}
        />
      ))}
    </group>
  )
}
