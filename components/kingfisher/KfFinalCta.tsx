interface KfFinalCtaProps {
  heading?: string
  body?: string
  ctaLabel?: string
  testimonialQuote?: string
  testimonialName?: string
  testimonialRole?: string
  testimonialInitials?: string
}

export default function KfFinalCta({
  heading,
  body,
  ctaLabel,
  testimonialQuote,
  testimonialName,
  testimonialRole,
  testimonialInitials,
}: KfFinalCtaProps) {
  return (
    <section style={{ background: '#1d3f3a', padding: 'clamp(64px, 8vw, 96px) 32px' }}>
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
          {heading && (
            <h2
              style={{
                fontFamily: 'Fraunces, serif',
                fontVariationSettings: "'opsz' 144, 'SOFT' 50",
                fontWeight: 380,
                fontSize: 'clamp(28px, 3.5vw, 48px)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: '#efe9dd',
                margin: '0 0 24px',
              }}
            >
              {heading}
            </h2>
          )}
          {body && (
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 16,
                lineHeight: 1.7,
                color: '#a8c5c0',
                margin: '0 0 36px',
              }}
            >
              {body}
            </p>
          )}
          {ctaLabel && (
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
              }}
            >
              {ctaLabel}
            </button>
          )}
        </div>

        {testimonialQuote && (
          <div
            style={{
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 16,
              padding: '32px 28px',
            }}
          >
            <p
              style={{
                fontFamily: 'Fraunces, serif',
                fontVariationSettings: "'opsz' 144, 'SOFT' 100",
                fontStyle: 'italic',
                fontWeight: 360,
                fontSize: 18,
                lineHeight: 1.55,
                color: '#efe9dd',
                margin: '0 0 24px',
              }}
            >
              &ldquo;{testimonialQuote}&rdquo;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#e88d6e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#1d3f3a',
                  flexShrink: 0,
                }}
              >
                {testimonialInitials}
              </div>
              <div>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#efe9dd',
                    margin: '0 0 2px',
                  }}
                >
                  {testimonialName}
                </p>
                {testimonialRole && (
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 13,
                      color: '#7aada6',
                      margin: 0,
                    }}
                  >
                    {testimonialRole}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
