'use client'

/**
 * PostProcessing — isolated R3F component containing the full postprocessing
 * pipeline. Lives inside the <Canvas>. Reads glitch state from the store.
 *
 * Pipeline order (matters — each pass reads from the previous):
 *   1. RenderPass (implicit in EffectComposer)
 *   2. SMAA — smooth anti-aliasing (replaces antialias:true on renderer)
 *   3. Bloom — neon edge glow catch, glass emissive spill
 *   4. ChromaticAberration — always-on subtle + spikes on scroll/glitch
 *   5. Glitch — fires during intro transition (Phase 3)
 *   6. Noise — film grain for organic texture
 *   7. Vignette — focus pull, pushes edges dark
 *
 * Architectural notes:
 *  • disableNormalPass: true — we don't use SSAO/depth effects in Phase 1
 *  • multisampling: 0 — SMAA handles AA; MSAA + postprocessing causes artifacts
 *  • ChromaticAberration offset is driven by glitchStrength + scrollVel
 *    so fast scrolls punch up the aberration without triggering full glitch
 */

import { useMemo, type ReactElement } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Glitch,
  Noise,
  Vignette,
  SMAA,
} from '@react-three/postprocessing'
import { BlendFunction, GlitchMode } from 'postprocessing'
import { Vector2 } from 'three'
import { useGlitch, useScroll } from '@/lib/store'

// Stable Vector2 references — avoids re-creating every render
const CA_OFFSET_IDLE   = new Vector2(0.0014, 0.0008)
const CA_OFFSET_GLITCH = new Vector2(0.012,  0.006)
const GLITCH_DELAY     = new Vector2(0,      0)
const GLITCH_DURATION  = new Vector2(0.18,   0.48)
const GLITCH_STRENGTH  = new Vector2(0.15,   0.45)

export default function PostProcessing() {
  const { active: glitchActive, strength: glitchStrength, decay } = useGlitch()
  const { vel: scrollVel } = useScroll()

  // Decay glitch each frame (exponential falloff drives smooth return)
  useFrame(() => {
    if (glitchActive) decay()
  })

  // Compute dynamic CA offset: base + scroll velocity contribution + glitch spike
  const caOffset = useMemo(() => new Vector2(), [])
  useFrame(() => {
    const scrollContrib = Math.min(Math.abs(scrollVel) * 0.0003, 0.006)
    const glitchContrib = glitchStrength * 0.012
    const x = CA_OFFSET_IDLE.x + scrollContrib + glitchContrib
    const y = CA_OFFSET_IDLE.y + scrollContrib * 0.5 + glitchContrib * 0.5
    caOffset.set(x, y)
  })

  return (
    <EffectComposer multisampling={0} renderPriority={1}>
      {/* ① Anti-aliasing — temporal SMAA, best quality for dark scenes */}
      <SMAA />

      {/* ② Bloom — threshold tuned for neon edges; intensity modest by default,
               Phase 2 glass material emits on Fresnel edges → bloom catches them */}
      <Bloom
        luminanceThreshold={0.38}
        luminanceSmoothing={0.82}
        intensity={0.72}
        mipmapBlur
        radius={0.68}
        blendFunction={BlendFunction.SCREEN}
      />

      {/* ③ Chromatic Aberration — driven dynamically by useFrame above */}
      <ChromaticAberration
        offset={caOffset}
        radialModulation={false}
        modulationOffset={0}
        blendFunction={BlendFunction.NORMAL}
      />

      {(
        <Glitch
          delay={GLITCH_DELAY}
          duration={GLITCH_DURATION}
          strength={GLITCH_STRENGTH}
          mode={GlitchMode.CONSTANT_WILD}
          active={glitchActive}
          ratio={0.82}
        />
      ) as ReactElement}

      {/* ⑤ Film Grain — subtle, high-frequency texture, makes dark scenes feel
               organic instead of flat/digital */}
      <Noise
        opacity={0.022}
        blendFunction={BlendFunction.SCREEN}
      />

      {/* ⑥ Vignette — darkens edges, pulls focus to centre hero object */}
      <Vignette
        eskil={false}
        offset={0.06}
        darkness={0.90}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  )
}
