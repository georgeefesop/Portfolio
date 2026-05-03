'use client'

import dynamic from 'next/dynamic'
import config from '../../../../sanity.config'

const NextStudio = dynamic(
  () => import('next-sanity/studio').then((m) => m.NextStudio),
  { ssr: false, loading: () => <div style={{ padding: 24, fontFamily: 'system-ui' }}>Loading Studio...</div> }
)

export function Studio() {
  return <NextStudio config={config} />
}
