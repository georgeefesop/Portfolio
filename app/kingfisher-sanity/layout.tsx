import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kingfisher Mortgages',
  description: 'Specialist mortgages for the self-employed, contractors, and limited company directors.',
}

export default function KingfisherSanityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
      />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin=""
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..700,50..100;1,9..144,300..700,50..100&family=Inter:wght@400;450;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        em { font-family: 'Fraunces', serif; font-style: italic; color: #d4714e; letter-spacing: -0.02em; }
        @media (max-width: 768px) {
          .kf-two-col { grid-template-columns: 1fr !important; }
          .kf-three-col { grid-template-columns: 1fr !important; }
          .kf-four-col { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
      {children}
    </>
  )
}
