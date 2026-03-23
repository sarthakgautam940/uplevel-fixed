'use client'

/**
 * SceneContent — everything inside <Canvas> except postprocessing and camera.
 * Structured as a clean slot system so Phase 2/3/4 components can be dropped
 * in without touching the canvas root or postprocessing setup.
 *
 * Slot map:
 *  ├── Lighting
 *  ├── Environment (city preset — gives glass real lighting to refract)
 *  ├── [PHASE 2] HeroObject       ← hero glass geometry + GLSL shader
 *  ├── [PHASE 2] GridBackground   ← neon WebGL grid floor
 *  ├── [PHASE 4] WebGLCarousel    ← curved plane array, ScrollTrigger driven
 *  ├── PostProcessing             ← cinematic pipeline
 *  └── CameraRig                  ← mouse + scroll camera controller
 */

import { Suspense } from 'react'
import { Environment } from '@react-three/drei'

import PostProcessing from './PostProcessing'
import CameraRig      from './CameraRig'
import HeroObject     from './HeroObject'
import GridBackground from './GridBackground'
// ── Phase 4 ──────────────────────────────────────────────────────────────────
// import WebGLCarousel from './WebGLCarousel'

// ─── Lighting rig ─────────────────────────────────────────────────────────────
function Lighting() {
  return (
    <>
      {/*
        Ambient: low intensity so glass doesn't flatten — let the env map drive
        the interesting refracted colors instead.
      */}
      <ambientLight intensity={0.25} color="#0a1220" />

      {/*
        Key light: positioned to catch the glass edges and create strong Fresnel
        rim. Phase 2 orbiting point lights supplement this.
      */}
      <directionalLight
        position={[4, 8, 5]}
        intensity={1.4}
        color="#ffffff"
      />

      {/*
        Fill light: warm underside so the dark bg doesn't kill glass depth.
      */}
      <directionalLight
        position={[-3, -4, -5]}
        intensity={0.35}
        color="#0a0828"
      />
    </>
  )
}

// ─── Scene content ────────────────────────────────────────────────────────────
export default function SceneContent() {
  return (
    <>
      <Lighting />

      {/*
        Environment — "city" preset gives neon reflections, glass refraction has
        rich color to pull from. Loaded from Drei's CDN (pmndrs/assets).
        background={false} — we use our own CSS bg, not the HDRI as backdrop.
        environmentIntensity: low to not overpower the neon lights in Phase 2.
      */}
      <Suspense fallback={null}>
        <Environment
          preset="city"
          background={false}
          environmentIntensity={0.55}
        />
      </Suspense>

      {/* ── Phase 2 — LIVE ── */}
      <HeroObject />
      <GridBackground />

      {/* ── Phase 4 ── */}
      {/* <WebGLCarousel /> */}

      {/* ── Always present ── */}
      <PostProcessing />
      <CameraRig />
    </>
  )
}
