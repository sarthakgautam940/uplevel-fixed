'use client'

/**
 * GridBackground — the infinite neon floor grid.
 *
 * Architecture:
 *  Custom ShaderMaterial — NOT drei's <Grid> component, which uses line geometry
 *  and has hard edges. Our shader uses fwidth() (screen-space derivatives) to
 *  anti-alias the grid lines at any zoom level — no jagging or moiré.
 *
 *  Two grid scales:
 *    Primary (2-unit): fine grid, subtle opacity
 *    Secondary (10-unit): landmark grid, brighter, makes the ground feel infinite
 *
 *  Distance fade: smoothstep from 10→40 units from camera's Y=0 projection.
 *  This prevents the grid from clipping hard at the frustum edge.
 *
 *  Breathing pulse: sin(time) adds organic life to the static floor.
 *
 *  Scroll fade: uFade uniform drives opacity to 0 as user scrolls past hero.
 *  The grid should not compete with the carousel section.
 *
 *  Position: Y=-2.5, below the hero object (which floats at Y≈0).
 */

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScroll } from '@/lib/store'

const GRID_VERT = /* glsl */`
  varying vec3 vWorldPos;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorldPos = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`

const GRID_FRAG = /* glsl */`
  #extension GL_OES_standard_derivatives : enable

  uniform float uTime;
  uniform float uFade;
  varying vec3 vWorldPos;

  // Anti-aliased grid line using screen-space derivatives (fwidth).
  // This prevents Moiré/aliasing at oblique viewing angles.
  float gridLine(float coord, float spacing, float lineWidth) {
    float half  = spacing * 0.5;
    float d     = abs(mod(coord + half, spacing) - half);
    float fw    = fwidth(coord) * 1.5;   // 1.5× for softer AA
    return 1.0 - smoothstep(lineWidth - fw, lineWidth + fw, d);
  }

  void main() {
    // ── Primary grid (2-unit spacing) ─────────────────────────────────────
    float gX1 = gridLine(vWorldPos.x, 2.0, 0.016);
    float gZ1 = gridLine(vWorldPos.z, 2.0, 0.016);
    float g1  = max(gX1, gZ1);

    // ── Secondary grid (10-unit spacing) ──────────────────────────────────
    float gX2 = gridLine(vWorldPos.x, 10.0, 0.034);
    float gZ2 = gridLine(vWorldPos.z, 10.0, 0.034);
    float g2  = max(gX2, gZ2);

    // ── Distance fade from camera view ────────────────────────────────────
    float dist = length(vWorldPos.xz);
    float fade = (1.0 - smoothstep(10.0, 42.0, dist)) * uFade;

    // ── Breathing pulse ────────────────────────────────────────────────────
    float pulse = 0.70 + sin(uTime * 0.50) * 0.06;

    float alpha = (g1 * 0.28 + g2 * 0.68) * fade * pulse;

    // ── Colour: green for primary lines, blue for secondary ───────────────
    vec3 colPrimary   = vec3(0.0,  0.88, 0.52) * 0.32;   // dim neon green
    vec3 colSecondary = vec3(0.05, 0.64, 1.00) * 0.46;   // dim neon blue
    vec3 col = mix(colPrimary, colSecondary, g2);

    // Boost secondary line brightness slightly
    col += colSecondary * g2 * 0.18;

    gl_FragColor = vec4(col, alpha);
  }
`

export default function GridBackground() {
  const matRef = useRef<THREE.ShaderMaterial>(null!)
  const { y: scrollY } = useScroll()

  useFrame(({ clock }) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value = clock.getElapsedTime()
    // Fade the grid out as user scrolls: gone by scrollY=700
    matRef.current.uniforms.uFade.value = Math.max(0, 1 - scrollY / 700)
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
      <planeGeometry args={[140, 140, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={GRID_VERT}
        fragmentShader={GRID_FRAG}
        uniforms={{
          uTime: { value: 0 },
          uFade: { value: 1 },
        }}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        // Enable GL_OES_standard_derivatives for fwidth()
        extensions={{ derivatives: true } as any}
      />
    </mesh>
  )
}
