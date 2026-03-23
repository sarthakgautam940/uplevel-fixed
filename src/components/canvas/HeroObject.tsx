'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, CubeCamera } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '@/lib/store'
import { GlassMaterialImpl, type GlassMaterialUniforms } from './GlassMaterial'
import { gsap } from 'gsap'

// ─── Custom merged geometry: shield + icosahedron hybrid ─────────────────────
function useShieldGeometry() {
  return useMemo(() => {
    // Icosahedron detail 1 = 80 triangles — good poly count for glass
    const geo = new THREE.IcosahedronGeometry(1.4, 2)
    
    // Slightly flatten Z to give a "shield" silhouette
    const positions = geo.attributes.position.array as Float32Array
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 2] *= 0.72   // compress Z axis
      // Slight organic variation
      positions[i]     *= 0.94 + Math.random() * 0.12
      positions[i + 1] *= 0.94 + Math.random() * 0.12
    }
    geo.attributes.position.needsUpdate = true
    geo.computeVertexNormals()
    return geo
  }, [])
}

// ─── Inner solid core — darker, deeper geometry ──────────────────────────────
function CoreGeometry() {
  const geo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(0.65, 1)
    return g
  }, [])

  return (
    <mesh geometry={geo}>
      <meshPhysicalMaterial
        color="#0a1628"
        emissive="#00E676"
        emissiveIntensity={0.15}
        roughness={0.2}
        metalness={0.8}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

// ─── Wireframe overlay — draws on intro, then fades ──────────────────────────
function WireframeOverlay({ visible }: { visible: boolean }) {
  const ref = useRef<THREE.Mesh>(null!)
  const geo = useMemo(() => new THREE.IcosahedronGeometry(1.42, 2), [])

  useEffect(() => {
    if (!ref.current) return
    gsap.to(ref.current.material as THREE.Material, {
      opacity: visible ? 1 : 0,
      duration: 0.8,
      ease: 'power2.inOut',
    })
  }, [visible])

  return (
    <mesh ref={ref} geometry={geo}>
      <meshBasicMaterial
        color="#00E676"
        wireframe
        transparent
        opacity={0}
      />
    </mesh>
  )
}

// ─── Main HeroObject ─────────────────────────────────────────────────────────
export default function HeroObject() {
  const groupRef    = useRef<THREE.Group>(null!)
  const materialRef = useRef<GlassMaterialUniforms | null>(null)
  const outerRef    = useRef<THREE.Mesh>(null!)

  const { mouseX, mouseY, introComplete, scrollY } = useStore()
  const targetMouse = useRef(new THREE.Vector2(0, 0))
  const currentMouse = useRef(new THREE.Vector2(0, 0))

  const geo = useShieldGeometry()

  // Intro animation: scale from 0, wire → solid
  useEffect(() => {
    if (!groupRef.current) return
    if (!introComplete) {
      gsap.set(groupRef.current.scale, { x: 0, y: 0, z: 0 })
      gsap.set(groupRef.current.position, { y: -0.5 })
    } else {
      // Glitch pop-in
      gsap.timeline()
        .to(groupRef.current.scale, {
          x: 1.15, y: 1.15, z: 1.15,
          duration: 0.6,
          ease: 'back.out(2)',
        })
        .to(groupRef.current.scale, {
          x: 1, y: 1, z: 1,
          duration: 0.4,
          ease: 'power2.out',
        })
        .to(groupRef.current.position, {
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        }, 0)
    }
  }, [introComplete])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Lerp mouse for smooth lag
    targetMouse.current.set(mouseX, mouseY)
    currentMouse.current.lerp(targetMouse.current, 0.04)

    if (materialRef.current) {
      materialRef.current.uTime = t
      materialRef.current.uMouse = currentMouse.current
      materialRef.current.uDistortion = 0.6 + Math.sin(t * 0.5) * 0.4
    }

    if (!groupRef.current) return

    // Scroll: drift upward + tilt as user scrolls past hero
    const scrollEffect = scrollY * 0.003
    groupRef.current.position.y = -scrollEffect * 2

    // Mouse-driven rotation
    const targetRotX = currentMouse.current.y * 0.25
    const targetRotY = currentMouse.current.x * -0.35
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.03
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.03

    // Continuous slow rotation when mouse is still
    const mouseIdle = Math.abs(mouseX) + Math.abs(mouseY) < 0.05 ? 1 : 0
    groupRef.current.rotation.y += 0.002 * mouseIdle
  })

  return (
    <group ref={groupRef}>
      {/* Live cubemap environment — captures scene around the object */}
      <CubeCamera resolution={128} frames={Infinity}>
        {(texture) => (
          <Float
            speed={1.2}
            rotationIntensity={0.3}
            floatIntensity={0.5}
            floatingRange={[-0.08, 0.08]}
          >
            {/* Outer glass shell */}
            <mesh ref={outerRef} geometry={geo}>
              <glassMaterialImpl
                ref={materialRef}
                uEnvMap={texture}
                uColorA={new THREE.Color('#00ff88')}
                uColorB={new THREE.Color('#00a3ff')}
                uIOR={1.45}
                uRoughness={0.04}
                uOpacity={0.85}
                transparent
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Inner darker core */}
            <CoreGeometry />

            {/* Intro wireframe overlay */}
            <WireframeOverlay visible={!introComplete} />
          </Float>
        )}
      </CubeCamera>

      {/* Neon glow sprites at vertices — bloom picks these up */}
      <NeonGlowPoints />

      {/* Point lights that orbit the object */}
      <OrbitingLights />
    </group>
  )
}

