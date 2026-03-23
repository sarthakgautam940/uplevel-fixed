'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@/lib/store'

// CameraRig: mounts as a Three.js group, smoothly moves camera
// based on mouse + scroll state from the global store.

export default function CameraRig() {
  const { camera } = useThree()
  const { mouseX, mouseY, scrollY } = useStore()

  const targetPos  = useRef(new THREE.Vector3(0, 0, 5.5))
  const currentPos = useRef(new THREE.Vector3(0, 0, 5.5))

  useFrame(() => {
    // Camera drifts slightly with mouse — parallax feel
    targetPos.current.x = mouseX * 0.4
    targetPos.current.y = mouseY * 0.2 + 0.3 - scrollY * 0.0012
    targetPos.current.z = 5.5 - scrollY * 0.0015   // zoom in slightly on scroll

    // Lerp camera to target
    currentPos.current.lerp(targetPos.current, 0.025)
    camera.position.copy(currentPos.current)

    // Keep looking at the hero object (slightly above origin)
    camera.lookAt(0, 0.2 - scrollY * 0.0008, 0)
  })

  return null
}
