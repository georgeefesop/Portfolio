import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'

interface NavLink {
  label: string
  href: string
  isCta: boolean
}

interface KfNavProps {
  siteName: string
  logoDark?: { asset?: { _ref: string } }
  navLinks: NavLink[]
}

export default function KfNav({ siteName, logoDark, navLinks }: KfNavProps) {
  return (
    <header
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'transparent',
      }}
    >
      <nav
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          width: '100%',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }} aria-label={`${siteName} home`}>
          {logoDark?.asset ? (
            <Image
              src={urlFor(logoDark).height(96).url()}
              alt={siteName}
              width={160}
              height={48}
              style={{ height: 48, width: 'auto', display: 'block' }}
              priority
            />
          ) : (
            <span
              style={{
                fontFamily: 'Fraunces, serif',
                fontWeight: 380,
                fontSize: 22,
                color: '#1a3530',
                letterSpacing: '-0.02em',
              }}
            >
              {siteName}
            </span>
          )}
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
          {navLinks.map((link) =>
            link.isCta ? (
              <button
                key={link.href + link.label}
                data-kf-booking
                style={{
                  background: '#e88d6e',
                  color: '#1d3f3a',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 20px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                {link.label}
              </button>
            ) : (
              <a
                key={link.href + link.label}
                href={link.href}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: 15,
                  color: '#1a3530',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
              >
                {link.label}
              </a>
            )
          )}
        </div>
      </nav>
    </header>
  )
}
