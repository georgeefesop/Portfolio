import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'

interface DeclinedRow {
  bank?: string
  verdict?: string
  isWinner?: boolean
}

interface StatItem {
  value?: string
  label?: string
}

interface KfReceiptTestimonialProps {
  introText?: string
  declinedRows?: DeclinedRow[]
  outroText?: string
  clientPhoto?: { asset?: { _ref: string } }
  clientPhotoAlt?: string
  stats?: StatItem[]
  clientAttribution?: string
}

export default function KfReceiptTestimonial({
  introText,
  declinedRows = [],
  outroText,
  clientPhoto,
  clientPhotoAlt,
  stats = [],
  clientAttribution,
}: KfReceiptTestimonialProps) {
  return (
    <section style={{ background: '#122926', padding: 'clamp(64px, 8vw, 96px) 32px' }}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'center',
        }}
      >
        <div>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#7aada6',
              margin: '0 0 20px',
            }}
          >
            A RECEIPT
          </p>
          {introText && (
            <p
              style={{
                fontFamily: 'Fraunces, serif',
                fontVariationSettings: "'opsz' 144, 'SOFT' 50",
                fontSize: 22,
                lineHeight: 1.35,
                color: '#efe9dd',
                margin: '0 0 32px',
                letterSpacing: '-0.01em',
              }}
            >
              {introText}
            </p>
          )}

          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 12,
              overflow: 'hidden',
              marginBottom: 28,
            }}
          >
            {declinedRows.map((row, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 20px',
                  borderBottom: i < declinedRows.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  background: row.isWinner ? 'rgba(232, 141, 110, 0.12)' : 'transparent',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 15,
                    color: row.isWinner ? '#e88d6e' : '#a8c5c0',
                    fontWeight: row.isWinner ? 600 : 400,
                  }}
                >
                  {row.bank}
                </span>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 15,
                    color: row.isWinner ? '#e88d6e' : '#6e8e8a',
                    fontWeight: row.isWinner ? 600 : 400,
                  }}
                >
                  {row.verdict}
                </span>
              </div>
            ))}
          </div>

          {outroText && (
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                lineHeight: 1.7,
                color: '#7aada6',
                margin: 0,
              }}
            >
              {outroText}
            </p>
          )}
        </div>

        <div>
          {clientPhoto?.asset ? (
            <div style={{ position: 'relative', aspectRatio: '3/4', borderRadius: 16, overflow: 'hidden', marginBottom: 28 }}>
              <Image
                src={urlFor(clientPhoto).width(480).url()}
                alt={clientPhotoAlt || ''}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          ) : (
            <div
              style={{
                aspectRatio: '3/4',
                background: '#1d3f3a',
                borderRadius: 16,
                marginBottom: 28,
              }}
            />
          )}

          {stats.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
                marginBottom: 16,
              }}
            >
              {stats.map((stat, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 10,
                    padding: '16px 18px',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'Fraunces, serif',
                      fontVariationSettings: "'opsz' 144, 'SOFT' 50",
                      fontSize: 22,
                      fontWeight: 400,
                      color: '#e88d6e',
                      margin: '0 0 4px',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {stat.value}
                  </p>
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 12,
                      color: '#7aada6',
                      margin: 0,
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {clientAttribution && (
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 13,
                color: '#7aada6',
                margin: 0,
              }}
            >
              {clientAttribution}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
