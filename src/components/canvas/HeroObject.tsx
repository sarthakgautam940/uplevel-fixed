'use client'

/**
 * HeroObject — Alche-tier refractive glass. Phase 1.
 *
 * Massive interactive icosahedron with:
 *   • MeshPhysicalMaterial: transmission=1, ior=1.5, thickness=2, roughness=0.05
 *   • Brand colors #00FF88 / #00A3FF in attenuation + point lights
 *   • onBeforeCompile: 3D Simplex noise + uTime → liquid morph
 *   • Mouse velocity → ripple amplitude (violent on fast move)
 *
 * Geometry: icosahedron radius 2, detail 6 (~80k tris).
 * Note: detail 64 would exceed 10^38 vertices — use 6 for high fidelity + perf.
 */

import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { eventRefs } from '@/lib/eventRefs'
import { useIntro } from '@/lib/store'

// ═══════════════════════════════════════════════════════════════════════════════
// GLSL — 3D Simplex Noise (Gustavson)
// Injected before void main() for vertex displacement.
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

const GLSL_UNIFORMS = /* glsl */`
uniform float uTime;
uniform float uMouseVel;
uniform vec2  uMouseXY;
`

// ─── Vertex displacement: FBM breathing + mouse-velocity ripples ─────────────
// uMouseVel drives amplitude: 0 at rest, violent when mouse moves fast.
const GLSL_DISPLACE = /* glsl */`
  vec3 transformed = vec3(position);
  vec3 nDir = normalize(objectNormal);

  // Layer 1: FBM breathing — slow liquid morph (Simplex mapped to uTime)
  float n1 = fbm(transformed * 1.2 + vec3(uTime * 0.15));
  float n2 = snoise(transformed * 2.8 + vec3(uTime * 0.22, 0., uTime * 0.18));
  float n3 = snoise(transformed * 5.0 + vec3(uTime * 0.28));
  float breathe = n1 * 0.055 + n2 * 0.022 + n3 * 0.008;

  // Layer 2: Mouse-velocity ripple — AMPLITUDE = f(uMouseVel), violent on fast move
  float rippleAmp   = 0.018 + uMouseVel * 0.095;   // 0.095 → strong response
  float rippleFreq  = 6.0   + uMouseVel * 8.0;     // freq scales with velocity
  float mDist       = length(transformed.xy * 0.35 - uMouseXY * 0.4);
  float mouseRipple = sin(mDist * rippleFreq - uTime * 3.5) * rippleAmp * exp(-mDist * 1.6);
  float mousePush   = exp(-mDist * 2.8) * uMouseVel * 0.18;   // violent push

  // Layer 3: High-freq surface chatter (liquid glass feel)
  float detail = snoise(transformed * 9.0 + vec3(uTime * 0.4)) * 0.006;

  float totalD = breathe + mouseRipple + mousePush + detail;
  transformed += nDir * totalD;
`

// ─── Orbiting lights: brand colors #00FF88, #00A3FF ──────────────────────────
function OrbitingLights() {
  const l1 = useRef<THREE.PointLight>(null!)
  const l2 = useRef<THREE.PointLight>(null!)
  const l3 = useRef<THREE.PointLight>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    l1.current?.position.set(Math.cos(t * 0.6) * 4.0, Math.sin(t * 0.35) * 2.0, Math.sin(t * 0.6) * 4.0)
    l2.current?.position.set(Math.cos(t * 0.45 + 2.1) * 3.5, Math.cos(t * 0.5) * 1.5, Math.sin(t * 0.45 + 2.1) * 3.5)
    l3.current?.position.set(Math.cos(t * 0.38 + 4.2) * 2.5, 1.2, Math.sin(t * 0.38 + 4.2) * 2.5)
  })

  return (
    <>
      <pointLight ref={l1} color="#00FF88" intensity={14} distance={14} decay={2} />
      <pointLight ref={l2} color="#00A3FF" intensity={10} distance={14} decay={2} />
      <pointLight ref={l3} color="#ffffff" intensity={5} distance={10} decay={2} />
    </>
  )
}

// ─── Main HeroObject ──────────────────────────────────────────────────────────
export default function HeroObject() {
  const matRef   = useRef<THREE.MeshPhysicalMaterial>(null!)
  const groupRef = useRef<THREE.Group>(null!)

  const uniforms = useRef({
    uTime:     { value: 0 },
    uMouseVel: { value: 0 },
    uMouseXY:  { value: new THREE.Vector2(0, 0) },
  })

  const { complete } = useIntro()

  const currentRotX = useRef(0)
  const currentRotY = useRef(0)
  const idleRotY    = useRef(0)

  const onBeforeCompile = useMemo(() => (shader: THREE.WebGLProgramParametersWithUniforms) => {
    shader.uniforms.uTime     = uniforms.current.uTime
    shader.uniforms.uMouseVel = uniforms.current.uMouseVel
    shader.uniforms.uMouseXY  = uniforms.current.uMouseXY

    shader.vertexShader = GLSL_UNIFORMS + '\n' + shader.vertexShader
    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      GLSL_SIMPLEX + '\nvoid main() {'
    )
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      GLSL_DISPLACE
    )
  }, [])

  useEffect(() => {
    if (!groupRef.current) return
    if (!complete) {
      groupRef.current.scale.setScalar(0)
      return
    }
    gsap.timeline()
      .to(groupRef.current.scale, { x: 1.15, y: 1.15, z: 1.15, duration: 0.7, ease: 'back.out(2.2)' })
      .to(groupRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: 'power3.out' })
  }, [complete])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mx = eventRefs.mouseX
    const my = eventRefs.mouseY
    const mouseVel = eventRefs.mouseVel
    const scrollY = eventRefs.scrollY

    uniforms.current.uTime.value     = t
    uniforms.current.uMouseVel.value = Math.min(mouseVel * 12, 1.2)  // 12x scale for violent response
    uniforms.current.uMouseXY.value.set(mx, my)

    if (!groupRef.current) return

    currentRotX.current += (my * 0.22 - currentRotX.current) * 0.04
    currentRotY.current += (mx * -0.28 - currentRotY.current) * 0.04
    if (mouseVel < 0.004) idleRotY.current += 0.0012

    groupRef.current.rotation.x = currentRotX.current
    groupRef.current.rotation.y = currentRotY.current + idleRotY.current
    groupRef.current.position.y = -scrollY * 0.0025
  })

  return (
    <group ref={groupRef}>
      <OrbitingLights />

      <Float
        speed={1.2}
        rotationIntensity={0.1}
        floatIntensity={0.35}
        floatingRange={[-0.06, 0.06]}
      >
        <mesh>
          <icosahedronGeometry args={[2, 6]} />
          <meshPhysicalMaterial
            ref={matRef}
            onBeforeCompile={onBeforeCompile}
            transmission={1}
            ior={1.5}
            thickness={2.0}
            roughness={0.05}
            attenuationColor="#00FF88"
            attenuationDistance={5.0}
            color="#050c08"
            metalness={0}
            envMapIntensity={2.6}
            transparent
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </Float>
    </group>
  )
}
