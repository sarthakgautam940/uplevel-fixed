'use client'

/**
 * HeroGlassMaterial — the centrepiece shader of the entire site.
 *
 * Architecture:
 *  Uses drei's shaderMaterial() helper to create a THREE.ShaderMaterial subclass
 *  and automatically extend the R3F JSX namespace, so we can write:
 *    <heroGlassMaterialImpl ref={matRef} uTime={t} ... />
 *
 * VERTEX SHADER — three layers of displacement:
 *  1. 3D Simplex Noise (layered octaves) → organic breathing motion
 *  2. Mouse-velocity wave → ripples propagate from mouse direction
 *  3. Edge ripple (Fresnel-approximated) → rim oscillates independently
 *
 * FRAGMENT SHADER — physically-motivated glass:
 *  1. Fresnel term (Schlick approximation) → edge vs. centre transparency
 *  2. Chromatic dispersion → separate refract() per RGB channel with ±IOR offset
 *  3. Internal neon scattering → light bounces through glass picking up brand colors
 *  4. Thin-film iridescence → soap-bubble prismatic shimmer
 *  5. Rim emission → Fresnel-weighted neon edge glow (bloom picks this up)
 *
 * Why not MeshPhysicalMaterial?
 *  transmission:true requires a second render pass for the backbuffer sample.
 *  On mid-range GPUs this halves frame rate. A custom shader achieves equivalent
 *  visual quality in a single pass by sampling the environment cubemap directly
 *  for refraction, which is how real-time glass is done in games/film tools.
 */

import { shaderMaterial } from '@react-three/drei'
import { extend, type ReactThreeFiber } from '@react-three/fiber'
import * as THREE from 'three'

// ─── GLSL: Vertex Shader ──────────────────────────────────────────────────────
const VERT = /* glsl */`
  // ── Uniforms ──────────────────────────────────────────────────────────────
  uniform float uTime;
  uniform vec2  uMouse;       // normalized -1..1
  uniform float uMouseVel;    // magnitude of mouse velocity (0..1)
  uniform float uDistortion;  // global multiplier, animated in useFrame

  // ── Varyings ──────────────────────────────────────────────────────────────
  varying vec3  vNormal;
  varying vec3  vWorldPos;
  varying vec3  vViewDir;
  varying vec2  vUv;
  varying float vFresnel;
  varying float vDisplace;   // used in frag for extra scatter modulation

  // ══════════════════════════════════════════════════════════════════════════
  // 3D Simplex Noise
  // Reference: Ashima Arts / Stefan Gustavson (MIT License)
  // ══════════════════════════════════════════════════════════════════════════

  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+10.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314*r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g  = step(x0.yzx, x0.xyz);
    vec3 l  = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(
      permute(permute(i.z + vec4(0.,i1.z,i2.z,1.))
                    + i.y + vec4(0.,i1.y,i2.y,1.))
                    + i.x + vec4(0.,i1.x,i2.x,1.));

    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4  j  = p - 49.0*floor(p*ns.z*ns.z);
    vec4  x_ = floor(j * ns.z);
    vec4  y_ = floor(j - 7.0*x_);
    vec4  x  = x_*ns.x + ns.yyyy;
    vec4  y  = y_*ns.x + ns.yyyy;
    vec4  h  = 1.0 - abs(x) - abs(y);
    vec4  b0 = vec4(x.xy, y.xy);
    vec4  b1 = vec4(x.zw, y.zw);
    vec4  s0 = floor(b0)*2.0 + 1.0;
    vec4  s1 = floor(b1)*2.0 + 1.0;
    vec4  sh = -step(h, vec4(0.0));
    vec4  a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4  a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3  p0 = vec3(a0.xy, h.x);
    vec3  p1 = vec3(a0.zw, h.y);
    vec3  p2 = vec3(a1.xy, h.z);
    vec3  p3 = vec3(a1.zw, h.w);
    vec4  norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

    vec4 m = max(0.5 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
    m = m * m;
    return 105.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  // Layered FBM (fractal brownian motion) — 4 octaves for organic detail
  float fbm(vec3 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * snoise(p);
      p  = p * 2.1 + vec3(1.7, 9.2, 2.3);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vUv = uv;

    // ── World-space position + view direction ──────────────────────────────
    vec4 worldPos4 = modelMatrix * vec4(position, 1.0);
    vWorldPos      = worldPos4.xyz;
    vec3 camWorldPos = (inverse(viewMatrix) * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    vViewDir       = normalize(camWorldPos - vWorldPos);

    // ── Normal in world space (for Fresnel + refraction dir) ──────────────
    vNormal = normalize(mat3(transpose(inverse(modelMatrix))) * normal);

    // ── Fresnel (Schlick approximation) ───────────────────────────────────
    // Measures how much we're looking at the edge vs. the centre of the object.
    // Edge → fresnel → 1. Centre → fresnel → 0.
    float cosTheta = max(0.0, dot(vNormal, vViewDir));
    vFresnel = pow(1.0 - cosTheta, 3.2);

    // ══════════════════════════════════════════════════════════════════════
    // DISPLACEMENT — applied along the surface normal
    // ══════════════════════════════════════════════════════════════════════

    vec3 N = normalize(normal);

    // Layer 1: Slow organic FBM breathing
    float n1 = fbm(position * 1.10 + vec3(uTime * 0.18));
    float n2 = fbm(position * 2.80 + vec3(uTime * 0.11, uTime * 0.14, 0.0));
    float n3 = snoise(position * 6.5 + vec3(uTime * 0.22));
    float breathe = n1 * 0.048 + n2 * 0.020 + n3 * 0.008;

    // Layer 2: Mouse-velocity driven ripple
    // The ripple radiates out from the mouse position on the surface.
    // Higher mouseVel = higher amplitude, faster propagation.
    vec2  mPos     = uMouse * 0.5;
    float mDist    = length(position.xy * 0.45 - mPos);
    float rippleAmp = 0.022 + uMouseVel * 0.048;    // velocity → amplitude
    float rippleFreq = 7.5 + uMouseVel * 4.0;        // velocity → frequency
    float mouseRipple = sin(mDist * rippleFreq - uTime * 2.8) * rippleAmp * exp(-mDist * 2.2);
    float mousePush   = exp(-mDist * 2.8) * uMouseVel * 0.12;  // push under cursor

    // Layer 3: Fresnel-edge oscillation — rim pulses independently
    float edgeRipple = vFresnel * sin(uTime * 1.6 + position.y * 5.2 + position.x * 2.8) * 0.018;

    float totalDisplace = (breathe + mouseRipple + mousePush + edgeRipple) * uDistortion;
    vDisplace = totalDisplace;

    // Slightly bend the normal toward mouse for extra light play in frag
    vNormal = normalize(vNormal + vec3(uMouse * 0.14, 0.0));

    vec3 displaced = position + N * totalDisplace;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`

