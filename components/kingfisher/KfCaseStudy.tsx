'use client'

import Image from 'next/image'
import { urlFor } from '@/lib/sanity/image'
import { useEffect, useRef, useState } from 'react'

interface StatItem {
  _key?: string
  target?: number
  prefix?: string
  suffix?: string
  decimals?: number
  label?: string
}

interface KfCaseStudyProps {
  eyebrow?: string
  heading?: string
  body?: Array<{ children?: Array<{ text: string }> }>
  heroImage?: { asset?: { _ref: string } }
  heroImageAlt?: string
  stats?: StatItem[]
  pullQuote?: string
  quoteAttribution?: string
}

function useCountUp(target: number, decimals: number, active: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    const duration = 1500
    const start = performance.now()
    let raf: number
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(parseFloat((eased * target).toFixed(decimals)))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, decimals, active])
  return value
}

function AnimatedStat({ target = 0, prefix = '', suffix = '', decimals = 0, label = '' }: StatItem) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); io.disconnect() } },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const value = useCountUp(target, decimals, active)
  const display = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString()

  return (
    <div ref={ref}>
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          fontSize: 30,
          color: '#0F4C4C',
          margin: '0 0 4px',
          letterSpacing: '-0.5px',
        }}
      >
        {prefix}{display}{suffix}
      </p>
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          fontSize: 12,
          color: '#8B8074',
          margin: 0,
          letterSpacing: '0.3px',
        }}
      >
        {label}
      </p>
    </div>
  )
}

function blockText(body: KfCaseStudyProps['body']): string[] {
  if (!body) return []
  return body.map((block) => (block.children ?? []).map((c) => c.text).join(''))
}

export default function KfCaseStudy({
  eyebrow,
  heading,
  body,
  heroImage,
  heroImageAlt,
  stats = [],
  pullQuote,
  quoteAttribution,
}: KfCaseStudyProps) {
  const paragraphs = blockText(body)

  return (
    <section style={{ background: '#efe9dd', padding: 'clamp(80px, 10vw, 120px) 24px' }}>
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'center',
        }}
        className="kf-two-col"
      >
        {heroImage?.asset && (
          <div
            style={{
              position: 'relative',
              aspectRatio: '4/3',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <Image
              src={urlFor(heroImage).width(1200).url()}
              alt={heroImageAlt || ''}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}

        <div>
          {eyebrow && (
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#d4714e',
                margin: '0 0 18px',
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
                fontSize: 'clamp(28px, 3.2vw, 44px)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: '#1a3530',
                margin: '0 0 24px',
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
                lineHeight: 1.65,
                color: '#2d4843',
                margin: i === 0 ? 0 : '14px 0 0',
              }}
            >
              {p}
            </p>
          ))}

          {stats.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 16,
                margin: '32px 0 16px',
              }}
            >
              {stats.map((stat, i) => (
                <AnimatedStat key={stat._key || i} {...stat} />
              ))}
            </div>
          )}

          {pullQuote && (
            <div style={{ borderLeft: '3px solid #FF6F5C', padding: '4px 0 4px 20px', marginTop: 16 }}>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontStyle: 'italic',
                  fontSize: 17,
                  color: '#0F4C4C',
                  lineHeight: 1.5,
                  margin: '0 0 8px',
                }}
              >
                &ldquo;{pullQuote}&rdquo;
              </p>
              {quoteAttribution && (
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: 13, color: '#8B8074', margin: 0 }}>
                  {quoteAttribution}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
