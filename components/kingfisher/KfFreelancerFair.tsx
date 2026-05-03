import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import { renderRich } from '@/lib/kingfisher/text'

interface Event {
  _key?: string
  month?: string
  name?: string
  city?: string
  stand?: string
}

interface KfFreelancerFairProps {
  heading?: string
  lede?: string
  photo?: { asset?: { _ref: string } }
  photoAlt?: string
  photoCaption?: string
  events?: Event[]
}

export default function KfFreelancerFair({
  heading,
  lede,
  photo,
  photoAlt,
  photoCaption,
  events = [],
}: KfFreelancerFairProps) {
  return (
    <section style={{ background: '#efe9dd', padding: 'clamp(80px, 10vw, 120px) 24px' }}>
      <style>{`
        .kf-fair-title em {
          font-style: italic;
          font-variation-settings: 'opsz' 144, 'SOFT' 100;
          color: #d4714e;
          font-weight: 360;
        }
      `}</style>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 880, margin: '0 0 56px' }}>
          {heading && (
            <h2
              className="kf-fair-title"
              style={{
                fontFamily: 'Fraunces, serif',
                fontVariationSettings: "'opsz' 144, 'SOFT' 50",
                fontWeight: 380,
                fontSize: 'clamp(40px, 5.4vw, 68px)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: '#1d3f3a',
                margin: 0,
              }}
              dangerouslySetInnerHTML={{ __html: renderRich(heading) }}
            />
          )}
          {lede && (
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 17,
                lineHeight: 1.55,
                color: '#2d4843',
                maxWidth: 580,
                margin: 0,
              }}
            >
              {lede}
            </p>
          )}
        </div>

        {photo?.asset && (
          <figure style={{ margin: 0 }}>
            <div
              style={{
                position: 'relative',
                borderRadius: 20,
                overflow: 'hidden',
                aspectRatio: '16 / 5.85',
                background: '#1d3f3a',
              }}
            >
              <Image
                src={urlFor(photo).width(1600).url()}
                alt={photoAlt || ''}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            {photoCaption && (
              <figcaption
                style={{
                  fontFamily: 'Fraunces, serif',
                  fontVariationSettings: "'opsz' 32, 'SOFT' 100",
                  fontStyle: 'italic',
                  fontWeight: 360,
                  fontSize: 14,
                  color: '#6e6855',
                  margin: '16px 0 0',
                }}
              >
                {photoCaption}
              </figcaption>
            )}
          </figure>
        )}

        {events.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 32,
              marginTop: 64,
            }}
            className="kf-three-col"
          >
            {events.map((event, i) => (
              <div key={event._key || i} style={{ paddingTop: 24, borderTop: '1px solid #e88d6e' }}>
                {event.month && (
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      fontSize: 12,
                      letterSpacing: '0.14em',
                      color: '#1d3f3a',
                      textTransform: 'uppercase',
                      margin: '0 0 14px',
                    }}
                  >
                    {event.month}
                  </p>
                )}
                {event.name && (
                  <h3
                    style={{
                      fontFamily: 'Fraunces, serif',
                      fontVariationSettings: "'opsz' 144, 'SOFT' 50",
                      fontWeight: 380,
                      fontSize: 24,
                      lineHeight: 1.2,
                      letterSpacing: '-0.01em',
                      color: '#1d3f3a',
                      margin: '0 0 8px',
                    }}
                  >
                    {event.name}
                  </h3>
                )}
                {event.city && (
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 14,
                      lineHeight: 1.5,
                      color: '#6e6855',
                      margin: '0 0 4px',
                    }}
                  >
                    {event.city}
                  </p>
                )}
                {event.stand && (
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 14,
                      lineHeight: 1.5,
                      color: '#2d4843',
                      margin: 0,
                    }}
                  >
                    {event.stand}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