// ─── GLSL: Fragment Shader ────────────────────────────────────────────────────
const FRAG = /* glsl */`
  // ── Uniforms ──────────────────────────────────────────────────────────────
  uniform float       uTime;
  uniform vec2        uMouse;
  uniform float       uMouseVel;
  uniform samplerCube uEnvMap;    // from CubeCamera (live scene reflections)
  uniform float       uIOR;       // index of refraction ~1.45
  uniform vec3        uColorA;    // neon green #00FF88
  uniform vec3        uColorB;    // neon blue  #00A3FF
  uniform float       uOpacity;
  uniform float       uRoughness;

  // ── Varyings ──────────────────────────────────────────────────────────────
  varying vec3  vNormal;
  varying vec3  vWorldPos;
  varying vec3  vViewDir;
  varying vec2  vUv;
  varying float vFresnel;
  varying float vDisplace;

  // ══════════════════════════════════════════════════════════════════════════
  // Chromatic Dispersion — glass bends different wavelengths differently
  // We sample the env cubemap 3× with slightly different IOR per channel.
  // This is what makes glass look prismatic / rainbow-edged.
  // ══════════════════════════════════════════════════════════════════════════
  vec3 refractRGB(vec3 V, vec3 N, float ior) {
    // ior varies ±0.03 between R and B channels (dispersion coefficient)
    float iorR = ior - 0.028;
    float iorG = ior;
    float iorB = ior + 0.028;

    vec3 refR = refract(-V, N, 1.0 / iorR);
    vec3 refG = refract(-V, N, 1.0 / iorG);
    vec3 refB = refract(-V, N, 1.0 / iorB);

    // Mip level from roughness — blurrier sample = frosted glass effect
    float mip = uRoughness * 6.0;
    float r = textureCubeLodEXT(uEnvMap, refR, mip).r;
    float g = textureCubeLodEXT(uEnvMap, refG, mip).g;
    float b = textureCubeLodEXT(uEnvMap, refB, mip).b;

    return vec3(r, g, b);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // Neon Internal Scattering
  // Models subsurface-like light bouncing through the glass body.
  // Uses prism-scatter angle (atan of normal components) to vary which
  // brand color dominates at each surface point.
  // ══════════════════════════════════════════════════════════════════════════
  vec3 neonScatter(vec3 N, vec3 colorA, vec3 colorB) {
    // Scatter band A — green dominant, oscillates with time
    float scatter1 = abs(sin(atan(N.y, N.x) * 6.0 + uTime * 0.55)) * 0.5 + 0.5;
    // Scatter band B — phase-shifted blue
    float scatter2 = abs(sin(atan(N.z, N.x) * 5.0 + uTime * 0.42 + 2.1)) * 0.5 + 0.5;

    vec3 baseScatter = mix(colorA, colorB, scatter1) * (scatter1 * 0.6 + scatter2 * 0.4);

    // Amplify when mouse is moving (glass "wakes up" on interaction)
    baseScatter *= 1.0 + uMouseVel * 1.2;

    return baseScatter;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // Thin-Film Iridescence
  // Simulates the soap-bubble / oil-slick effect seen in high-end glass.
  // Phase offset varies with view angle — different colors at different angles.
  // ══════════════════════════════════════════════════════════════════════════
  vec3 thinFilm(vec3 N, vec3 V, vec3 colorA, vec3 colorB) {
    float ndv   = max(0.0, dot(N, V));
    float phase = sin(ndv * 14.0 + uTime * 0.9);    // view-angle shift + time
    return mix(colorA, colorB, phase * 0.5 + 0.5) * (phase * 0.5 + 0.5) * 0.32;
  }

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDir);
    vec3 R = reflect(-V, N);    // reflection direction

    // ── Reflection from environment ────────────────────────────────────────
    float mip = uRoughness * 6.0;
    vec3 reflection = textureCubeLodEXT(uEnvMap, R, mip).rgb;

    // ── Refraction (chromatic dispersion) ─────────────────────────────────
    vec3 refraction = refractRGB(V, N, uIOR);

    // ── Colour gradient driven by UV + normal ─────────────────────────────
    // Blends green→blue across the surface; time-animated for life.
    float grad = clamp(
      (vUv.y + N.y * 0.45 + 0.5) * 0.5 + sin(uTime * 0.35) * 0.08,
      0.0, 1.0
    );
    vec3 neonColor = mix(uColorA, uColorB, grad);

    // ── Internal neon scatter ──────────────────────────────────────────────
    vec3 scatter = neonScatter(N, uColorA, uColorB) * 0.38 * vFresnel;

    // ── Thin-film iridescence ──────────────────────────────────────────────
    vec3 film = thinFilm(N, V, uColorA, uColorB) * vFresnel;

    // ── Displacement-driven extra scatter modulation ───────────────────────
    // Where the surface is most displaced (ripple peaks), scatter is brighter.
    scatter *= 1.0 + abs(vDisplace) * 8.0;

    // ── Composite ─────────────────────────────────────────────────────────
    // Mix reflection and refraction by Fresnel:
    //   centre (fresnel≈0) → mostly refraction (see through glass)
    //   edges  (fresnel≈1) → mostly reflection (mirror-like rim)
    vec3 base = mix(refraction, reflection, vFresnel * 0.72);

    // Add neon tint so glass isn't purely colourless
    base = mix(base, neonColor * 0.18, 0.12);

    // Overlay scatter and film
    vec3 finalColor  = base + scatter * 0.42 + film;

    // ── Rim emission — critical for bloom ─────────────────────────────────
    // Fresnel edges emit neon light. Bloom pass catches the overexposed rims
    // and halates them, making the glass glow without a fake additive hack.
    finalColor += neonColor * pow(vFresnel, 1.6) * 0.65;

    // ── Opacity ────────────────────────────────────────────────────────────
    // Centre is near-transparent; edges are more opaque.
    // This is physically correct — glass edges have longer light path.
    float alpha = mix(uOpacity * 0.28, uOpacity * 0.88, vFresnel);

    gl_FragColor = vec4(finalColor, alpha);
  }
`

