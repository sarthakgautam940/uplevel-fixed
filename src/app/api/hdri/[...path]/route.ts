/**
 * Proxy for HDRI assets — avoids CORS when loading Environment maps.
 * Client requests /api/hdri/potsdamer_platz_1k.hdr, we fetch from pmndrs CDN.
 */
import { NextRequest, NextResponse } from 'next/server'

const HDRI_BASE = 'https://raw.githack.com/pmndrs/drei-assets/456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/'

const ALLOWED = ['potsdamer_platz_1k.hdr', 'lebombo_1k.hdr', 'studio_small_03_1k.hdr', 'venice_sunset_1k.hdr']

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const file = path?.join('/') || ''
  if (!ALLOWED.includes(file)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const res = await fetch(HDRI_BASE + file, { cache: 'force-cache' })
  if (!res.ok) {
    return NextResponse.json({ error: 'Upstream fetch failed' }, { status: 502 })
  }
  const blob = await res.arrayBuffer()
  return new NextResponse(blob, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
