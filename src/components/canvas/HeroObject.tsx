'use client'

/**
 * HeroObject — the centrepiece 3D element.
 *
 * Architecture decisions:
 *
 *  GEOMETRY: IcosahedronGeometry(1.42, 5)
 *    Detail=5 gives 5,120 triangles — dense enough for smooth simplex noise
 *    displacement without visible faceting. We flatten Z×0.68 to get a
 *    "shield" silhouette that reads as athletic/protective. Organic XY variance
 *    (±8%) breaks the perfect mathematical symmetry so it feels crafted, not
 *    algorithmic.
 *
 *  MATERIAL: HeroGlassMaterialImpl (custom GLSL, see HeroGlassMaterial.tsx)
 *    Uses CubeCamera for live environment reflections — the glass reflects
 *    the orbiting neon lights in real time, which looks dramatically better
 *    than a static HDRI for this type of interactive hero object.
 *    CubeCamera resolution=128, frames=2 — updates every 2 frames to halve
 *    the rendering cost while still feeling "live".
 *
 *  ROTATIONAL INERTIA: useFrame lerp
 *    targetRot is set from mouse each frame. currentRot lerps toward it at 0.038.
 *    This gives ~0.8s settling time — enough to feel physical, not laggy.
 *    Idle auto-rotation engages when mouseVel < 0.008.
 *
 *  FLOAT: manual sine instead of <Float>
 *    <Float> from drei uses its own RAF loop. We compute the float in our
 *    useFrame to keep everything synchronized and avoid double-RAF overhead.
 *
 *  INNER CORE: MeshPhysicalMaterial
 *    Dark emissive core gives visual depth — looks like an energy source
 *    inside the glass shell. Emissive at 0.18 is bloom-threshold (0.38)
 *    just below trigger, so it glows subtly without overwhelming.
 *    Phase 3 will animate emissiveIntensity from 0 → 0.18 on intro complete.
 *
 *  NEON GLOW POINTS: vertex spheres
 *    Tiny spheres at each unique icosahedron vertex. MeshBasicMaterial at
 *    full white-ish neon — these definitely exceed bloom threshold so the
 *    bloom pass halos them. Creates the "power nodes" aesthetic.
 *
 *  ORBITING LIGHTS: 3 PointLights in useFrame
 *    Light 1 (green, intensity 10) — primary neon contribution to glass edges
 *    Light 2 (blue,  intensity 7)  — secondary chromatic contribution
 *    Light 3 (white, intensity 4)  — catches the inner core, lifts dark areas
 *    All three orbit at different radii/speeds/phases for complex light play.
 */

import { useRef, useMemo, useEffect } from 'react'
import { useFrame          } from '@react-three/fiber'
import { CubeCamera, Float } from '@react-three/drei'
import * as THREE            from 'three'
import { gsap               } from 'gsap'
import { useMouse, useScroll, useIntro } from '@/lib/store'
import { HeroGlassMaterialImpl, type HeroGlassMaterialType } from './HeroGlassMaterial'

// ─── Constants ────────────────────────────────────────────────────────────────
const GREEN = new THREE.Color('#00FF88')
const BLUE  = new THREE.Color('#00A3FF')

// ─── Shield geometry (memoised — expensive to build) ─────────────────────────
function useShieldGeometry() {
  return useMemo(() => {
    // High-density icosahedron for smooth shader displacement
    const geo = new THREE.IcosahedronGeometry(1.42, 5)
    const pos = geo.attributes.position.array as Float32Array

    for (let i = 0; i < pos.length; i += 3) {
      pos[i + 2] *= 0.68                           // Z flatten → shield silhouette
      pos[i]     *= 0.92 + (Math.random() * 0.16)  // organic XY variance
      pos[i + 1] *= 0.92 + (Math.random() * 0.16)
    }
    geo.attributes.position.needsUpdate = true
    geo.computeVertexNormals()
    return geo
  }, [])
}

