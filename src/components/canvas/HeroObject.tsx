'use client'

/**
 * HeroObject — crash-free, Awwwards-tier refractive glass.
 *
 * Architecture: MeshPhysicalMaterial + onBeforeCompile GLSL injection.
 *
 * WHY NOT shaderMaterial / extend():
 *   In Next.js 14 App Router, module-level code runs on the server.
 *   extend({ HeroGlassMaterialImpl }) calls THREE.extend before the client
 *   canvas exists → R3F can't find it in the namespace → crash.
 *   onBeforeCompile runs only on the GPU thread after the canvas exists.
 *   Zero namespace issues. Same custom GLSL capability. More stable.
 *
 * WHY MeshPhysicalMaterial:
 *   - transmission: 0.96 → real backbuffer refraction (Alche-level glass)
 *   - ior: 1.50 → physically correct glass IOR
 *   - attenuationColor: "#00FF88" → glass body tints internal light neon green
 *   - chromaticAberration handled by PostProcessing CA pass
 *   - PBR lighting + Environment HDRI → glass refracts actual scene colors
 *
 * GLSL strategy:
 *   We inject ONLY into the vertex shader's #include <begin_vertex>.
 *   Three.js keeps its entire fragment shader (transmission, PBR, env sampling).
 *   Result: displacement distortion + full PBR glass in one draw call.
 */

import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { useMouse, useScroll, useIntro } from '@/lib/store'

// ═══════════════════════════════════════════════════════════════════════════════
// GLSL — Simplex Noise (Gustavson, MIT License)
// Injected before void main() in the vertex shader.
// ═══════════════════════════════════════════════════════════════════════════════
const GLSL_SIMPLEX = /* glsl */`
vec3 _mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 _mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 _permute(vec4 x){return _mod289(((x*34.)+10.)*x);}
vec4 _taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-vec3(.5);
  i=_mod289(i);
  vec4 p=_permute(_permute(_permute(
    i.z+vec4(0.,i1.z,i2.z,1.))
   +i.y+vec4(0.,i1.y,i2.y,1.))
   +i.x+vec4(0.,i1.x,i2.x,1.));
  vec3 ns=1./7.*vec3(2.,-1./7.,-5./7.)-vec3(1./7.);
  vec4 j=p-49.*floor(p*(1./7.)*(1./7.));
  vec4 x_=floor(j*(1./7.));
  vec4 y_=floor(j-7.*x_);
  vec4 x=x_*(1./7.)+ns.yyyy;
  vec4 y=y_*(1./7.)+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;
  vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=_taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;
  return 105.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

float fbm(vec3 p){
  float v=0.,a=.5;
  for(int i=0;i<4;i++){v+=a*snoise(p);p=p*2.1+vec3(1.7,9.2,2.3);a*=.5;}
  return v;
}
`

// ═══════════════════════════════════════════════════════════════════════════════
// GLSL — Uniform declarations (top of vertex shader)
// ═══════════════════════════════════════════════════════════════════════════════
const GLSL_UNIFORMS = /* glsl */`
uniform float uTime;
uniform float uMouseVel;
uniform vec2  uMouseXY;
`

