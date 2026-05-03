import { renderRich } from '@/lib/kingfisher/text'

interface Step {
  number?: string
  label?: string
  heading?: string
  body?: string
}

interface KfHowItWorksProps {
  heading?: string
  steps?: Step[]
}

export default function KfHowItWorks({ heading, steps = [] }: KfHowItWorksProps) {
  return (
    <section style={{ background: '#1d3f3a', padding: 'clamp(64px, 8vw, 96px) 32px' }}>
      <style>{`
        .kf-steps-title em {
          font-style: italic;
          font-weight: 360;
          color: #e88d6e;
          font-variation-settings: 'opsz' 144, 'SOFT' 100;
        }
      `}</style>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {heading && (
          <h2
            className="kf-steps-title"
            style={{
              fontFamily: 'Fraunces, serif',
              fontVariationSettings: "'opsz' 144, 'SOFT' 50",
              fontWeight: 380,
              fontSize: 'clamp(36px, 5vw, 64px)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: '#efe9dd',
              textAlign: 'center',
              maxWidth: 920,
              margin: '0 auto 96px auto',
            }}
            dangerouslySetInnerHTML={{ __html: renderRich(heading) }}
          />
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 36,
            position: 'relative',
            alignItems: 'start',
            padding: '60px 0',
          }}
        >
          {/* horizontal connector line */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: 1,
              background: 'rgba(232, 141, 110, 0.6)',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />

          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                position: 'relative',
                background: '#efe9dd',
                padding: '40px 36px',
                zIndex: 1,
                boxShadow: '14px 14px 0 #e88d6e',
                transform: i === 0 ? 'translateY(-44px)' : i === 1 ? 'translateY(56px)' : 'translateY(-44px)',
              }}
            >
              <div
                style={{
                  fontFamily: 'Fraunces, serif',
                  fontWeight: 380,
                  fontVariationSettings: "'opsz' 144, 'SOFT' 50",
                  fontSize: 56,
                  lineHeight: 1,
                  color: '#e88d6e',
                  margin: '0 0 20px 0',
                  letterSpacing: '-0.02em',
                }}
              >
                {step.number}
              </div>
              {step.label && (
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: 11,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#6e6855',
                    margin: '0 0 14px 0',
                  }}
                >
                  {step.label}
                </p>
              )}
              {step.heading && (
                <h3
                  style={{
                    fontFamily: 'Fraunces, serif',
                    fontVariationSettings: "'opsz' 144, 'SOFT' 50",
                    fontWeight: 380,
                    fontSize: 24,
                    lineHeight: 1.2,
                    letterSpacing: '-0.01em',
                    color: '#1a3530',
                    margin: '0 0 14px 0',
                  }}
                >
                  {step.heading}
                </h3>
              )}
              {step.body && (
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 15,
                    lineHeight: 1.55,
                    color: '#2d4843',
                    margin: 0,
                  }}
                >
                  {step.body}
                </p>
              )}
              {i < steps.length - 1 && (
                <span
                  style={{
                    display: 'block',
                    marginTop: 18,
                    color: '#e88d6e',
                    fontFamily: 'Fraunces, serif',
                    fontSize: 22,
                    lineHeight: 1,
                    textAlign: 'right',
                  }}
                  aria-hidden="true"
                >
                  &rarr;
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
