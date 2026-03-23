'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div
      className="min-h-[50vh] flex flex-col items-center justify-center gap-6 px-8"
      style={{ background: '#04090f', color: '#e0e8f0' }}
    >
      <p className="font-mono text-sm text-center max-w-md" style={{ color: '#6a7e8e' }}>
        Something went wrong loading this page. You can retry — the 3D layer may stay disabled if your
        browser blocks WebGL.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="px-8 py-3 rounded-full font-bold text-sm"
        style={{ background: '#00E676', color: '#060B14' }}
      >
        Try again
      </button>
    </div>
  )
}