// ═══════════════════════════════════════════════════════════════════════════════
// GLSL — Displacement (replaces #include <begin_vertex>)
// THREE's begin_vertex = "vec3 transformed = vec3( position );"
// We keep that initialization then add our displacement along the normal.
// ═══════════════════════════════════════════════════════════════════════════════
const GLSL_DISPLACE = /* glsl */`
  // Three.js standard initialization (replaces the include)
  vec3 transformed = vec3(position);

  vec3 nDir = normalize(objectNormal);

  // ── Layer 1: FBM breathing — slow organic motion ──────────────────────
  float n1 = fbm(transformed * 1.1 + vec3(uTime * 0.18));
  float n2 = snoise(transformed * 3.2 + vec3(uTime * 0.22, 0., uTime * 0.15));
  float n3 = snoise(transformed * 7.0 + vec3(uTime * 0.30));
  float breathe = n1 * 0.045 + n2 * 0.018 + n3 * 0.007;

  // ── Layer 2: Mouse-velocity ripple ────────────────────────────────────
  float velMag      = length(uMouseXY);
  float rippleAmp   = 0.016 + uMouseVel * 0.060;
  float rippleFreq  = 7.0   + uMouseVel * 6.0;
  float mDist       = length(transformed.xy * 0.40 - uMouseXY * 0.38);
  float mouseRipple = sin(mDist * rippleFreq - uTime * 3.2) * rippleAmp * exp(-mDist * 1.8);
  float mousePush   = exp(-mDist * 3.2) * uMouseVel * 0.12;

  // ── Layer 3: High-frequency surface chatter (liquid feel) ─────────────
  float detail = snoise(transformed * 8.5 + vec3(uTime * 0.35)) * 0.005;

  float totalD = breathe + mouseRipple + mousePush + detail;
  transformed += nDir * totalD;
`

// ─── Shield geometry ──────────────────────────────────────────────────────────
function useShieldGeo() {
  return useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.5, 6)
    const pos = geo.attributes.position.array as Float32Array
    for (let i = 0; i < pos.length; i += 3) {
      pos[i + 2] *= 0.66
      pos[i]     *= 0.91 + Math.random() * 0.18
      pos[i + 1] *= 0.91 + Math.random() * 0.18
    }
    geo.attributes.position.needsUpdate = true
    geo.computeVertexNormals()
    return geo
  }, [])
}

// ─── Orbiting neon lights ─────────────────────────────────────────────────────
function OrbitingLights() {
  const l1 = useRef<THREE.PointLight>(null!)
  const l2 = useRef<THREE.PointLight>(null!)
  const l3 = useRef<THREE.PointLight>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    l1.current?.position.set(Math.cos(t * 0.62) * 3.2, Math.sin(t * 0.40) * 1.5, Math.sin(t * 0.62) * 3.2)
    l2.current?.position.set(Math.cos(t * 0.48 + 2.1) * 2.7, Math.cos(t * 0.52) * 1.2, Math.sin(t * 0.48 + 2.1) * 2.7)
    l3.current?.position.set(Math.cos(t * 0.35 + 4.2) * 1.8, 0.7, Math.sin(t * 0.35 + 4.2) * 1.8)
  })

  return (
    <>
      <pointLight ref={l1} color="#00FF88" intensity={12} distance={12} decay={2} />
      <pointLight ref={l2} color="#00A3FF" intensity={8}  distance={12} decay={2} />
      <pointLight ref={l3} color="#ffffff" intensity={4}  distance={8}  decay={2} />
    </>
  )
}

// ─── Neon vertex bloom dots ───────────────────────────────────────────────────
function GlowPoints() {
  const pts = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1.53, 1)
    const pa = g.attributes.position
    const out: [number, number, number][] = []
    const seen = new Set<string>()
    for (let i = 0; i < pa.count; i++) {
      const k = `${pa.getX(i).toFixed(2)},${pa.getY(i).toFixed(2)}`
      if (!seen.has(k)) {
        seen.add(k)
        out.push([pa.getX(i) * 0.66, pa.getY(i), pa.getZ(i) * 0.66])
      }
    }
    g.dispose()
    return out
  }, [])

  return (
    <>
      {pts.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.013, 4, 4]} />
          <meshBasicMaterial color={i % 2 === 0 ? '#00FF88' : '#00A3FF'} />
        </mesh>
      ))}
    </>
  )
}

