interface Stat {
  value: string
  label: string
}

interface KfMarqueeProps {
  stats: Stat[]
}

export default function KfMarquee({ stats }: KfMarqueeProps) {
  const doubled = [...stats, ...stats]

  return (
    <section
      style={{
        background: '#1d3f3a',
        overflow: 'hidden',
        padding: '18px 0',
      }}
    >
      <style>{`
        @keyframes kf-marquee-scroll {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        .kf-marquee-track {
          display: flex;
          gap: 80px;
          width: max-content;
          white-space: nowrap;
          animation: kf-marquee-scroll 40s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
        }
        .kf-receipt-item {
          display: inline-flex;
          align-items: baseline;
          gap: 14px;
          color: #efe9dd;
          flex-shrink: 0;
        }
        .kf-receipt-item i {
          color: #e88d6e;
          font-style: normal;
          font-size: 14px;
        }
        .kf-receipt-item b {
          font-family: 'Fraunces', serif;
          font-weight: 380;
          font-size: 28px;
          color: #e88d6e;
          font-variation-settings: 'opsz' 144, 'SOFT' 50;
          letter-spacing: -0.01em;
        }
        .kf-receipt-item em {
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-size: 12px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          opacity: 0.75;
          font-weight: 500;
          color: #efe9dd;
        }
      `}</style>
      <div className="kf-marquee-track">
        {doubled.map((stat, i) => (
          <span key={i} className="kf-receipt-item">
            <i>&#10042;</i>
            <b>{stat.value}</b>
            <em>{stat.label}</em>
          </span>
        ))}
      </div>
    </section>
  )
}
