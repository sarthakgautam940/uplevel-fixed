'use client'

/**
 * Scene — the global R3F <Canvas>. This is dynamically imported in layout.tsx
 * with ssr:false so Three.js never runs server-side.
 *
 * Canvas configuration decisions:
 *  • antialias: false — SMAA in postprocessing handles AA with better quality
 *  • alpha: true — transparent bg so CSS background shows through
 *  • powerPreference: 'high-performance' — request discrete GPU on dual-GPU systems
 *  • stencil: false — not needed, saves memory
 *  • toneMapping: ACESFilmic — industry standard for HDR bloom pipeline
 *  • toneMappingExposure: 1.1 — slightly boosted for neon pop
 *  • dpr: [1, 1.5] — cap at 1.5× for perf; AdaptiveDpr adjusts below under load
 *  • frameloop: 'always' — we drive glass animation every frame
 *
 * Why not gl.outputColorSpace here?
 *  outputColorSpace is set via renderer.outputColorSpace = SRGBColorSpace inside
 *  the gl prop. Three.js 0.169 defaults to SRGB — no explicit set needed.
 *
 * SceneErrorBoundary catches WebGL context loss (GPU crash, mobile browser
 * backgrounding) and renders a silent fallback, preventing a white screen.
 */

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'

import SceneContent      from './SceneContent'
import SceneErrorBoundary from './SceneErrorBoundary'

export default function Scene() {
  return (
    <SceneErrorBoundary>
      <Canvas
        id="smartplay-canvas"
        camera={{
          position: [0, 0.3, 5.8],
          fov:      44,
          near:     0.1,
          far:      120,
        }}
        gl={{
          antialias:           false,
          alpha:               false,   // scene.background provides the dark bg
          powerPreference:     'high-performance',
          stencil:             false,
          depth:               true,
          toneMapping:         THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        shadows={false}
        dpr={[1, 1.5]}
        frameloop="always"
        flat={false}
        style={{
          position:       'fixed',
          inset:          0,
          zIndex:         0,
          pointerEvents:  'none',
          width:          '100%',
          height:         '100%',
        }}
        onCreated={({ gl, scene }) => {
          // Background lives HERE — on the 3D scene, not the DOM.
          // This ensures the dark bg is always behind the canvas content.
          scene.background = new THREE.Color('#04090f')
          gl.setClearAlpha(1)  // fully opaque canvas
        }}
      >
        {/*
          AdaptiveDpr: automatically lowers pixel ratio when GPU drops below
          targetFramerate. Keeps the animation smooth on lower-end devices.
        */}
        <AdaptiveDpr pixelated />

        {/*
          AdaptiveEvents: disables R3F pointer events computation when no 3D
          objects need them (postprocessing/camera only). Saves CPU.
        */}
        <AdaptiveEvents />

        {/*
          PerformanceMonitor: tracks real FPS, triggers AdaptiveDpr thresholds.
          onDecline → DPR drops. onIncline → DPR recovers.
        */}
        <PerformanceMonitor
          bounds={(refreshrate) => [refreshrate * 0.75, refreshrate * 0.95]}
          onDecline={() => console.info('[SmartPlay] GPU throttled — DPR reduced')}
          onIncline={() => console.info('[SmartPlay] GPU recovered — DPR restored')}
        />

        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </SceneErrorBoundary>
  )
}
