'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }

type State = { hasError: boolean }

/**
 * Prevents a WebGL / drei / postprocessing failure from taking down the whole app on Vercel.
 */
export default class SceneErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[SceneErrorBoundary]', error, info.componentStack)
    } else {
      console.error('[SceneErrorBoundary]', error.message)
    }
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}
