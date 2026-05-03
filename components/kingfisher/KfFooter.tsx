import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import { renderRich } from '@/lib/kingfisher/text'

interface FooterLink {
  _key?: string
  label: string
  href: string
}

interface KfFooterProps {
  siteName?: string
  logoLight?: { asset?: { _ref: string } }
  footerTagline?: string
  footerBlurb?: string
  email?: string
  fcaReference?: string
  companyNumber?: string
  riskWarning?: string
  footerPages?: FooterLink[]
  footerLegal?: FooterLink[]
}

export default function KfFooter({
  siteName,
  logoLight,
  footerTagline,
  footerBlurb,
  email,
  fcaReference,
  companyNumber,
  riskWarning,
  footerPages = [],
  footerLegal = [],
}: KfFooterProps) {
  const muted = 'rgba(239, 233, 221, 0.82)'
  const dim = 'rgba(239, 233, 221, 0.68)'
  const dimmer = 'rgba(239, 233, 221, 0.50)'
  const rule = 'rgba(239, 233, 221, 0.12)'

  const colHead: React.CSSProperties = {
    fontFamily: 'Inter, sans-serif',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: '#e88d6e',
    margin: '0 0 18px',
  }
  const list: React.CSSProperties = {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 11,
  }
  const linkStyle: React.CSSProperties = {
    fontFamily: 'Inter, sans-serif',
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.5,
    color: muted,
    textDecoration: 'none',
  }

  return (
    <footer style={{ background: '#1d3f3a', padding: 'clamp(80px, 8vw, 120px) 24px 32px' }}>
      <style>{`
        .kf-footer-sig em {
          font-style: italic;
          color: #e88d6e;
          font-weight: 360;
          font-variation-settings: 'opsz' 144, 'SOFT' 100;
        }
      `}</style>
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', color: muted, fontFamily: 'Inter, sans-serif' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr 1fr 1fr 1.2fr',
            gap: 56,
            paddingBottom: 48,
          }}
          className="kf-four-col"
        >
          <div>
            <a href="/" aria-label={`${siteName || 'Kingfisher Mortgages'}, home`} style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
              {logoLight?.asset ? (
                <Image
                  src={urlFor(logoLight).height(104).url()}
                  alt={siteName || ''}
                  width={170}
                  height={52}
                  style={{ height: 52, width: 'auto', display: 'block' }}
                />
              ) : (
                <span
                  style={{
                    fontFamily: 'Fraunces, serif',
                    fontWeight: 380,
                    fontSize: 22,
                    color: '#efe9dd',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {siteName}
                </span>
              )}
            </a>
            {footerBlurb && (
              <p style={{ fontSize: 14, lineHeight: 1.55, margin: '18px 0 0', maxWidth: 280, color: dim }}>
                {footerBlurb}
              </p>
            )}
          </div>

          <div>
            <h4 style={colHead}>Pages</h4>
            <ul style={list}>
              {footerPages.map((link, i) => (
                <li key={link._key || i}>
                  <a href={link.href} style={linkStyle}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={colHead}>Legal</h4>
            <ul style={list}>
              {footerLegal.map((link, i) => (
                <li key={link._key || i}>
                  <a href={link.href} style={linkStyle}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={colHead}>Compliance</h4>
            <ul style={list}>
              {fcaReference && <li style={linkStyle}>FCA reference {fcaReference}</li>}
              {companyNumber && <li style={linkStyle}>Company no. {companyNumber}</li>}
              <li style={linkStyle}>NACFB member</li>
              {email && (
                <li style={{ ...linkStyle, marginTop: 6 }}>
                  <a href={`mailto:${email}`} style={linkStyle}>{email}</a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {footerTagline && (
          <p
            className="kf-footer-sig"
            style={{
              fontFamily: 'Fraunces, serif',
              fontWeight: 380,
              fontVariationSettings: "'opsz' 144, 'SOFT' 50",
              fontSize: 28,
              letterSpacing: '-0.01em',
              textAlign: 'center',
              color: '#efe9dd',
              padding: '12px 0 36px',
              margin: 0,
            }}
            dangerouslySetInnerHTML={{ __html: renderRich(footerTagline) }}
          />
        )}

        <hr style={{ border: 0, borderTop: `1px solid ${rule}`, margin: 0 }} />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 32,
            paddingTop: 24,
            flexWrap: 'wrap',
            fontSize: 11,
            lineHeight: 1.55,
            color: dimmer,
          }}
        >
          <p style={{ margin: 0 }}>
            &copy; {new Date().getFullYear()} {siteName} Ltd. All rights reserved.
          </p>
          {riskWarning && (
            <p style={{ margin: 0, maxWidth: 720 }}>{riskWarning}</p>
          )}
        </div>
      </div>
    </footer>
  )
}
