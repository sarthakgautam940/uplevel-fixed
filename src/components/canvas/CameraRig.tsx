'use client'

/**
 * CameraRig — lives inside <Canvas>. Imperatively controls the camera each
 * frame based on mouse and scroll state from the store.
 *
 * Motion design:
 *  • Mouse: subtle parallax drift (±0.35 X, ±0.20 Y). Low lerp factor (0.025)
 *    for smooth lag that reads as physical weight, not jitter.
 *  • Scroll: camera zooms slightly toward origin (Z decreases), and pans down
 *    on Y. This creates the "hero object flies past" feel in the carousel
 *    section without moving the 3D object itself.
 *  • lookAt target is also scroll-driven so the camera tilts to follow.
 *
 * Architecture note: We use refs for the lerped position to avoid useState
 * re-renders. All updates are pure R3F useFrame imperative mutations.
 */

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useMouse, useScroll } from '@/lib/store'

// Starting camera position
const CAM_ORIGIN = new THREE.Vector3(0, 0.3, 5.8)
const LOOK_TARGET = new THREE.Vector3()

export default function CameraRig() {
  const { camera } = useThree()
  const currentPos = useRef(CAM_ORIGIN.clone())
  const { x: mx, y: my } = useMouse()
  const { y: scrollY }   = useScroll()

  useFrame(() => {
    // Compute target camera position
    const targetX = mx * 0.35
    const targetY = my * 0.20 + 0.3 - scrollY * 0.0010
    const targetZ = 5.8 - scrollY * 0.0013

    // Lerp current position toward target (smooth lag)
    currentPos.current.x += (targetX - currentPos.current.x) * 0.025
    currentPos.current.y += (targetY - currentPos.current.y) * 0.025
    currentPos.current.z += (targetZ - currentPos.current.z) * 0.025

    camera.position.copy(currentPos.current)

    // Compute look target (slightly scroll-driven vertical tilt)
    LOOK_TARGET.set(0, 0.2 - scrollY * 0.0007, 0)
    camera.lookAt(LOOK_TARGET)
  })

  return null
}
