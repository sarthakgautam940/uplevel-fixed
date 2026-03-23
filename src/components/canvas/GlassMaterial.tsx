'use client'

import { shaderMaterial } from '@react-three/drei'
import { extend, type ReactThreeFiber } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Inline GLSL ────────────────────────────────────────────────────────────
// Inlined here so no raw file import needed in Next.js
// For production, use next.config rawLoader or process.env raw strings

const glassFrag = /* glsl */`
  uniform float uTime;
  uniform vec2 uMouse;
  uniform samplerCube uEnvMap;
  uniform float uIOR;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  uniform float uRoughness;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewDirection;
  varying vec2 vUv;
  varying float vFresnel;

  vec3 refractRGB(vec3 dir, vec3 normal, float ior) {
    float iorR = ior - 0.025;
    float iorG = ior;
    float iorB = ior + 0.025;
    return vec3(
      textureCube(uEnvMap, refract(-dir, normal, 1.0 / iorR)).r,
      textureCube(uEnvMap, refract(-dir, normal, 1.0 / iorG)).g,
      textureCube(uEnvMap, refract(-dir, normal, 1.0 / iorB)).b
    );
  }

  float prismScatter(vec3 normal, float time) {
    float angle = atan(normal.y, normal.x) + time * 0.5;
    return abs(sin(angle * 6.0)) * 0.5 + 0.5;
  }

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDirection);
    vec3 R = reflect(-V, N);

    vec3 reflection = textureCube(uEnvMap, R).rgb;
    vec3 roughRefl  = textureCube(uEnvMap, R, uRoughness * 8.0).rgb;
    reflection = mix(reflection, roughRefl, uRoughness);

    vec3 refraction = refractRGB(V, N, uIOR);

    float scatter1 = prismScatter(N, uTime);
    float scatter2 = prismScatter(N, uTime + 3.14159);

    float grad = clamp((vUv.y + N.y * 0.5 + 0.5) * 0.5 + sin(uTime * 0.4) * 0.1, 0.0, 1.0);
    vec3 neonColor = mix(uColorA, uColorB, grad);

    vec3 scatterColor = neonColor * (scatter1 * 0.6 + scatter2 * 0.4) * vFresnel * 2.0;
    scatterColor *= 1.0 + length(uMouse) * 0.8;

    float thinFilm = sin(dot(N, V) * 12.0 + uTime * 0.8) * 0.5 + 0.5;
    vec3 iridescence = mix(uColorA, uColorB, thinFilm) * thinFilm * 0.3;

    vec3 base = mix(refraction, reflection, vFresnel * 0.8);
    vec3 finalColor = base + scatterColor * 0.4 + iridescence;
    finalColor = mix(finalColor, neonColor * 0.2, 0.15);
    finalColor += neonColor * pow(vFresnel, 1.5) * 0.6;

    float opacity = mix(uOpacity * 0.3, uOpacity * 0.85, vFresnel);
    gl_FragColor = vec4(finalColor, opacity);
  }
`

const glassVert = /* glsl */`
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uDistortion;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec3 vViewDirection;
  varying vec2 vUv;
  varying float vFresnel;

  float hash(vec3 p) {
    p = fract(p * vec3(443.897, 441.423, 437.195));
    p += dot(p, p.yxz + 19.19);
    return fract((p.x + p.y) * p.z);
  }

  float smoothNoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i+vec3(1,0,0)), f.x),
          mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
          mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }

  void main() {
    vUv = uv;
    vec3 n = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;

    vec3 camPos = (inverse(viewMatrix) * vec4(0,0,0,1)).xyz;
    vViewDirection = normalize(camPos - worldPos.xyz);
    vFresnel = pow(1.0 - max(0.0, dot(n, vViewDirection)), 3.0);

    float breathe =
      smoothNoise(position * 1.5 + vec3(uTime * 0.3)) * 0.028
      + smoothNoise(position * 4.2 + vec3(uTime * 0.18)) * 0.012;
    vec2 mi = uMouse * 0.5;
    float md = length(position.xy * 0.5 - mi);
    float mouseWave = sin(md * 8.0 - uTime * 2.0) * 0.02 * uDistortion;
    float mousePush = exp(-md * 3.0) * 0.08 * uDistortion;
    float edgeRipple = vFresnel * sin(uTime * 1.5 + position.y * 4.0) * 0.015;

    vec3 displaced = position + normal * (breathe + mouseWave + mousePush + edgeRipple);
    vNormal = normalize(normalMatrix * (normal + vec3(uMouse * 0.15, 0.0)));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`

// ─── Create the material ─────────────────────────────────────────────────────

export const GlassMaterialImpl = shaderMaterial(
  // Uniforms
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uDistortion: 1.0,
    uEnvMap: null,
    uIOR: 1.45,
    uColorA: new THREE.Color('#00ff88'),   // neon green
    uColorB: new THREE.Color('#00a3ff'),   // neon blue
    uOpacity: 0.85,
    uRoughness: 0.05,
  },
  glassVert,
  glassFrag
)

// Extend R3F JSX namespace
extend({ GlassMaterialImpl })

// drei shaderMaterial() is typed as ShaderMaterial ctor — extend JSX with explicit uniforms
export type GlassMaterialUniforms = THREE.ShaderMaterial & {
  uTime: number
  uMouse: THREE.Vector2
  uDistortion: number
  uEnvMap: THREE.CubeTexture | THREE.Texture | null
  uIOR: number
  uColorA: THREE.Color
  uColorB: THREE.Color
  uOpacity: number
  uRoughness: number
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      glassMaterialImpl: ReactThreeFiber.Node<GlassMaterialUniforms, typeof GlassMaterialImpl>
    }
  }
}
