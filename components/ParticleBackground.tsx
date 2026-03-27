'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const PARTICLE_COUNT = 50000;

const vertexShader = `
uniform float u_time;
uniform float u_scroll;
attribute vec3 a_grid;
varying float v_alpha;

vec3 hash33(vec3 p3){
  p3 = fract(p3 * vec3(.1031,.1030,.0973));
  p3 += dot(p3, p3.yxz+33.33);
  return fract((p3.xxy + p3.yxx)*p3.zyx);
}

void main() {
  vec3 base = position;
  float t = u_time * 0.12;

  vec3 n = hash33(base + t);
  vec3 swarm = base + vec3(
    sin(t * 5. + base.y * 4.) * 0.34,
    cos(t * 4. + base.x * 3.) * 0.29,
    sin(t * 3. + base.z * 4.) * 0.32
  ) + (n - 0.5) * 0.08;

  vec3 finalPos = mix(swarm, a_grid, smoothstep(0.0, 1.0, u_scroll));

  vec4 mv = modelViewMatrix * vec4(finalPos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = mix(1.6, 1.2, u_scroll) * (300.0 / -mv.z);
  v_alpha = smoothstep(2.8, 0.2, length(finalPos.xy));
}
`;

const fragmentShader = `
varying float v_alpha;
void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float circle = smoothstep(0.5, 0.0, d);
  vec3 color = mix(vec3(0.12, 0.17, 0.27), vec3(0.141, 0.380, 0.910), 0.35);
  gl_FragColor = vec4(color, circle * v_alpha * 0.85);
}
`;

function ParticleField({ scrollRef }: { scrollRef: MutableRefObject<number> }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const grid = new Float32Array(PARTICLE_COUNT * 3);

    const side = Math.ceil(Math.sqrt(PARTICLE_COUNT));

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 7.5;
      positions[i3 + 1] = (Math.random() - 0.5) * 4.5;
      positions[i3 + 2] = (Math.random() - 0.5) * 4.5;

      const gx = (i % side) / side - 0.5;
      const gy = Math.floor(i / side) / side - 0.5;
      grid[i3] = gx * 9;
      grid[i3 + 1] = gy * 4.8;
      grid[i3 + 2] = (Math.sin(i * 0.013) * 0.5 + 0.5) * 0.22;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('a_grid', new THREE.BufferAttribute(grid, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.u_time.value = clock.elapsedTime;
    matRef.current.uniforms.u_scroll.value = scrollRef.current;
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          u_time: { value: 0 },
          u_scroll: { value: 0 },
        }}
      />
    </points>
  );
}

export default function ParticleBackground() {
  const scrollRef = useRef(0);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollRef.current = self.progress;
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: false, alpha: true }}>
        <ParticleField scrollRef={scrollRef} />
      </Canvas>
    </div>
  );
}
