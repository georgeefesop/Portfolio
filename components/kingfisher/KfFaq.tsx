'use client'

import { useState } from 'react'
import Script from 'next/script'
import { renderRich } from '@/lib/kingfisher/text'

interface FaqItem {
  _key?: string
  question?: string
  answer?: string
}

interface KfFaqProps {
  heading?: string
  items?: FaqItem[]
}

function FaqRow({ question, answer }: FaqItem) {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{
        borderBottom: '1px solid #d2c8b3',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          padding: '20px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 20,
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 16,
            fontWeight: 500,
            color: '#1a3530',
            lineHeight: 1.4,
          }}
        >
          {question}
        </span>
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: '1.5px solid #d2c8b3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: 18,
            color: '#1a3530',
            transition: 'transform 0.2s',
            transform: open ? 'rotate(45deg)' : 'none',
          }}
        >
          +
        </span>
      </button>
      {open && answer && (
        <div style={{ paddingBottom: 20 }}>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 15,
              lineHeight: 1.7,
              color: '#2d4843',
              margin: 0,
            }}
          >
            {answer}
          </p>
        </div>
      )}
    </div>
  )
}

export default function KfFaq({ heading, items = [] }: KfFaqProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  const headingHtml = heading ? renderRich(heading).replace(/\n/g, '<br>') : ''

  return (
    <section style={{ background: '#efe9dd', padding: 'clamp(96px, 10vw, 140px) 24px' }}>
      <Script
        id="kf-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        .kf-faq-h2 em {
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
          gridTemplateColumns: '1fr 2fr',
          gap: 80,
          alignItems: 'start',
        }}
        className="kf-two-col"
      >
        {heading && (
          <h2
            className="kf-faq-h2"
            style={{
              fontFamily: 'Fraunces, serif',
              fontVariationSettings: "'opsz' 144, 'SOFT' 50",
              fontWeight: 380,
              fontSize: 'clamp(48px, 5.5vw, 80px)',
              lineHeight: 0.96,
              letterSpacing: '-0.03em',
              color: '#1a3530',
              margin: 0,
              position: 'sticky',
              top: 40,
            }}
            dangerouslySetInnerHTML={{ __html: headingHtml }}
          />
        )}
        <div style={{ borderTop: '1px solid #d2c8b3' }}>
          {items.map((item, i) => (
            <FaqRow key={item._key || i} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}
