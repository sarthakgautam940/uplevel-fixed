'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D u_texture;
uniform float u_progress;
uniform float u_time;
varying vec2 vUv;

mat2 rot(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 uv = vUv;
  float slashY = 1.0 - uv.x + (u_progress * 0.8) - 0.25;
  float split = smoothstep(slashY - 0.012, slashY + 0.012, uv.y);

  vec2 shiftedUv = uv;
  if (u_progress > 0.1 && split > 0.5) {
    vec2 center = vec2(0.5, 0.62);
    vec2 dir = uv - center;
    float chaos = (u_progress - 0.1) * 0.22;
    vec2 offset = vec2(-chaos * 0.7, chaos * 0.95);
    shiftedUv = (rot(-chaos * 1.8) * dir) + center + offset;
    shiftedUv += vec2(sin(u_time * 3.5 + uv.x * 13.0) * 0.003, 0.0);
  }

  vec4 tex = texture2D(u_texture, shiftedUv);

  float dist = abs(uv.y - slashY);
  float slashCore = smoothstep(0.022, 0.0, dist);
  float slashGlow = smoothstep(0.12, 0.0, dist);
  vec3 electric = vec3(0.141, 0.380, 0.910);

  vec3 color = tex.rgb;
  color += electric * slashGlow * 0.75 * smoothstep(0.08, 0.98, u_progress);
  color = mix(color, electric, slashCore * 0.9);

  float alpha = max(tex.a, slashGlow * 0.25);
  gl_FragColor = vec4(color, alpha);
}
`;

function createTextTexture(text: string) {
  const canvas = document.createElement('canvas');
  const size = 2048;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = '#EDF0F7';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 148px "Playfair Display", serif';

  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';

  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > size * 0.78) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  });
  lines.push(line);

  const lineHeight = 178;
  const startY = size / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => {
    ctx.fillText(l, size / 2, startY + i * lineHeight);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

function SlashPlane({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const texture = useMemo(() => createTextTexture("Your site doesn't match the quality of your work."), []);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.u_time.value = clock.getElapsedTime();
    materialRef.current.uniforms.u_progress.value = progressRef.current;
  });

  return (
    <mesh>
      <planeGeometry args={[4.8, 2.2, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          u_texture: { value: texture },
          u_progress: { value: 0 },
          u_time: { value: 0 },
        }}
      />
    </mesh>
  );
}

export default function WebGLTextSlash() {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: rootRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 z-20">
      <Canvas dpr={[1, 1.8]} camera={{ position: [0, 0, 2.5], fov: 32 }} gl={{ alpha: true, antialias: true }}>
        <SlashPlane progressRef={progressRef} />
      </Canvas>
    </div>
  );
}
