export const revalidate = 60

import { client } from '@/lib/sanity/client'
import KfNav from '@/components/kingfisher/KfNav'
import KfHero from '@/components/kingfisher/KfHero'
import KfMarquee from '@/components/kingfisher/KfMarquee'
import KfProblemFrame from '@/components/kingfisher/KfProblemFrame'
import KfCalculator from '@/components/kingfisher/KfCalculator'
import KfHowItWorks from '@/components/kingfisher/KfHowItWorks'
import KfAudiences from '@/components/kingfisher/KfAudiences'
import KfReceiptTestimonial from '@/components/kingfisher/KfReceiptTestimonial'
import KfCaseStudy from '@/components/kingfisher/KfCaseStudy'
import KfFreelancerFair from '@/components/kingfisher/KfFreelancerFair'
import KfProductBand from '@/components/kingfisher/KfProductBand'
import KfFaq from '@/components/kingfisher/KfFaq'
import KfFinalCta from '@/components/kingfisher/KfFinalCta'
import KfFooter from '@/components/kingfisher/KfFooter'
import KfBookingModal from '@/components/kingfisher/KfBookingModal'

const QUERY = `{
  "settings": *[_type == "kf_siteSettings"][0]{
    siteName, logoDark, logoLight, navLinks, footerTagline, footerBlurb,
    email, fcaReference, companyNumber, riskWarning, footerPages, footerLegal
  },
  "hero": *[_type == "kf_hero"][0]{
    eyebrow, headlineLine1, headlineLine2, lede,
    ctaPrimary, ctaPrimaryHref, ctaSubtext,
    heroImage, heroImageAlt,
    rateBadgeLabel, rateBadgeValue, rateBadgeTag,
    lenderLogos, lenderCountSuffix
  },
  "marquee": *[_type == "kf_marquee"][0]{ stats },
  "problemFrame": *[_type == "kf_problemFrame"][0]{
    eyebrow, heading, body, checklistEyebrow, checklist, ctaLabel, ctaHref
  },
  "calculator": *[_type == "kf_calculator"][0]{
    heading, lede, eyebrow,
    defaultIncome, defaultDeposit, defaultTermYears, incomeMultiplier,
    ctaLabel, ctaHref, disclaimer
  },
  "howItWorks": *[_type == "kf_howItWorks"][0]{ heading, steps },
  "audiences": *[_type == "kf_audiences"][0]{ heading, subheading, cards },
  "receiptTestimonial": *[_type == "kf_receiptTestimonial"][0]{
    introText, declinedRows, outroText,
    clientPhoto, clientPhotoAlt, stats, clientAttribution
  },
  "caseStudy": *[_type == "kf_caseStudy"][0]{
    eyebrow, heading, body, heroImage, heroImageAlt, stats, pullQuote, quoteAttribution
  },
  "freelancerFair": *[_type == "kf_freelancerFair"][0]{
    heading, lede, photo, photoAlt, photoCaption, events
  },
  "productBands": *[_type == "kf_productBand"] | order(_createdAt asc){
    slug, eyebrow, heading, body, featureRows, checklist,
    ctaLabel, ctaHref, trustNote, image, imageAlt, imageCaption, imagePosition
  },
  "faq": *[_type == "kf_faq"][0]{ heading, items },
  "finalCta": *[_type == "kf_finalCta"][0]{
    heading, body, ctaLabel, ctaHref,
    testimonialQuote, testimonialName, testimonialRole, testimonialInitials
  }
}`

interface SanityData {
  settings: Record<string, unknown> | null
  hero: Record<string, unknown> | null
  marquee: { stats: Array<{ value: string; label: string }> } | null
  problemFrame: Record<string, unknown> | null
  calculator: Record<string, unknown> | null
  howItWorks: Record<string, unknown> | null
  audiences: Record<string, unknown> | null
  receiptTestimonial: Record<string, unknown> | null
  caseStudy: Record<string, unknown> | null
  freelancerFair: Record<string, unknown> | null
  productBands: Array<Record<string, unknown>>
  faq: Record<string, unknown> | null
  finalCta: Record<string, unknown> | null
}

