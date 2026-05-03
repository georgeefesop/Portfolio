'use client'

import { useState } from 'react'
import { renderRich } from '@/lib/kingfisher/text'

interface KfCalculatorProps {
  heading?: string
  lede?: string
  eyebrow?: string
  defaultIncome?: number
  defaultDeposit?: number
  defaultTermYears?: number
  incomeMultiplier?: number
  ctaLabel?: string
  ctaHref?: string
  disclaimer?: string
}

function fmt(n: number): string {
  return new Intl.NumberFormat('en-GB').format(Math.round(n))
}

function monthlyPayment(principal: number, termYears: number, annualRatePct: number): number {
  const r = annualRatePct / 100 / 12
  const n = termYears * 12
  if (r === 0) return principal / n
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

const KF_RATE_PCT = 4.09

export default function KfCalculator({
  heading,
  lede,
  eyebrow,
  defaultIncome = 72000,
  defaultDeposit = 40000,
  defaultTermYears = 25,
  incomeMultiplier = 3.94,
  ctaLabel,
  disclaimer,
}: KfCalculatorProps) {
  const [income, setIncome] = useState(defaultIncome)
  const [deposit, setDeposit] = useState(defaultDeposit)
  const [term, setTerm] = useState(defaultTermYears)

  const indicative = Math.round(income * incomeMultiplier)
  const monthly = monthlyPayment(indicative, term, KF_RATE_PCT)

  const sliderStyle: React.CSSProperties = {
    width: '100%',
    accentColor: '#e88d6e',
    cursor: 'pointer',
    height: 4,
  }
  const labelRow: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  }
  const labelLeft: React.CSSProperties = {
    fontFamily: 'Inter, sans-serif',
    fontSize: 13,
    color: '#6e6855',
    fontWeight: 400,
  }
  const labelRight: React.CSSProperties = {
    fontFamily: 'Inter, sans-serif',
    fontSize: 14,
    color: '#1a3530',
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums',
  }

  return (
    <section id="calculator" style={{ background: '#efe9dd', padding: 'clamp(64px, 10vw, 120px) 24px' }}>
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '5fr 6fr',
          gap: 80,
          alignItems: 'center',
        }}
        className="kf-two-col"
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {heading && (
            <h2
              style={{
                fontFamily: 'Fraunces, serif',
                fontVariationSettings: "'opsz' 144, 'SOFT' 50",
                fontWeight: 380,
                fontSize: 'clamp(40px, 4.6vw, 64px)',
                lineHeight: 1.04,
                letterSpacing: '-0.025em',
                color: '#1a3530',
                margin: 0,
              }}
              dangerouslySetInnerHTML={{ __html: renderRich(heading) }}
            />
          )}
          {lede && (
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 16,
                lineHeight: 1.6,
                color: '#2d4843',
                margin: '28px 0 0',
                maxWidth: 460,
              }}
            >
              {lede}
            </p>
          )}
          {eyebrow && (
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#d4714e',
                margin: '36px 0 0',
              }}
            >
              {eyebrow}
            </p>
          )}
        </div>

        <div
          style={{
            background: '#f7f2e6',
            border: '1px solid #d2c8b3',
            borderRadius: 6,
            padding: '12px 40px 36px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ padding: '22px 0', borderBottom: '1px solid #d2c8b3' }}>
            <div style={labelRow}>
              <span style={labelLeft}>Annual income</span>
              <span style={{ ...labelRight, fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 380, letterSpacing: '-0.02em' }}>
                &pound;{fmt(income)}
              </span>
            </div>
            <input type="range" min={20000} max={300000} step={1000} value={income} onChange={(e) => setIncome(Number(e.target.value))} style={sliderStyle} />
          </div>

          <div style={{ padding: '22px 0', borderBottom: '1px solid #d2c8b3' }}>
            <div style={labelRow}>
              <span style={labelLeft}>Deposit</span>
              <span style={{ ...labelRight, fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 380, letterSpacing: '-0.02em' }}>
                &pound;{fmt(deposit)}
              </span>
            </div>
            <input type="range" min={5000} max={200000} step={1000} value={deposit} onChange={(e) => setDeposit(Number(e.target.value))} style={sliderStyle} />
          </div>

          <div style={{ padding: '22px 0', borderBottom: '1px solid #d2c8b3' }}>
            <div style={labelRow}>
              <span style={labelLeft}>Term</span>
              <span style={{ ...labelRight, fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 380, letterSpacing: '-0.02em' }}>
                {term} years
              </span>
            </div>
            <input type="range" min={5} max={40} step={1} value={term} onChange={(e) => setTerm(Number(e.target.value))} style={sliderStyle} />
          </div>

          <div style={{ padding: '28px 0 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#2d4843', fontWeight: 500 }}>
              Indicative borrowing
            </span>
            <span
              style={{
                fontFamily: 'Fraunces, serif',
                fontVariationSettings: "'opsz' 144, 'SOFT' 100",
                fontStyle: 'italic',
                fontSize: 44,
                fontWeight: 360,
                color: '#d4714e',
                letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              &pound;{fmt(indicative)}
            </span>
          </div>

          <div style={{ padding: '0 0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 24 }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#6e6855', fontWeight: 400 }}>
              Est. monthly payment <span style={{ opacity: 0.7 }}>&middot; at {KF_RATE_PCT}%</span>
            </span>
            <span
              style={{
                fontFamily: 'Fraunces, serif',
                fontWeight: 380,
                fontSize: 22,
                color: '#1a3530',
                letterSpacing: '-0.01em',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              &pound;{fmt(monthly)}
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#6e6855', marginLeft: 4, fontWeight: 400 }}>/mo</span>
            </span>
          </div>

          <button
            data-kf-booking
            style={{
              alignSelf: 'flex-start',
              marginTop: 8,
              padding: '16px 28px',
              background: '#e88d6e',
              color: '#1d3f3a',
              border: 'none',
              borderRadius: 999,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: 16,
              letterSpacing: '0.01em',
              cursor: 'pointer',
            }}
          >
            {ctaLabel || 'Book a 15-min chat'}
          </button>

          {disclaimer && (
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 12,
                lineHeight: 1.55,
                color: '#6e6855',
                margin: '24px 0 0',
                opacity: 0.85,
                maxWidth: 360,
              }}
            >
              {disclaimer}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
