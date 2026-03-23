"use client";

import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Glitch } from '@react-three/postprocessing';
import { GlitchMode, BlendFunction } from 'postprocessing';
import { Suspense, useState, useEffect } from 'react';
import HeroObject from './HeroObject';

function SceneContent() {
  const [isGlitching, setIsGlitching] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsGlitching(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
      <color attach="background" args={['#05080f'] as any} />
      <fog attach="fog" args={['#05080f', 5, 20] as any} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#00ff88" />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#00a3ff" />

      <Suspense fallback={null}>
        <Environment files="/api/hdri/potsdamer_platz_1k.hdr" background={false} environmentIntensity={1} />
        <HeroObject />
      </Suspense>

      <EffectComposer enableNormalPass={false}>
        <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.002, 0.002] as any}
          radialModulation={false}
          modulationOffset={0}
        />
        <Glitch
          delay={[0.1, 0.5] as any}
          duration={[0.1, 0.3] as any}
          strength={[0.2, 0.4] as any}
          mode={GlitchMode.SPORADIC}
          active={isGlitching}
        />
      </EffectComposer>
    </>
  );
}

export default function Scene() {
  return (
    <div className="fixed inset-0 z-[-1] w-screen h-screen bg-[#05080f]">
      <Canvas dpr={[1, 2]}>
        <SceneContent />
      </Canvas>
    </div>
  );
}