export default async function KingfisherSanityPage() {
  let data: SanityData | null = null
  try {
    data = await client.fetch<SanityData>(QUERY)
  } catch {
    // dataset may be empty before seeding - render shell with fallback messaging
  }

  const s = data?.settings
  const navLinks = (s as { navLinks?: Array<{ label: string; href: string; isCta: boolean }> } | null)?.navLinks ?? [
    { label: 'Remortgage', href: '#remortgage', isCta: false },
    { label: 'Buy-to-let', href: '#buy-to-let', isCta: false },
    { label: 'Book a chat', href: '#', isCta: true },
  ]

  return (
    <>
      <KfNav
        siteName={(s as { siteName?: string } | null)?.siteName ?? 'Kingfisher Mortgages'}
        logoDark={(s as { logoDark?: { asset?: { _ref: string } } } | null)?.logoDark}
        navLinks={navLinks}
      />

      {data?.hero ? (
        <KfHero {...(data.hero as Parameters<typeof KfHero>[0])} />
      ) : (
        <div style={{ background: '#efe9dd', minHeight: 480, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', color: '#6e6855' }}>
            Run <code>npm run seed:kingfisher</code> to populate content.
          </p>
        </div>
      )}

      {data?.marquee?.stats && data.marquee.stats.length > 0 && (
        <KfMarquee stats={data.marquee.stats} />
      )}

      {data?.problemFrame && (
        <KfProblemFrame {...(data.problemFrame as Parameters<typeof KfProblemFrame>[0])} />
      )}

      {data?.calculator && (
        <KfCalculator {...(data.calculator as Parameters<typeof KfCalculator>[0])} />
      )}

      {data?.howItWorks && (
        <KfHowItWorks {...(data.howItWorks as Parameters<typeof KfHowItWorks>[0])} />
      )}

      {data?.audiences && (
        <KfAudiences {...(data.audiences as Parameters<typeof KfAudiences>[0])} />
      )}

      {data?.caseStudy && (
        <KfCaseStudy {...(data.caseStudy as Parameters<typeof KfCaseStudy>[0])} />
      )}

      {data?.freelancerFair && (
        <KfFreelancerFair {...(data.freelancerFair as Parameters<typeof KfFreelancerFair>[0])} />
      )}

      {data?.productBands && data.productBands
        .filter((b) => (b as { slug?: { current?: string } }).slug?.current !== 'remortgage')
        .map((band, i) => (
          <KfProductBand key={i} {...(band as Parameters<typeof KfProductBand>[0])} />
        ))}

      {data?.faq && (
        <KfFaq {...(data.faq as Parameters<typeof KfFaq>[0])} />
      )}

      <KfFooter
        siteName={(s as { siteName?: string } | null)?.siteName ?? 'Kingfisher Mortgages'}
        logoLight={(s as { logoLight?: { asset?: { _ref: string } } } | null)?.logoLight}
        footerTagline={(s as { footerTagline?: string } | null)?.footerTagline}
        footerBlurb={(s as { footerBlurb?: string } | null)?.footerBlurb}
        email={(s as { email?: string } | null)?.email}
        fcaReference={(s as { fcaReference?: string } | null)?.fcaReference}
        companyNumber={(s as { companyNumber?: string } | null)?.companyNumber}
        riskWarning={(s as { riskWarning?: string } | null)?.riskWarning}
        footerPages={(s as { footerPages?: Array<{ label: string; href: string }> } | null)?.footerPages ?? []}
        footerLegal={(s as { footerLegal?: Array<{ label: string; href: string }> } | null)?.footerLegal ?? []}
      />

      <KfBookingModal />
    </>
  )
}
