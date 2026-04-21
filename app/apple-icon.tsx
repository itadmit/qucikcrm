import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon() {
  const pacificoFont = await fetch(
    'https://fonts.gstatic.com/s/pacifico/v22/FwZY7-Qmy14u9lezJ96A4sijpFu_.ttf'
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #7c3aed 0%, #d946ef 100%)',
          borderRadius: 44,
        }}
      >
        <span
          style={{
            fontSize: 110,
            fontWeight: 400,
            color: 'white',
            fontFamily: 'Pacifico',
            marginTop: -8,
          }}
        >
          Q
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Pacifico',
          data: pacificoFont,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}
