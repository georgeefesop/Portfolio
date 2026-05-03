import { renderRich } from '@/lib/kingfisher/text'

interface AudienceCard {
  number?: string
  title?: string
  description?: string
  linkLabel?: string
  linkHref?: string
}

interface KfAudiencesProps {
  heading?: string
  subheading?: string
  cards?: AudienceCard[]
}

export default function KfAudiences({ heading, subheading, cards = [] }: KfAudiencesProps) {
  return (
    <section style={{ background: '#efe9dd', padding: 'clamp(96px, 10vw, 140px) 24px' }}>
      <style>{`
        .kf-aud-h2 em {
          font-style: italic;
          font-weight: 360;
          color: #1a3530;
          font-variation-settings: 'opsz' 144, 'SOFT' 100;
        }
      `}</style>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          {heading && (
            <h2
              className="kf-aud-h2"
              style={{
                fontFamily: 'Fraunces, serif',
                fontVariationSettings: "'opsz' 144, 'SOFT' 50",
                fontWeight: 380,
                fontSize: 'clamp(40px, 5vw, 64px)',
                lineHeight: 1.04,
                letterSpacing: '-0.025em',
                color: '#1a3530',
                maxWidth: 920,
                margin: '0 auto',
              }}
              dangerouslySetInnerHTML={{ __html: renderRich(heading) }}
            />
          )}
          {subheading && (
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 16,
                lineHeight: 1.55,
                color: '#6e6855',
                maxWidth: 620,
                margin: '18px auto 0',
              }}
            >
              {subheading}
            </p>
          )}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0,
            alignItems: 'stretch',
          }}
          className="kf-aud-grid"
        >
          {cards.map((card, i) => (
            <a
              key={i}
              href={card.linkHref || '#'}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                padding: '56px 36px 44px',
                background: 'transparent',
                borderTop: '1px solid #d2c8b3',
                borderBottom: '1px solid #d2c8b3',
                borderLeft: '1px solid #d2c8b3',
                borderRight: i === cards.length - 1 ? '1px solid #d2c8b3' : 'none',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'background-color 240ms ease',
                boxSizing: 'border-box',
              }}
            >
              {card.number && (
                <span
                  style={{
                    fontFamily: 'Fraunces, serif',
                    fontStyle: 'italic',
                    fontWeight: 360,
                    fontVariationSettings: "'opsz' 144, 'SOFT' 100",
                    fontSize: 44,
                    lineHeight: 1,
                    color: '#d4714e',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {card.number}
                </span>
              )}
              {card.title && (
                <h3
                  style={{
                    fontFamily: 'Fraunces, serif',
                    fontVariationSettings: "'opsz' 144, 'SOFT' 50",
                    fontWeight: 380,
                    fontSize: 30,
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    color: '#1a3530',
                    margin: 0,
                  }}
                >
                  {card.title}
                </h3>
              )}
              {card.description && (
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: '#2d4843',
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {card.description}
                </p>
              )}
              {card.linkLabel && (
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    fontSize: 11,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#d4714e',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    marginTop: 8,
                  }}
                >
                  {card.linkLabel}
                  <span style={{ fontSize: 13, letterSpacing: 0 }}>&rarr;</span>
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