// ─── shaderMaterial factory ───────────────────────────────────────────────────
export const HeroGlassMaterialImpl = shaderMaterial(
  // Default uniforms — values set/updated in HeroObject useFrame
  {
    uTime:      0,
    uMouse:     new THREE.Vector2(0, 0),
    uMouseVel:  0,
    uEnvMap:    null as THREE.CubeTexture | null,
    uIOR:       1.48,
    uColorA:    new THREE.Color('#00FF88'),   // neon green
    uColorB:    new THREE.Color('#00A3FF'),   // neon blue
    uOpacity:   0.88,
    uRoughness: 0.04,
    uDistortion: 1.0,
  },
  VERT,
  FRAG,
)

// ─── Extend R3F JSX namespace ─────────────────────────────────────────────────
extend({ HeroGlassMaterialImpl })

// ─── Types ────────────────────────────────────────────────────────────────────
export type HeroGlassMaterialType = THREE.ShaderMaterial & {
  uTime:       number
  uMouse:      THREE.Vector2
  uMouseVel:   number
  uEnvMap:     THREE.CubeTexture | THREE.Texture | null
  uIOR:        number
  uColorA:     THREE.Color
  uColorB:     THREE.Color
  uOpacity:    number
  uRoughness:  number
  uDistortion: number
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      heroGlassMaterialImpl: ReactThreeFiber.Node<
        HeroGlassMaterialType,
        typeof HeroGlassMaterialImpl
      >
    }
  }
}
