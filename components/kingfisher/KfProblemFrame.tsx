interface KfProblemFrameProps {
  eyebrow?: string
  heading?: string
  body?: Array<{ children?: Array<{ text: string }> }>
  checklistEyebrow?: string
  checklist?: string[]
  ctaLabel?: string
  ctaHref?: string
}

function blockText(body: KfProblemFrameProps['body']): string[] {
  if (!body) return []
  return body.map((block) =>
    (block.children ?? []).map((c) => c.text).join('')
  )
}

export default function KfProblemFrame({
  eyebrow,
  heading,
  body,
  checklistEyebrow,
  checklist,
  ctaLabel,
  ctaHref,
}: KfProblemFrameProps) {
  const paragraphs = blockText(body)

  return (
    <section style={{ background: '#efe9dd', padding: 'clamp(64px, 8vw, 96px) 32px' }}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80,
          alignItems: 'start',
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
                margin: '0 0 16px',
              }}
            >
              {eyebrow}
            </p>
          )}
          {heading && (
            <h2
              style={{
                fontFamily: 'Fraunces, serif',
                fontVariationSettings: "'opsz' 144, 'SOFT' 50",
                fontWeight: 380,
                fontSize: 'clamp(28px, 3vw, 44px)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: '#1a3530',
                margin: '0 0 28px',
              }}
            >
              {heading}
            </h2>
          )}
          {paragraphs.map((p, i) => (
            <p
              key={i}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 16,
                lineHeight: 1.7,
                color: '#2d4843',
                margin: i === 0 ? 0 : '20px 0 0',
              }}
            >
              {p}
            </p>
          ))}
          {ctaLabel && (
            <button
              data-kf-booking
              style={{
                marginTop: 32,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: '#e88d6e',
                color: '#1d3f3a',
                border: 'none',
                borderRadius: 8,
                padding: '14px 26px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
              }}
            >
              {ctaLabel}
              <span style={{ fontSize: 14, lineHeight: 1 }}>&#10095;</span>
            </button>
          )}
        </div>

        <div>
          {checklistEyebrow && (
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#6e6855',
                margin: '0 0 24px',
              }}
            >
              {checklistEyebrow}
            </p>
          )}
          {checklist && checklist.length > 0 && (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {checklist.map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                    marginBottom: i < checklist.length - 1 ? 18 : 0,
                  }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: '#1d3f3a',
                      color: '#e88d6e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    &#10003;
                  </span>
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 15,
                      lineHeight: 1.55,
                      color: '#1a3530',
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
