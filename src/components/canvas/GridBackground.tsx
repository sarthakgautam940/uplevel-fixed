'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/lib/store'

const gridFrag = /* glsl */`
  uniform float uTime;
  uniform float uFade;
  uniform vec3 uColorA;  // grid line color
  uniform vec3 uColorB;  // secondary grid color

  varying vec2 vUv;
  varying vec3 vWorldPos;

  // Grid function — returns 0..1 closeness to line
  float grid(vec2 p, float size, float lineWidth) {
    vec2 g = abs(fract(p / size - 0.5) - 0.5) / fwidth(p / size);
    return 1.0 - min(min(g.x, g.y), 1.0);
  }

  void main() {
    // Primary 2-unit grid
    float g1 = grid(vWorldPos.xz, 2.0, 1.0) * 0.4;
    // Secondary 10-unit grid
    float g2 = grid(vWorldPos.xz, 10.0, 1.5) * 0.8;

    // Distance fade — fades to 0 at horizon
    float dist = length(vWorldPos.xz);
    float distFade = 1.0 - smoothstep(15.0, 45.0, dist);

    // Color: primary lines are blue-green tinted
    vec3 color = mix(uColorA, uColorB, g2);
    float alpha = max(g1, g2) * distFade * uFade;

    // Pulse breathing
    alpha *= 0.7 + sin(uTime * 0.5) * 0.05;

    gl_FragColor = vec4(color, alpha);
  }
`

const gridVert = /* glsl */`
  varying vec2 vUv;
  varying vec3 vWorldPos;

  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

export default function GridBackground() {
  const matRef = useRef<THREE.ShaderMaterial>(null!)
  const { scrollY } = useStore()

  const uniforms = useMemo(() => ({
    uTime:   { value: 0 },
    uFade:   { value: 1 },
    uColorA: { value: new THREE.Color('#00E676').multiplyScalar(0.25) },
    uColorB: { value: new THREE.Color('#00A3FF').multiplyScalar(0.35) },
  }), [])

  useFrame(({ clock }) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value  = clock.getElapsedTime()
    // Fade grid as user scrolls away from hero
    matRef.current.uniforms.uFade.value  = Math.max(0, 1 - scrollY / 600)
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]} receiveShadow>
      <planeGeometry args={[120, 120, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={gridVert}
        fragmentShader={gridFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        extensions={{ derivatives: true } as any}
      />
    </mesh>
  )
}
