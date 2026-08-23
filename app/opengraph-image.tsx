import { ImageResponse } from 'next/og';

export const alt = 'Aimorpher — resume to professional website';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '68px',
          color: '#0a0d12',
          background: '#f7f8fb',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24 }}>
          <strong>aimorpher.com</strong>
          <span style={{ color: '#315efb' }}>profile.build / ready</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: '-4px' }}>
            Turn your resume into
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: '-4px',
              color: '#315efb',
            }}
          >
            a professional website.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 34, fontSize: 22, color: '#596170' }}>
          <span>PDF resume import</span>
          <span>Private draft first</span>
          <span>Built for technical hiring</span>
        </div>
      </div>
    ),
    size,
  );
}