// ─── Glow point positions (icosahedron vertices) ──────────────────────────────
function useGlowPositions() {
  return useMemo(() => {
    // Extract unique vertices from a lower-detail ico for manageable point count
    const pg  = new THREE.IcosahedronGeometry(1.48, 2)
    const pa  = pg.attributes.position
    const pts: [number, number, number][] = []
    const seen = new Set<string>()

    for (let i = 0; i < pa.count; i++) {
      const x = parseFloat(pa.getX(i).toFixed(3))
      const y = parseFloat(pa.getY(i).toFixed(3))
      const z = parseFloat(pa.getZ(i).toFixed(3))
      const key = `${x},${y},${z}`
      if (!seen.has(key)) {
        seen.add(key)
        pts.push([x * 0.68, y, z * 0.68])  // match Z-flatten of main geo
      }
    }
    pg.dispose()
    return pts
  }, [])
}

// ─── Neon glow points ─────────────────────────────────────────────────────────
function GlowPoints() {
  const positions = useGlowPositions()

  return (
    <>
      {positions.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.014, 5, 5]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? '#00FF88' : '#00A3FF'}
            transparent
            opacity={0.95}
          />
        </mesh>
      ))}
    </>
  )
}

// ─── Orbiting light rig ───────────────────────────────────────────────────────
function OrbitingLights() {
  const l1 = useRef<THREE.PointLight>(null!)
  const l2 = useRef<THREE.PointLight>(null!)
  const l3 = useRef<THREE.PointLight>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Green — large orbit, primary neon contribution
    l1.current.position.set(
      Math.cos(t * 0.62) * 3.4,
      Math.sin(t * 0.40) * 1.6,
      Math.sin(t * 0.62) * 3.4,
    )
    // Blue — medium orbit, offset phase
    l2.current.position.set(
      Math.cos(t * 0.48 + 2.09) * 2.8,
      Math.cos(t * 0.52) * 1.3,
      Math.sin(t * 0.48 + 2.09) * 2.8,
    )
    // White — close orbit, fills dark faces
    l3.current.position.set(
      Math.cos(t * 0.36 + 4.19) * 2.0,
      0.7,
      Math.sin(t * 0.36 + 4.19) * 2.0,
    )
  })

  return (
    <>
      <pointLight ref={l1} color="#00FF88" intensity={10} distance={11} decay={2} />
      <pointLight ref={l2} color="#00A3FF" intensity={7}  distance={11} decay={2} />
      <pointLight ref={l3} color="#ffffff" intensity={4}  distance={7}  decay={2} />
    </>
  )
}

// ─── Wireframe overlay (Phase 3 will animate this) ───────────────────────────
export function WireframeOverlay({ opacity = 0 }: { opacity?: number }) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null!)

  useEffect(() => {
    if (matRef.current) matRef.current.opacity = opacity
  }, [opacity])

  const geo = useMemo(() => new THREE.IcosahedronGeometry(1.44, 5), [])

  return (
    <mesh geometry={geo}>
      <meshBasicMaterial
        ref={matRef}
        color="#00FF88"
        wireframe
        transparent
        opacity={opacity}
      />
    </mesh>
  )
}

