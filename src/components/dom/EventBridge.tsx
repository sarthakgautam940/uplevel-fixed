'use client'
// EventBridge is no longer needed — mouse/scroll are read directly
// in Scene.tsx via useThree().mouse and window.scrollY.
// Keeping file to avoid import errors in layout.tsx.
export default function EventBridge() { return null }
