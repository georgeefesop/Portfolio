import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import { renderRich } from '@/lib/kingfisher/text'

interface LenderLogo {
  name: string
  logo?: { asset?: { _ref: string } }
}

interface KfHeroProps {
  eyebrow?: string
  headlineLine1?: string
  headlineLine2?: string
  lede?: string
  ctaPrimary?: string
  ctaSubtext?: string
  heroImage?: { asset?: { _ref: string } }
  heroImageAlt?: string
  rateBadgeLabel?: string
  rateBadgeValue?: string
  rateBadgeTag?: string
  lenderLogos?: LenderLogo[]
  lenderCountSuffix?: string
}

export default function KfHero(props: KfHeroProps) {
  const {
    eyebrow,
    headlineLine1,
    headlineLine2,
    lede,
    ctaPrimary,
    ctaSubtext,
    heroImage,
    heroImageAlt,
    rateBadgeLabel,
    rateBadgeValue,
    rateBadgeTag,
    lenderCountSuffix,
  } = props

  return (
    <section
      style={{
        background: '#efe9dd',
        padding: 'clamp(48px, 8vw, 96px) 32px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'center',
        }}
      >
        <div>
          {eyebrow && (
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#6e6855',
                margin: '0 0 20px',
              }}
            >
              {eyebrow}
            </p>
          )}

          {headlineLine1 && (
            <h1
              style={{
                fontFamily: 'Fraunces, serif',
                fontVariationSettings: "'opsz' 144, 'SOFT' 50",
                fontWeight: 380,
                fontSize: 'clamp(56px, 7.4vw, 114px)',
                lineHeight: 0.94,
                letterSpacing: '-0.03em',
                color: '#1a3530',
                margin: 0,
              }}
              dangerouslySetInnerHTML={{ __html: renderRich(headlineLine1) }}
            />
          )}

          {headlineLine2 && (
            <p
              style={{
                fontFamily: 'Fraunces, serif',
                fontVariationSettings: "'opsz' 144, 'SOFT' 50",
                fontWeight: 380,
                fontSize: 'clamp(40px, 5.6vw, 88px)',
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
                color: '#1a3530',
                margin: '8px 0 0',
              }}
              dangerouslySetInnerHTML={{ __html: renderRich(headlineLine2) }}
            />
          )}

          {lede && (
            <p
              style={{
                fontFamily: 'Fraunces, serif',
                fontVariationSettings: "'opsz' 32, 'SOFT' 50",
                fontSize: 20,
                lineHeight: 1.5,
                color: '#2d4843',
                margin: '36px 0 0',
                maxWidth: 500,
                letterSpacing: '-0.005em',
              }}
              dangerouslySetInnerHTML={{ __html: renderRich(lede) }}
            />
          )}

          <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 20 }}>
            <button
              data-kf-booking
              style={{
                background: '#e88d6e',
                color: '#1d3f3a',
                border: 'none',
                borderRadius: 999,
                padding: '16px 28px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: 16,
                cursor: 'pointer',
                letterSpacing: '0.01em',
                flexShrink: 0,
              }}
            >
              {ctaPrimary || 'Book a 15-min chat'}
            </button>
            {ctaSubtext && (
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 13,
                  color: '#6e6855',
                  lineHeight: 1.4,
                }}
              >
                {ctaSubtext}
              </span>
            )}
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          {heroImage?.asset ? (
            <div style={{ position: 'relative', aspectRatio: '4/5', borderRadius: 12, overflow: 'hidden' }}>
              <Image
                src={urlFor(heroImage).width(640).url()}
                alt={heroImageAlt || ''}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
              {rateBadgeValue && (
                <div
                  style={{
                    position: 'absolute',
                    top: 24,
                    right: 24,
                    background: '#efe9dd',
                    border: '1px solid #1a3530',
                    borderRadius: 6,
                    padding: '18px 22px',
                    boxShadow: '4px 4px 0 #1a3530',
                    zIndex: 3,
                  }}
                >
                  {rateBadgeLabel && (
                    <p
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 11,
                        fontWeight: 500,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: '#d4714e',
                        margin: 0,
                      }}
                    >
                      {rateBadgeLabel}
                    </p>
                  )}
                  <p
                    style={{
                      fontFamily: 'Fraunces, serif',
                      fontVariationSettings: "'opsz' 144, 'SOFT' 50",
                      fontWeight: 380,
                      fontSize: 56,
                      lineHeight: 1,
                      color: '#1a3530',
                      margin: '4px 0',
                      letterSpacing: '-0.025em',
                    }}
                  >
                    {rateBadgeValue}
                  </p>
                  {rateBadgeTag && (
                    <p
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 10,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        color: '#6e6855',
                        margin: 0,
                      }}
                    >
                      {rateBadgeTag}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                aspectRatio: '4/5',
                background: '#d2c8b3',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ color: '#6e6855', fontSize: 14 }}>Hero image</span>
            </div>
          )}

          {lenderCountSuffix && (
            <p
              style={{
                marginTop: 16,
                fontFamily: 'Inter, sans-serif',
                fontSize: 12,
                color: '#6e6855',
                textAlign: 'center',
              }}
            >
              Panel includes Santander, Barclays, HSBC UK {lenderCountSuffix}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
