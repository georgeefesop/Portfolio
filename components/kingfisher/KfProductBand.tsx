import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import { renderRich } from '@/lib/kingfisher/text'

interface FeatureRow {
  _key?: string
  label?: string
  line?: string
}

interface KfProductBandProps {
  slug?: { current: string }
  eyebrow?: string
  heading?: string
  body?: string
  featureRows?: FeatureRow[]
  checklist?: string[]
  ctaLabel?: string
  ctaHref?: string
  trustNote?: string
  image?: { asset?: { _ref: string } }
  imageAlt?: string
  imageCaption?: string
  imagePosition?: 'left' | 'right'
}

export default function KfProductBand({
  slug,
  eyebrow,
  heading,
  body,
  featureRows = [],
  ctaLabel,
  ctaHref,
  trustNote,
  image,
  imageAlt,
  imageCaption,
  imagePosition = 'right',
}: KfProductBandProps) {
  const imgRight = imagePosition !== 'left'

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 560 }}>
      {eyebrow && (
        <p
          style={{
            margin: 0,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: 12,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#d4714e',
          }}
        >
          {eyebrow}
        </p>
      )}
      {heading && (
        <h2
          className="kf-product-h2"
          style={{
            margin: 0,
            fontFamily: 'Fraunces, serif',
            fontVariationSettings: "'opsz' 144, 'SOFT' 50",
            fontWeight: 380,
            fontSize: 'clamp(40px, 4.4vw, 60px)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: '#1a3530',
          }}
          dangerouslySetInnerHTML={{ __html: renderRich(heading) }}
        />
      )}
      {body && (
        <p
          style={{
            margin: 0,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: 16,
            lineHeight: 1.6,
            color: '#6e6855',
            maxWidth: 480,
          }}
        >
          {body}
        </p>
      )}

      {featureRows.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', margin: '4px 0 8px' }}>
          {featureRows.map((row, i) => (
            <div
              key={row._key || i}
              style={{
                borderTop: '1px solid #d2c8b3',
                borderBottom: i === featureRows.length - 1 ? '1px solid #d2c8b3' : 'none',
                padding: '16px 0 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              {row.label && (
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: 11,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#d4714e',
                  }}
                >
                  {row.label}
                </span>
              )}
              {row.line && (
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    fontSize: 17,
                    lineHeight: 1.4,
                    color: '#1a3530',
                  }}
                >
                  {row.line}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap', marginTop: 8 }}>
        {ctaLabel && (
          <a
            href={ctaHref || '#'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '16px 28px',
              background: '#e88d6e',
              color: '#1d3f3a',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 15,
              borderRadius: 999,
              textDecoration: 'none',
              letterSpacing: '-0.005em',
            }}
          >
            {ctaLabel} <span aria-hidden="true">&rarr;</span>
          </a>
        )}
        {trustNote && (
          <span
            style={{
              fontFamily: 'Fraunces, serif',
              fontStyle: 'italic',
              fontWeight: 360,
              fontVariationSettings: "'opsz' 32, 'SOFT' 100",
              fontSize: 15,
              color: '#6e6855',
            }}
          >
            {trustNote}
          </span>
        )}
      </div>
    </div>
  )

  const imgBlock = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {image?.asset ? (
        <div style={{ position: 'relative', height: 600, overflow: 'hidden' }}>
          <Image
            src={urlFor(image).width(900).url()}
            alt={imageAlt || ''}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
          />
        </div>
      ) : (
        <div style={{ height: 600, background: '#d2c8b3' }} />
      )}
      {imageCaption && (
        <p
          style={{
            margin: 0,
            fontFamily: 'Fraunces, serif',
            fontStyle: 'italic',
            fontWeight: 360,
            fontVariationSettings: "'opsz' 32, 'SOFT' 100",
            fontSize: 14,
            color: '#6e6855',
          }}
        >
          {imageCaption}
        </p>
      )}
    </div>
  )

  return (
    <section
      id={slug?.current}
      style={{ background: '#efe9dd', padding: 'clamp(80px, 10vw, 120px) 24px' }}
    >
      <style>{`
        .kf-product-h2 em {
          font-style: italic;
          color: #d4714e;
          font-weight: 360;
          font-variation-settings: 'opsz' 144, 'SOFT' 100;
        }
      `}</style>
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'center',
        }}
        className="kf-two-col"
      >
        {imgRight ? content : imgBlock}
        {imgRight ? imgBlock : content}
      </div>
    </section>
  )
}