// ─── Neon glow points — tiny spheres at icosahedron vertices ─────────────────
function NeonGlowPoints() {
  const positions = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.45, 1)
    const pos = geo.attributes.position
    const pts: [number, number, number][] = []
    const seen = new Set<string>()
    for (let i = 0; i < pos.count; i++) {
      const x = parseFloat(pos.getX(i).toFixed(3))
      const y = parseFloat(pos.getY(i).toFixed(3))
      const z = parseFloat(pos.getZ(i).toFixed(3))
      const key = `${x},${y},${z}`
      if (!seen.has(key)) { seen.add(key); pts.push([x * 0.72, y, z * 0.72]) }
    }
    return pts
  }, [])

  return (
    <>
      {positions.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.018, 6, 6]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? '#00E676' : '#00A3FF'}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </>
  )
}

// ─── Orbiting light rigs ──────────────────────────────────────────────────────
function OrbitingLights() {
  const light1 = useRef<THREE.PointLight>(null!)
  const light2 = useRef<THREE.PointLight>(null!)
  const light3 = useRef<THREE.PointLight>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (light1.current) {
      light1.current.position.x = Math.cos(t * 0.7) * 3
      light1.current.position.z = Math.sin(t * 0.7) * 3
      light1.current.position.y = Math.sin(t * 0.4) * 1.5
    }
    if (light2.current) {
      light2.current.position.x = Math.cos(t * 0.5 + 2.1) * 2.5
      light2.current.position.z = Math.sin(t * 0.5 + 2.1) * 2.5
      light2.current.position.y = Math.cos(t * 0.6) * 1.2
    }
    if (light3.current) {
      light3.current.position.x = Math.cos(t * 0.4 + 4.2) * 2
      light3.current.position.z = Math.sin(t * 0.4 + 4.2) * 2
    }
  })

  return (
    <>
      <pointLight ref={light1} color="#00E676" intensity={4}  distance={8} decay={2} />
      <pointLight ref={light2} color="#00A3FF" intensity={3}  distance={8} decay={2} />
      <pointLight ref={light3} color="#ffffff" intensity={1.5} distance={6} decay={2} />
    </>
  )
}
