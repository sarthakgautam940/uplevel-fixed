'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '@/lib/store'

gsap.registerPlugin(ScrollTrigger)

// ─── Ripple shader for image planes ──────────────────────────────────────────

const rippleVert = /* glsl */`
  uniform float uTime;
  uniform float uScrollOffset;
  uniform float uHover;

  varying vec2 vUv;
  varying float vWave;

  void main() {
    vUv = uv;
    float wave = sin(position.x * 3.0 + uTime * 1.2) * 0.015
               + sin(position.y * 3.0 + uTime * 0.9 + 1.57) * 0.015;
    float scrollBend = sin(uScrollOffset * 3.14159) * 0.06;
    float dist = length(position.xy);
    float hoverWave = sin(dist * 6.0 - uTime * 3.0) * uHover * 0.04 * (1.0 - dist * 0.5);
    vWave = wave + scrollBend + hoverWave;
    vec3 displaced = position + vec3(0.0, 0.0, vWave);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`

const rippleFrag = /* glsl */`
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uHover;
  uniform float uAlpha;

  varying vec2 vUv;
  varying float vWave;

  void main() {
    vec2 uv = vUv + vec2(vWave * 0.02, vWave * 0.015);
    float ab = uHover * 0.004;
    float r = texture2D(uTexture, uv + vec2(ab,  0.0)).r;
    float g = texture2D(uTexture, uv              ).g;
    float b = texture2D(uTexture, uv - vec2(ab,  0.0)).b;
    vec3 col = vec3(r, g, b);

    // Vignette edge fade
    vec2 c = vUv * 2.0 - 1.0;
    float vig = 1.0 - smoothstep(0.7, 1.0, length(c));

    // Hover neon green tint
    col = mix(col, col + vec3(0.0, 1.0, 0.53) * 0.15, uHover * vig);

    // Scanline on hover
    col -= sin(vUv.y * 200.0) * 0.02 * uHover;

    gl_FragColor = vec4(col, uAlpha * vig);
  }
`

// ─── Single image plane ───────────────────────────────────────────────────────
interface ImagePlaneProps {
  texture: THREE.Texture
  position: [number, number, number]
  index: number
  scrollXRef: React.MutableRefObject<number>
}

function ImagePlane({ texture, position, index, scrollXRef }: ImagePlaneProps) {
  const meshRef    = useRef<THREE.Mesh>(null!)
  const matRef     = useRef<THREE.ShaderMaterial>(null!)
  const hoverRef   = useRef(0)
  const alphaRef   = useRef(0)

  const uniforms = useMemo(() => ({
    uTexture:      { value: texture },
    uTime:         { value: 0 },
    uScrollOffset: { value: 0 },
    uHover:        { value: 0 },
    uAlpha:        { value: 0 },
  }), [texture])

  useFrame(({ clock }) => {
    if (!matRef.current || !meshRef.current) return
    const t = clock.getElapsedTime()

    // Move plane horizontally with scroll
    meshRef.current.position.x = position[0] - scrollXRef.current

    matRef.current.uniforms.uTime.value         = t
    matRef.current.uniforms.uHover.value        = hoverRef.current
    matRef.current.uniforms.uScrollOffset.value =
      (meshRef.current.position.x / 14) % 1   // relative position along carousel

    // Fade in once positioned near screen center
    const screenX = Math.abs(meshRef.current.position.x)
    const targetAlpha = screenX < 9 ? 1 : 0
    alphaRef.current += (targetAlpha - alphaRef.current) * 0.05
    matRef.current.uniforms.uAlpha.value = alphaRef.current
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerEnter={() => gsap.to(hoverRef, { current: 1, duration: 0.4, ease: 'power2.out' })}
      onPointerLeave={() => gsap.to(hoverRef, { current: 0, duration: 0.6, ease: 'power2.out' })}
    >
      <planeGeometry args={[3.2, 2.0, 32, 20]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={rippleVert}
        fragmentShader={rippleFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

// ─── Carousel container ───────────────────────────────────────────────────────
const FEATURE_IMAGES = [
  '/images/carousel/training.jpg',
  '/images/carousel/analytics.jpg',
  '/images/carousel/nutrition.jpg',
  '/images/carousel/recovery.jpg',
  '/images/carousel/video.jpg',
]

// Fallback if images not loaded — gradient textures
function useFallbackTextures(count: number): THREE.Texture[] {
  return useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 512
      const ctx = canvas.getContext('2d')!
      const hues = [155, 210, 280, 170, 130]
      const grd = ctx.createLinearGradient(0, 0, 512, 512)
      grd.addColorStop(0, `hsla(${hues[i]}, 80%, 15%, 1)`)
      grd.addColorStop(1, `hsla(${hues[i] + 40}, 90%, 8%, 1)`)
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, 512, 512)
      // Label
      ctx.fillStyle = `hsla(${hues[i]}, 100%, 70%, 0.9)`
      ctx.font = 'bold 48px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(['TRAINING', 'ANALYTICS', 'NUTRITION', 'RECOVERY', 'VIDEO'][i], 256, 272)
      const tex = new THREE.CanvasTexture(canvas)
      return tex
    })
  }, [count])
}

export default function WebGLCarousel() {
  const scrollXRef = useRef(0)
  const { scrollY } = useStore()
  const textures = useFallbackTextures(FEATURE_IMAGES.length)

  const SPACING = 3.8
  const positions = useMemo(() =>
    FEATURE_IMAGES.map((_, i) => [
      (i - Math.floor(FEATURE_IMAGES.length / 2)) * SPACING,
      -3.8,  // Y: below hero section
      -1.0,  // Z: slightly behind
    ] as [number, number, number]),
  [])

  // GSAP ScrollTrigger drives the horizontal scroll
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: '#carousel-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        // Map scroll progress to horizontal offset
        const target = self.progress * SPACING * (FEATURE_IMAGES.length - 1)
        gsap.to(scrollXRef, { current: target, duration: 0.6, ease: 'power2.out', overwrite: true })
      },
    })
    return () => trigger.kill()
  }, [])

  return (
    <group>
      {FEATURE_IMAGES.map((_, i) => (
        <ImagePlane
          key={i}
          texture={textures[i]}
          position={positions[i]}
          index={i}
          scrollXRef={scrollXRef}
        />
      ))}
    </group>
  )
}