// ─── Main HeroObject ──────────────────────────────────────────────────────────
export default function HeroObject() {
  const matRef   = useRef<THREE.MeshPhysicalMaterial>(null!)
  const groupRef = useRef<THREE.Group>(null!)
  const geo      = useShieldGeo()

  // Uniforms live in a ref — never cause re-renders, updated every frame
  const uniforms = useRef({
    uTime:     { value: 0 },
    uMouseVel: { value: 0 },
    uMouseXY:  { value: new THREE.Vector2(0, 0) },
  })

  const { x: mx, y: my, vel: mouseVel } = useMouse()
  const { y: scrollY }                  = useScroll()
  const { complete }                    = useIntro()

  const currentRotX = useRef(0)
  const currentRotY = useRef(0)
  const idleRotY    = useRef(0)

  // ── Stable onBeforeCompile callback (must NOT change identity across renders)
  const onBeforeCompile = useMemo(() => (shader: THREE.WebGLProgramParametersWithUniforms) => {
    // Bind our uniforms into Three.js's shader program
    shader.uniforms.uTime     = uniforms.current.uTime
    shader.uniforms.uMouseVel = uniforms.current.uMouseVel
    shader.uniforms.uMouseXY  = uniforms.current.uMouseXY

    // 1. Uniform declarations at the very top
    shader.vertexShader = GLSL_UNIFORMS + '\n' + shader.vertexShader

    // 2. Simplex noise functions injected before void main()
    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      GLSL_SIMPLEX + '\nvoid main() {'
    )

    // 3. Displacement replaces #include <begin_vertex>
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      GLSL_DISPLACE
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty deps — this must NEVER change identity or material recompiles every frame

  // ── Intro scale-in ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!groupRef.current) return
    if (!complete) {
      groupRef.current.scale.setScalar(0)
      return
    }
    gsap.timeline()
      .to(groupRef.current.scale, { x: 1.18, y: 1.18, z: 1.18, duration: 0.65, ease: 'back.out(2.2)' })
      .to(groupRef.current.scale, { x: 1,    y: 1,    z: 1,    duration: 0.5,  ease: 'power3.out'   })
  }, [complete])

  // ── Animation loop ────────────────────────────────────────────────────────
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Push fresh values into our bound uniforms each frame
    uniforms.current.uTime.value     = t
    uniforms.current.uMouseVel.value = Math.min(mouseVel * 10, 1.0)
    uniforms.current.uMouseXY.value.set(mx, my)

    if (!groupRef.current) return

    // Rotational inertia
    currentRotX.current += (my * 0.24  - currentRotX.current) * 0.038
    currentRotY.current += (mx * -0.30 - currentRotY.current) * 0.038
    if (mouseVel < 0.005) idleRotY.current += 0.0015

    groupRef.current.rotation.x = currentRotX.current
    groupRef.current.rotation.y = currentRotY.current + idleRotY.current

    // Scroll drift
    groupRef.current.position.y = -scrollY * 0.0028
  })

  return (
    <group ref={groupRef}>
      <OrbitingLights />

      <Float
        speed={1.4}
        rotationIntensity={0.12}
        floatIntensity={0.38}
        floatingRange={[-0.055, 0.055]}
      >
        {/* ── Outer glass shell ── */}
        <mesh geometry={geo}>
          <meshPhysicalMaterial
            ref={matRef}
            onBeforeCompile={onBeforeCompile}
            // Real glass transmission — uses backbuffer for refraction
            transmission={0.96}
            roughness={0.04}
            thickness={2.2}
            ior={1.50}
            // Brand color: green attenuation tints internal light
            attenuationColor="#00FF88"
            attenuationDistance={4.5}
            // Surface colour (near-black so glass body doesn't look plastic)
            color="#050e08"
            metalness={0}
            envMapIntensity={2.8}
            transparent
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* ── Inner emissive core — glows green, bloom catches at 0.38 threshold ── */}
        <mesh>
          <icosahedronGeometry args={[0.52, 3]} />
          <meshPhysicalMaterial
            color="#000e06"
            emissive="#00FF88"
            emissiveIntensity={0.24}
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={0.88}
          />
        </mesh>
      </Float>

      {/* Neon vertex glow dots — bloom halos these */}
      <GlowPoints />
    </group>
  )
}
