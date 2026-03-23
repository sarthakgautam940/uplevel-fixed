import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #00FF88 0%, #00A3FF 100%)',
          borderRadius: 4,
        }}
      />
    ),
    { width: 32, height: 32 }
  )
}
