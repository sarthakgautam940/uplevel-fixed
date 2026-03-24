'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MeshTransmissionMaterial, Float } from '@react-three/drei'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────────────────────
// GLSL SIMPLEX NOISE — Gustavson / Ashima (MIT)
// Injected via onBeforeCompile. Placed BEFORE void main() in vertex shader.
// ─────────────────────────────────────────────────────────────────────────────
const NOISE_GLSL = /* glsl */`
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`

// ─────────────────────────────────────────────────────────────────────────────
// ORBITING NEON LIGHTS — 3 point lights that orbit the object.
// Their movement creates dynamic neon caustics inside the glass.
// ─────────────────────────────────────────────────────────────────────────────
function OrbitingLights() {
  const greenLight = useRef<THREE.PointLight>(null!)
  const blueLight  = useRef<THREE.PointLight>(null!)
  const whiteLight = useRef<THREE.PointLight>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Green — large orbit, primary neon hue
    greenLight.current.position.set(
      Math.cos(t * 0.7) * 4,
      Math.sin(t * 0.5) * 2,
      Math.sin(t * 0.7) * 4
    )
    // Blue — opposite phase, creates tension between the two neons
    blueLight.current.position.set(
      Math.cos(t * 0.5 + Math.PI) * 3.5,
      Math.cos(t * 0.4) * 1.5,
      Math.sin(t * 0.5 + Math.PI) * 3.5
    )
    // White — close orbit, catches glass edges for rim light
    whiteLight.current.position.set(
      Math.cos(t * 0.3 + 1) * 2.5,
      1,
      Math.sin(t * 0.3 + 1) * 2.5
    )
  })

  return (
    <>
      <pointLight ref={greenLight} color="#00FF88" intensity={15} distance={14} decay={2} />
      <pointLight ref={blueLight}  color="#00A3FF" intensity={10} distance={14} decay={2} />
      <pointLight ref={whiteLight} color="#ffffff" intensity={5}  distance={10} decay={2} />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO OBJECT
// ─────────────────────────────────────────────────────────────────────────────
export default function HeroObject() {
  const meshRef  = useRef<THREE.Mesh>(null!)
  const groupRef = useRef<THREE.Group>(null!)
  const { mouse } = useThree()

  // High-density sphere — detail=64 gives smooth GLSL displacement
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2, 64)
    return geo
  }, [])

  // ── Uniforms ref — never triggers re-render, updated in useFrame ──────────
  const uniforms = useRef({
    uTime:     { value: 0 },
    uMouse:    { value: new THREE.Vector2(0, 0) },
    uVelocity: { value: 0 },
  })

  const prevMouse    = useRef(new THREE.Vector2())
  const smoothVel    = useRef(0)
  const currentRotX  = useRef(0)
  const currentRotY  = useRef(0)

  // ── onBeforeCompile — stable reference so material never recompiles ───────
  // Injected into the vertex shader of MeshTransmissionMaterial.
  // Strategy:
  //   1. Add uniform declarations after #include <common>
  //   2. Add noise function before void main()
  //   3. Replace #include <begin_vertex> with our displacement code
  const onBeforeCompile = useMemo(
    () => (shader: THREE.WebGLProgramParametersWithUniforms) => {
      shader.uniforms.uTime     = uniforms.current.uTime
      shader.uniforms.uMouse    = uniforms.current.uMouse
      shader.uniforms.uVelocity = uniforms.current.uVelocity

      // Step 1 — uniform declarations
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `#include <common>
uniform float uTime;
uniform vec2  uMouse;
uniform float uVelocity;`
      )

      // Step 2 — noise functions before main
      shader.vertexShader = shader.vertexShader.replace(
        'void main() {',
        NOISE_GLSL + '\nvoid main() {'
      )

      // Step 3 — displacement after transformed = vec3(position)
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>

// ── Layer 1: Slow organic FBM breathing ───────────────────────────
float n1 = snoise(position * 1.4 + vec3(uTime * 0.18));
float n2 = snoise(position * 2.8 + vec3(uTime * 0.22, 0., uTime * 0.15));
float n3 = snoise(position * 6.0 + vec3(uTime * 0.30));
float breathe = n1 * 0.18 + n2 * 0.08 + n3 * 0.03;

// ── Layer 2: Velocity-driven ripple ───────────────────────────────
float rippleAmp  = 0.02 + uVelocity * 0.25;
float rippleFreq = 5.0  + uVelocity * 8.0;
float mDist = length(position.xy * 0.4 - uMouse * 3.0);
float ripple = sin(mDist * rippleFreq - uTime * 4.0) * rippleAmp * exp(-mDist * 0.8);

// ── Layer 3: Mouse push bulge ─────────────────────────────────────
vec3 mouseWorld = vec3(uMouse * 4.0, 2.0);
float bulgeD    = distance(position, mouseWorld);
float bulge     = smoothstep(3.5, 0.0, bulgeD) * 0.4 * clamp(uVelocity, 0.0, 1.0);

// Apply along normal for even displacement
transformed += normalize(position) * (breathe + ripple + bulge);
`
      )
    },
    [] // must never change identity
  )

  // ── Animation loop ────────────────────────────────────────────────────────
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Push uniform values (bound by reference — no recompile)
    uniforms.current.uTime.value  = t
    uniforms.current.uMouse.value.lerp(mouse, 0.08)

    // Velocity — delta mouse, decayed
    const dx = mouse.x - prevMouse.current.x
    const dy = mouse.y - prevMouse.current.y
    const vel = Math.sqrt(dx * dx + dy * dy)
    smoothVel.current = THREE.MathUtils.lerp(smoothVel.current, vel * 40, 0.1)
    smoothVel.current *= 0.92
    uniforms.current.uVelocity.value = smoothVel.current
    prevMouse.current.copy(mouse)

    if (!groupRef.current) return

    // Rotational inertia — lerp toward mouse-driven target
    const targetRotY = (mouse.x * Math.PI) / 5
    const targetRotX = (mouse.y * Math.PI) / 6
    currentRotY.current = THREE.MathUtils.lerp(currentRotY.current, targetRotY, 0.04)
    currentRotX.current = THREE.MathUtils.lerp(currentRotX.current, targetRotX, 0.04)

    // Idle drift when mouse is still
    const idle = smoothVel.current < 0.3 ? 1 : 0
    groupRef.current.rotation.y = currentRotY.current + t * 0.06 * idle
    groupRef.current.rotation.x = currentRotX.current
  })

  return (
    <group ref={groupRef}>
      <OrbitingLights />

      {/*
        Float — gentle levitation. Layers on top of the FBM breathing.
        Keep speed/intensity low so it complements, not fights, the noise.
      */}
      <Float speed={1.6} rotationIntensity={0.1} floatIntensity={0.5} floatingRange={[-0.07, 0.07]}>
        <mesh ref={meshRef} geometry={geometry}>
          {/*
            MeshTransmissionMaterial — Drei's purpose-built FBO glass.
            This is the ONLY material that produces true background refraction.
            It renders the scene behind the object into a framebuffer and samples
            it in the fragment shader — identical to how Alche's glass works.
          */}
          <MeshTransmissionMaterial
            onBeforeCompile={onBeforeCompile}
            // ── FBO refraction ──
            samples={16}
            resolution={1024}
            transmission={1}
            // ── Glass physics ──
            thickness={2.5}
            roughness={0.05}
            ior={1.5}
            // ── Chromatic dispersion (built-in to MeshTransmissionMaterial) ──
            chromaticAberration={0.06}
            anisotropy={0.5}
            // ── Brand color: glass tints internal light neon green ──
            attenuationColor="#00FF88"
            attenuationDistance={2.5}
            // ── Surface ──
            color="#030a06"
            backside={false}
            // ── Clearcoat for extra specular highlights ──
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={2}
          />
        </mesh>

        {/*
          Inner wireframe — visible through the glass, adds depth layers.
          MeshBasicMaterial so it's unlit — the emissive blue reads through
          the transmission and creates depth perception.
        */}
        <mesh scale={0.62}>
          <icosahedronGeometry args={[2, 4]} />
          <meshBasicMaterial
            color="#00A3FF"
            wireframe
            transparent
            opacity={0.12}
          />
        </mesh>

        {/*
          Emissive core — sits inside the glass.
          Emissive intensity 0.35 pushes past the bloom threshold (0.2),
          so the core glows through the glass shell visibly.
        */}
        <mesh scale={0.38}>
          <icosahedronGeometry args={[2, 2]} />
          <meshStandardMaterial
            color="#00FF88"
            emissive="#00FF88"
            emissiveIntensity={0.8}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      </Float>
    </group>
  )
}
