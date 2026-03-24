'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, PerspectiveCamera } from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

import HeroObject       from './HeroObject'
import WebGLCarousel    from './WebGLCarousel'
import SceneErrorBoundary from './SceneErrorBoundary'

// ── Dynamic effects: CA offset tied to scroll velocity ───────────────────────
function DynamicEffects() {
  const caOffset   = useRef(new THREE.Vector2(0.002, 0.001))
  const prevScroll = useRef(0)
  const smoothVel  = useRef(0)

  useFrame(() => {
    const sy = window.scrollY
    const rawVel = Math.abs(sy - prevScroll.current)
    prevScroll.current = sy
    smoothVel.current  = THREE.MathUtils.lerp(smoothVel.current, rawVel, 0.10)
    smoothVel.current *= 0.86

    const base  = 0.0015
    const boost = smoothVel.current * 0.00035
    caOffset.current.set(base + boost, (base + boost) * 0.5)
  })

  return (
    <EffectComposer disableNormalPass>
      <Bloom
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        intensity={1.5}
        mipmapBlur
        radius={0.8}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={caOffset.current as any}
        radialModulation={false}
        modulationOffset={0}
      />
      <Noise  opacity={0.018} blendFunction={BlendFunction.SCREEN} />
      <Vignette eskil={false} offset={0.05} darkness={0.88} />
    </EffectComposer>
  )
}

// ── Camera parallax ───────────────────────────────────────────────────────────
function CameraController() {
  const camPos = useRef(new THREE.Vector3(0, 0, 8))
  const target = useRef(new THREE.Vector3(0, 0, 8))

  useFrame(({ camera, mouse }) => {
    target.current.x = mouse.x * 0.42
    target.current.y = mouse.y * 0.22
    camPos.current.lerp(target.current, 0.028)
    camera.position.x = camPos.current.x
    camera.position.y = camPos.current.y
    camera.position.z = 8
    camera.lookAt(0, 0, 0)
  })
  return (
    <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} near={0.1} far={100} />
  )
}

// ── Root Scene ────────────────────────────────────────────────────────────────
export default function Scene() {
  return (
    <SceneErrorBoundary>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: '#04090f' }}>
        <Canvas
          dpr={[1, 2]}
          gl={{
            antialias:           false,
            powerPreference:     'high-performance',
            alpha:               false,
            stencil:             false,
            toneMapping:         THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
          }}
          onCreated={({ scene }) => {
            scene.background = new THREE.Color('#04090f')
            scene.fog = new THREE.FogExp2('#04090f', 0.012)
          }}
        >
          <CameraController />
          <ambientLight intensity={0.15} color="#080c18" />

          <Suspense fallback={null}>
            <Environment preset="city" background={false} environmentIntensity={0.3} />
          </Suspense>

          <Suspense fallback={null}>
            <HeroObject />
          </Suspense>

          {/* Carousel — below hero, scrolls into view */}
          <Suspense fallback={null}>
            <WebGLCarousel />
          </Suspense>

          <DynamicEffects />
        </Canvas>
      </div>
    </SceneErrorBoundary>
  )
}