// ─── Main HeroObject ──────────────────────────────────────────────────────────
export default function HeroObject() {
  const groupRef   = useRef<THREE.Group>(null!)
  const matRef     = useRef<HeroGlassMaterialType>(null!)
  const coreRef    = useRef<THREE.MeshPhysicalMaterial>(null!)

  const geo = useShieldGeometry()

  const { x: mx, y: my, vel: mouseVel, velX, velY } = useMouse()
  const { y: scrollY }  = useScroll()
  const { complete: introComplete } = useIntro()

  // Lerped rotation state (smooth inertia)
  const currentRotX = useRef(0)
  const currentRotY = useRef(0)
  const idleRotY    = useRef(0)

  // ── Intro: scale from 0 → glass solidification (Phase 3 expands this) ──
  useEffect(() => {
    if (!groupRef.current) return

    if (!introComplete) {
      // Hidden until intro completes
      groupRef.current.scale.setScalar(0)
      return
    }

    // Pop-in with overshoot
    gsap.timeline()
      .to(groupRef.current.scale, {
        x: 1.18, y: 1.18, z: 1.18,
        duration: 0.65,
        ease: 'back.out(2.2)',
      })
      .to(groupRef.current.scale, {
        x: 1, y: 1, z: 1,
        duration: 0.5,
        ease: 'power3.out',
      })
      .to(groupRef.current.position, {
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
      }, 0)

    // Core emissive ramps up to full brightness
    gsap.to(coreRef.current, {
      emissiveIntensity: 0.18,
      duration: 1.4,
      delay: 0.4,
      ease: 'power2.out',
    })
  }, [introComplete])

  // ── Main animation loop ───────────────────────────────────────────────────
  useFrame(({ clock }) => {
    const t   = clock.getElapsedTime()
    const mat = matRef.current
    if (!mat) return

    // Update material uniforms
    mat.uTime     = t
    mat.uMouse.set(mx, my)
    mat.uMouseVel = Math.min(mouseVel * 8, 1.0)  // scale velocity to 0..1
    // Breathing distortion: base oscillation + mouse velocity boost
    mat.uDistortion = 0.6 + Math.sin(t * 0.38) * 0.35 + Math.min(mouseVel * 4, 0.6)

    if (!groupRef.current) return

    // ── Rotational inertia ─────────────────────────────────────────────────
    const targetRotX = my * 0.26
    const targetRotY = mx * -0.32

    currentRotX.current += (targetRotX - currentRotX.current) * 0.038
    currentRotY.current += (targetRotY - currentRotY.current) * 0.038

    // Idle auto-rotation — engages when mouse is still
    const isIdle = mouseVel < 0.008
    if (isIdle) idleRotY.current += 0.0016

    groupRef.current.rotation.x = currentRotX.current
    groupRef.current.rotation.y = currentRotY.current + idleRotY.current

    // ── Float (manual — no <Float> wrapper to avoid double RAF) ───────────
    const floatY = Math.sin(t * 0.72) * 0.055
    const floatZ = Math.sin(t * 0.38) * 0.012

    // ── Scroll drift — object rises as user scrolls down ──────────────────
    const scrollDrift = -scrollY * 0.0028

    groupRef.current.position.y = floatY + scrollDrift
    groupRef.current.rotation.z = floatZ
  })

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/*
        CubeCamera — renders the scene 6× into a cubemap each N frames.
        The glass material samples this for live reflections.
        resolution=128 → sharp enough for glass. frames=2 → runs every other frame.
        near/far: tight frustum so only the coloured lights appear in the cubemap.
      */}
      <CubeCamera resolution={128} frames={2} near={0.1} far={20}>
        {(texture) => (
          <>
            {/* Outer glass shell — receives the live cubemap */}
            <mesh geometry={geo}>
              <heroGlassMaterialImpl
                ref={matRef}
                uEnvMap={texture}
                uColorA={GREEN}
                uColorB={BLUE}
                uIOR={1.48}
                uRoughness={0.04}
                uOpacity={0.88}
                transparent
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/*
              Inner dark core — gives glass visual depth.
              emissiveIntensity starts at 0, GSAP animates to 0.18 on intro.
              Slightly below bloom threshold so it glows without flaring.
            */}
            <mesh>
              <icosahedronGeometry args={[0.58, 3]} />
              <meshPhysicalMaterial
                ref={coreRef}
                color="#000e08"
                emissive="#00FF88"
                emissiveIntensity={0}
                roughness={0.25}
                metalness={0.75}
                transparent
                opacity={0.88}
              />
            </mesh>

            {/*
              Wireframe overlay — Phase 3 will animate this:
              opacity 1 → 0 when intro glitch transition fires.
              Currently hidden.
            */}
            <WireframeOverlay opacity={0} />
          </>
        )}
      </CubeCamera>

      {/* Neon glow points at vertices — bloom halos these */}
      <GlowPoints />

      {/* Orbiting neon lights — show in glass reflections via CubeCamera */}
      <OrbitingLights />
    </group>
  )
}
