'use client'

import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  AdaptiveDpr,
  AdaptiveEvents,
  PerformanceMonitor,
} from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Glitch,
  Noise,
  Vignette,
} from '@react-three/postprocessing'
import { GlitchMode } from 'postprocessing'
import { Vector2 } from 'three'
import { useStore } from '@/lib/store'

import HeroObject      from './HeroObject'
import GridBackground  from './GridBackground'
import WebGLCarousel   from './WebGLCarousel'
import CameraRig       from './CameraRig'

// ─── Post-processing pipeline ─────────────────────────────────────────────────
function Effects() {
  const { glitchActive } = useStore()

  const effects: JSX.Element[] = [
    <Bloom
      key="bloom"
      luminanceThreshold={0.55}
      luminanceSmoothing={0.9}
      intensity={1.2}
      mipmapBlur
      radius={0.8}
    />,
    <ChromaticAberration
      key="ca"
      radialModulation={false}
      modulationOffset={0}
      offset={new Vector2(
        glitchActive ? 0.008 : 0.0012,
        glitchActive ? 0.004 : 0.0006
      )}
    />,
    <Glitch
      key="glitch"
      delay={new Vector2(0, 0)}
      duration={new Vector2(0.15, 0.4)}
      strength={new Vector2(0.15, 0.4)}
      mode={GlitchMode.CONSTANT_WILD}
      active={glitchActive}
      ratio={0.85}
    />,
    <Noise key="noise" opacity={0.025} />,
    <Vignette key="vig" eskil={false} offset={0.1} darkness={0.85} />,
  ]

  return (
    <EffectComposer multisampling={2}>
      {effects}
    </EffectComposer>
  )
}

// ─── Scene content ────────────────────────────────────────────────────────────
function SceneContent() {
  return (
    <>
      {/* Ambient + directional lighting */}
      <ambientLight intensity={0.28} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.95}
        color="#ffffff"
      />

      {/* No remote HDRI: @react-three/drei presets load from raw.githack.com and often fail
          behind blockers / flaky CDNs (common cause of Vercel "client-side exception"). */}
      <hemisphereLight intensity={0.22} color="#1a3a5c" groundColor="#04090f" />

      {/* 3D grid floor */}
      <GridBackground />

      {/* Hero glass object */}
      <HeroObject />

      {/* WebGL image carousel */}
      <WebGLCarousel />

      {/* Post-processing */}
      <Effects />

      {/* Camera controller */}
      <CameraRig />
    </>
  )
}

// ─── Root Scene (exported — dynamically imported in layout) ──────────────────
export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 5.5], fov: 45, near: 0.1, far: 100 }}
      gl={{
        antialias:      false,   // postprocessing handles AA
        alpha:          true,
        powerPreference: 'high-performance',
        stencil:        false,
        depth:          true,
        toneMapping:    3,       // THREE.ACESFilmicToneMapping
        toneMappingExposure: 1.2,
      }}
      shadows={false}
      dpr={[1, 1.5]}             // cap at 1.5 for performance
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',   // DOM sits on top, handles events
      }}
    >
      {/* Performance adaptive DPR */}
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <PerformanceMonitor
        onDecline={() => console.log('[SmartPlay] GPU throttled — reducing DPR')}
      />

      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  )
}
