'use client'

import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

/**
 * SceneErrorBoundary — catches WebGL context loss and Three.js runtime errors
 * without crashing the entire page. Renders nothing (canvas disappears silently)
 * so the DOM overlay remains functional even if 3D fails.
 *
 * Common triggers:
 *  • GPU driver crash
 *  • Mobile browser backgrounded for >30s
 *  • Hardware acceleration disabled in browser settings
 *  • Memory exhaustion on low-end devices
 */
export default class SceneErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('[SmartPlay] WebGL error:', error)
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error('[SmartPlay] Scene crashed:', error.message)
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}
