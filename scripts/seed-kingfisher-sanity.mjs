/**
 * Seed script for the Kingfisher Mortgages Sanity dataset.
 *
 * Prereq: add SANITY_AUTH_TOKEN to .env.local (write token from manage.sanity.io)
 * Run:    npm run seed:kingfisher
 */

import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'fs'
import { resolve, join } from 'path'
import { fileURLToPath } from 'url'

// Load .env.local manually (no dotenv dep required)
const __dir = fileURLToPath(new URL('.', import.meta.url))
const root = resolve(__dir, '..')
const envPath = join(root, '.env.local')
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
}

const token = process.env.SANITY_AUTH_TOKEN
if (!token) {
  console.error('Error: SANITY_AUTH_TOKEN is not set in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId: 'bfonjqiz',
  dataset: 'kingfisher',
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

const uploadsDir = join(root, 'public', 'kingfisher', 'wp-content', 'uploads', '2026', '04')

// ---- helpers ----

async function uploadImage(filename) {
  const filePath = join(uploadsDir, filename)
  if (!existsSync(filePath)) {
    console.warn(`  skip (not found): ${filename}`)
    return null
  }
  const buf = readFileSync(filePath)
  const ext = filename.split('.').pop().toLowerCase()
  const mimeMap = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', svg: 'image/svg+xml' }
  const contentType = mimeMap[ext] || 'image/png'
  try {
    const asset = await client.assets.upload('image', buf, { filename, contentType })
    console.log(`  uploaded: ${filename} -> ${asset._id}`)
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
  } catch (err) {
    console.warn(`  upload failed: ${filename}: ${err.message}`)
    return null
  }
}

function imageRef(assetId) {
  return { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
}

async function upsert(doc) {
  await client.createOrReplace(doc)
  console.log(`  upserted: ${doc._type} (${doc._id})`)
}

// ---- main ----

let docCount = 0
let assetCount = 0

async function seed() {
  console.log('\nUploading images...')

  const heroImg = await uploadImage('1472adc8-c457-4f56-ad03-982526287db0-818x1024.png')
  if (heroImg) assetCount++
  const receiptImg = await uploadImage('e69033dd-05ff-4f5f-b42c-c8f920904fc2-825x1024.png')
  if (receiptImg) assetCount++
  const caseStudyImg = await uploadImage('6ccad206-b7f2-4e69-8874-d202396772c2.png')
  if (caseStudyImg) assetCount++
  const fairImg = await uploadImage('ded8269f-b821-4c41-87b3-bb7478593da4.png')
  if (fairImg) assetCount++
  const remortgageImg = await uploadImage('23a37f13-ff16-4c2b-af0b-ca40a2396743.png')
  if (remortgageImg) assetCount++
  const btlImg = await uploadImage('pexels-photo-20703514.jpeg')
  if (btlImg) assetCount++
  const logoDark = await uploadImage('kingfisher-logo-v4-dark.svg')
  if (logoDark) assetCount++
  const logoLight = await uploadImage('kingfisher-logo-v4-light.svg')
  if (logoLight) assetCount++

  console.log('\nUpserting documents...')

  // Site settings
  await upsert({
    _id: 'kf-site-settings',
    _type: 'kf_siteSettings',
    siteName: 'Kingfisher Mortgages',
    ...(logoDark ? { logoDark } : {}),
    ...(logoLight ? { logoLight } : {}),
    navLinks: [
      { _key: 'nav-remortgage', label: 'Remortgage', href: '#remortgage', isCta: false },
      { _key: 'nav-btl', label: 'Buy-to-let', href: '#buy-to-let', isCta: false },
      { _key: 'nav-freelancers', label: 'For Freelancers', href: '/for-freelancers/', isCta: false },
      { _key: 'nav-about', label: 'About', href: '/about/', isCta: false },
      { _key: 'nav-cta', label: 'Book a chat', href: '#', isCta: true },
    ],
    footerTagline: 'From Brighton, working nationwide, with *care*.',
    footerBlurb: 'Mortgages for the self-employed. Based in Brighton. Working nationwide.',
    email: 'hello@kingfishermortgages.co.uk',
    fcaReference: '987654',
    companyNumber: '13245678',
    riskWarning: 'Your home may be repossessed if you do not keep up repayments on your mortgage. Authorised and regulated by the Financial Conduct Authority. The FCA does not regulate some forms of buy to let mortgages.',
    footerPages: [
      { _key: 'fp-home', label: 'Home', href: '/' },
      { _key: 'fp-freelancers', label: 'For Freelancers', href: '/for-freelancers/' },
      { _key: 'fp-contractors', label: 'For Contractors', href: '#' },
      { _key: 'fp-directors', label: 'For Directors', href: '#' },
      { _key: 'fp-about', label: 'About', href: '/about/' },
      { _key: 'fp-contact', label: 'Contact', href: '/contact/' },
    ],
    footerLegal: [
      { _key: 'fl-privacy', label: 'Privacy policy', href: '#' },
      { _key: 'fl-cookie', label: 'Cookie policy', href: '#' },
      { _key: 'fl-complaints', label: 'Complaints procedure', href: '#' },
      { _key: 'fl-terms', label: 'Terms of service', href: '#' },
    ],
  })
  docCount++

  // Hero
  await upsert({
    _id: 'kf-hero',
    _type: 'kf_hero',
    eyebrow: 'SPECIALIST MORTGAGES',
    headlineLine1: 'The bank said {no.}',
    headlineLine2: 'So we said *fine*{.}',
    lede: 'Specialist mortgages for the *self-employed*, the *contractors*, and the *limited company directors*. Everyone the high street stopped serving in 2008.',
    ctaPrimary: 'Book a 15-min chat',
    ctaPrimaryHref: '#',
    ctaSubtext: 'Fifteen minutes. No application forms. No sales pressure.',
    ...(heroImg ? { heroImage: heroImg } : {}),
    heroImageAlt: 'Woman working at laptop, relaxed and confident',
    rateBadgeLabel: 'Best 5-yr fix today',
    rateBadgeValue: '4.09%',
    rateBadgeTag: '● Live · self-employed',
    lenderLogos: [],
    lenderCountSuffix: '+ 47 more',
  })
  docCount++

  // Marquee
  await upsert({
    _id: 'kf-marquee',
    _type: 'kf_marquee',
    stats: [
      { _key: 's1', value: '£2.1bn', label: 'lent to the self-employed' },
      { _key: 's2', value: '11,400+', label: 'homes funded' },
      { _key: 's3', value: '92%', label: 'approval rate' },
      { _key: 's4', value: '9 days', label: 'avg. to offer' },
      { _key: 's5', value: '4.8/5', label: 'on Trustpilot' },
      { _key: 's6', value: '90+', label: 'specialist lenders' },
    ],
  })
  docCount++

  // Problem frame
  await upsert({
    _id: 'kf-problem-frame',
    _type: 'kf_problemFrame',
    eyebrow: 'HOW WE THINK DIFFERENTLY',
    heading: 'Your bank looks at a payslip. We look at your business.',
    body: [
      {
        _key: 'p1',
        _type: 'block',
        style: 'normal',
        children: [
          {
            _key: 'c1',
            _type: 'span',
            text: "High street banks automate their mortgage decisions around PAYE salaries and three full years of accounts filed with HMRC. If you're self-employed, the same system that serves your peers can quietly price you out for something that was never a risk in the first place.",
          },
        ],
      },
      {
        _key: 'p2',
        _type: 'block',
        style: 'normal',
        children: [
          {
            _key: 'c2',
            _type: 'span',
            text: 'We work with specialist lenders who assess your business on its own terms. That usually makes the difference between a no and a yes.',
          },
        ],
      },
    ],
    checklistEyebrow: 'WHAT WE ACCEPT',
    checklist: [
      'One year of accounts. Sometimes none.',
      'Contractor day rates and fixed-term income.',
      'Retained profits in a limited company.',
      'Seasonal and irregular months.',
      'Income paid in foreign currency.',
    ],
    ctaLabel: 'Book a 15-min chat',
    ctaHref: '#',
  })
  docCount++

  // Calculator
  await upsert({
    _id: 'kf-calculator',
    _type: 'kf_calculator',
    heading: 'What could you *actually* afford?',
    lede: 'See the numbers specialist lenders could realistically offer you, based on your unique self-employed income. Not a watered-down version of it.',
    eyebrow: 'Based on self-employed income',
    defaultIncome: 72000,
    defaultDeposit: 40000,
    defaultTermYears: 25,
    incomeMultiplier: 3.944,
    ctaLabel: 'Book a 15-min chat',
    ctaHref: '#',
    disclaimer: 'Indicative figures based on a typical specialist lender model. Actual borrowing depends on your full profile.',
  })
  docCount++

  // How it works
  await upsert({
    _id: 'kf-how-it-works',
    _type: 'kf_howItWorks',
    heading: "From stuck to keys in *four to six weeks.*",
    steps: [
      {
        _key: 'step1',
        number: '01',
        label: 'Step one',
        heading: 'Book a 15-minute chat.',
        body: "No paperwork. No pressure. We'll tell you straight whether a mortgage is realistic for your situation.",
      },
      {
        _key: 'step2',
        number: '02',
        label: 'Step two',
        heading: 'We match you with the right lender.',
        body: "We send your case to the lenders most likely to say yes, drawn from our 50+ specialist panel. Typically within 48 hours.",
      },
      {
        _key: 'step3',
        number: '03',
        label: 'Step three',
        heading: 'You get your mortgage.',
        body: 'Average time from first chat to mortgage offer is four to six weeks. Your advisor stays with you through exchange and completion.',
      },
    ],
  })
  docCount++

  // Audiences
  await upsert({
    _id: 'kf-audiences',
    _type: 'kf_audiences',
    heading: 'Whatever *"self-employed"* looks like for you.',
    subheading: 'We specialise in three audiences the high street keeps getting wrong. If your setup is different, talk to us anyway.',
    cards: [
      {
        _key: 'a1',
        number: '01',
        title: 'Freelancers',
        description: 'Designers, developers, writers, consultants. Irregular invoices, real businesses.',
        linkLabel: 'How we help freelancers',
        linkHref: '/for-freelancers/',
      },
      {
        _key: 'a2',
        number: '02',
        title: 'Contractors',
        description: "Day-rate IT, engineering, healthcare. We know the lenders who count the whole contract, not just filed accounts.",
        linkLabel: 'How we help contractors',
        linkHref: '#',
      },
      {
        _key: 'a3',
        number: '03',
        title: 'Company Directors',
        description: 'Limited company owners with salary plus dividends. Retained profits that deserve to count.',
        linkLabel: 'How we help directors',
        linkHref: '#',
      },
    ],
  })
  docCount++

  // Receipt testimonial
  await upsert({
    _id: 'kf-receipt-testimonial',
    _type: 'kf_receiptTestimonial',
    introText: 'Three high-street lenders. Same applicant. Same week.',
    declinedRows: [
      { _key: 'r1', bank: 'Halifax', verdict: 'declined.', isWinner: false },
      { _key: 'r2', bank: 'HSBC', verdict: 'declined.', isWinner: false },
      { _key: 'r3', bank: 'Santander', verdict: 'declined.', isWinner: false },
      { _key: 'r4', bank: 'Kingfisher', verdict: '9 days.', isWinner: true },
    ],
    outroText: 'Marcus had a thriving music production business with strong net profits. High-street lenders saw irregular income and said no. We saw a creditworthy borrower and found him an offer in nine days.',
    ...(receiptImg ? { clientPhoto: receiptImg } : {}),
    clientPhotoAlt: 'Marcus T., music producer, Bristol',
    stats: [
      { _key: 'st1', value: '£420k', label: 'Borrowed' },
      { _key: 'st2', value: '4.09%', label: '5-yr fix' },
      { _key: 'st3', value: '£0', label: 'Broker fee' },
      { _key: 'st4', value: '9 days', label: 'To offer' },
    ],
    clientAttribution: 'Marcus T. - music producer - Bristol - 2026',
  })
  docCount++

  // Case study
  await upsert({
    _id: 'kf-case-study',
    _type: 'kf_caseStudy',
    eyebrow: 'A recent case',
    heading: 'How Sarah bought her first flat with 18 months of accounts.',
    body: [
      {
        _key: 'p1',
        _type: 'block',
        style: 'normal',
        children: [
          {
            _key: 'c1',
            _type: 'span',
            text: "Sarah is a freelance illustrator. She'd been turned down by her bank twice. She had £42,000 saved, a £65,000 average income, and 18 months of trading history.",
          },
        ],
      },
      {
        _key: 'p2',
        _type: 'block',
        style: 'normal',
        children: [
          {
            _key: 'c2',
            _type: 'span',
            text: "We matched her with a specialist lender who accepts 12 months of accounts, ignored the \"only two full years\" rule she'd hit elsewhere, and priced her at 5.2% on a five year fix.",
          },
        ],
      },
      {
        _key: 'p3',
        _type: 'block',
        style: 'normal',
        children: [
          {
            _key: 'c3',
            _type: 'span',
            text: 'She completed on a two bed flat in Bristol 42 days after her first call with us.',
          },
        ],
      },
    ],
    ...(caseStudyImg ? { heroImage: caseStudyImg } : {}),
    heroImageAlt: "Sarah, a tattoo artist of Bangladeshi heritage, bent forward in concentration as she tattoos a client's forearm in her characterful studio",
    stats: [
      { _key: 'cs1', target: 312, prefix: '£', suffix: 'k', decimals: 0, label: 'Borrowed' },
      { _key: 'cs2', target: 5.2, prefix: '', suffix: '%', decimals: 1, label: '5-yr fix' },
      { _key: 'cs3', target: 85, prefix: '', suffix: '%', decimals: 0, label: 'LTV' },
      { _key: 'cs4', target: 38, prefix: '', suffix: ' days', decimals: 0, label: 'To offer' },
    ],
    pullQuote: "They read my business, not just my paperwork. I wish I'd started here.",
    quoteAttribution: 'Sarah, freelance illustrator, Bristol',
  })
  docCount++

  // Freelancer fair
  await upsert({
    _id: 'kf-freelancer-fair',
    _type: 'kf_freelancerFair',
    heading: 'Come say hi at a *freelancer* fair.',
    lede: "If you'd rather meet your advisor before booking a call, we run a stand at most UK self-employed events. No appointment needed, just walk up and ask for Amira or Tom.",
    ...(fairImg ? { photo: fairImg } : {}),
    photoAlt: 'Amira Patel and Tom Chen at the Kingfisher Mortgages stand, Freelancer Fair Manchester',
    photoCaption: 'Amira Patel and Tom Chen, Freelancer Fair, Manchester, March 2026.',
    events: [
      { _key: 'e1', month: 'MAR', name: 'Freelancer Fair', city: 'Manchester', stand: 'Stand 14' },
      { _key: 'e2', month: 'MAY', name: 'UK Contractors Summit', city: 'Olympia London', stand: 'Stand B7' },
      { _key: 'e3', month: 'OCT', name: 'Self-Employed Live', city: 'Birmingham', stand: 'Stand 22' },
    ],
  })
  docCount++

  // Product band: Remortgage
  await upsert({
    _id: 'kf-product-remortgage',
    _type: 'kf_productBand',
    slug: { _type: 'slug', current: 'remortgage' },
    eyebrow: 'Remortgage - Self-employed',
    heading: 'Remortgage that looks past PAYE.',
    body: 'If your mortgage was arranged before you went self-employed, your current lender may not offer you a competitive deal at renewal. We find remortgage options that assess your real income - not just your most recent payslip.',
    featureRows: [],
    checklist: [
      'Customers saved £2,400 a year on average moving off SVR last quarter.',
      'We search the whole of our specialist panel, not just the big banks.',
      'No credit check to get an indicative rate.',
    ],
    ctaLabel: 'See your remortgage options',
    ctaHref: '/contact/?product=remortgage',
    trustNote: 'No credit check. Five-minute form.',
    ...(remortgageImg ? { image: remortgageImg } : {}),
    imageAlt: 'Stone cottage - remortgage',
    imagePosition: 'right',
  })
  docCount++

  // Product band: BTL
  await upsert({
    _id: 'kf-product-btl',
    _type: 'kf_productBand',
    slug: { _type: 'slug', current: 'buy-to-let' },
    eyebrow: 'Buy-to-let · Self-employed landlords',
    heading: "Buy-to-let that counts your *real* income.",
    body: "Day rates, dividend income, retained profit. All the things your bank pretends don't exist. We work with lenders who underwrite on how your business actually makes money. From 75% loan-to-value on contractor income.",
    featureRows: [
      { _key: 'fr1', label: 'Accepted', line: 'Personal name or SPV limited company' },
      { _key: 'fr2', label: 'Accepted', line: 'Portfolio landlords welcome (4+ properties)' },
      { _key: 'fr3', label: 'Accepted', line: 'HMO and holiday-let lenders on our panel' },
    ],
    checklist: [],
    ctaLabel: 'Check your BTL eligibility',
    ctaHref: '/contact/?product=btl',
    trustNote: 'Rental stress-test included.',
    ...(btlImg ? { image: btlImg } : {}),
    imageAlt: 'Classic London white-stucco terraced houses in soft daylight',
    imageCaption: 'Pimlico, three-flat conversion.',
    imagePosition: 'right',
  })
  docCount++

  // FAQ
  await upsert({
    _id: 'kf-faq',
    _type: 'kf_faq',
    heading: 'Awkward\nquestions,\n*answered.*',
    items: [
      { _key: 'faq1', question: "I've been turned down twice. Can you actually help?", answer: "Probably, yes. Most of our clients come to us after at least one rejection. High street banks tend to run a single model of affordability. We work with a dozen models across the specialist market, and we know which lenders use each. Rejection at your bank is almost never the end of the story." },
      { _key: 'faq2', question: 'How much can I borrow as a freelancer?', answer: "Usually 4.5 to 5.5 times your proven income, depending on the lender and the deposit. Send us your numbers and we'll give you a real answer on the first call, not a generic calculator guess." },
      { _key: 'faq3', question: 'Can I apply with less than two years of accounts?', answer: "Often yes. A handful of lenders accept 12 months of accounts. A smaller handful accept signed contracts with no trading history at all, particularly for professional contractors. Your first 15 minute chat will tell you which category you're in." },
      { _key: 'faq4', question: 'Do you work with limited company directors, not just sole traders?', answer: "Yes. Directors are one of the groups high street banks treat most harshly. Their underwriting models tend to look only at salary plus declared dividends and ignore profit retained inside the company. Our specialist lenders read your full accounts, so retained profit counts toward affordability. For most directors this meaningfully raises what they can borrow." },
      { _key: 'faq5', question: 'My income varies month to month. Does that matter?', answer: "Less than you'd think. Specialist self-employed lenders look at averages and trends across 12 to 24 months, not any single month. A strong run followed by a quiet quarter is normal for freelancers and contractors, and the right lender won't penalise it. What matters is the story your accounts tell over time." },
      { _key: 'faq6', question: "What's your fee?", answer: "£495 on completion. Nothing if we can't get you an offer. We also receive a commission from the lender once your mortgage completes, which we always disclose in writing before you commit to anything." },
      { _key: 'faq7', question: 'How long does the whole thing take?', answer: "From first chat to mortgage offer, four to six weeks is typical. From offer to completion depends on your conveyancer and the vendor, usually another four to six weeks. We'll give you a realistic timeline on the first call." },
      { _key: 'faq8', question: "What if I'm declined again?", answer: "We'll tell you why. If it's a fixable issue (employment history gap, a credit blip, a recent change of trading status) we help you sort it and reapply with a different lender. If it's structural (not enough income yet, major adverse credit) we tell you straight and give you a roadmap for when to try again." },
      { _key: 'faq9', question: 'What documents will I need?', answer: "For most applications: two years of SA302s or your latest limited company accounts, three months of business and personal bank statements, photo ID and proof of address, and a CV if you're a contractor. We send you a clean checklist tailored to the lender we're approaching, never a generic 50-item demand." },
      { _key: 'faq10', question: 'Can we do this entirely remotely?', answer: "Yes. Fifteen-minute intro call on your phone. Everything after that by email and e-signed PDFs. Most clients never meet us in person, and it doesn't affect the process or the rates you get. If you'd rather meet, we'll come to a coffee shop near you, not the other way around." },
    ],
  })
  docCount++

  // Final CTA
  await upsert({
    _id: 'kf-final-cta',
    _type: 'kf_finalCta',
    heading: 'Still renting because your bank said no?',
    body: 'Fifteen minutes. No application forms. No sales pressure. If we can help, we will tell you. If we cannot, we will tell you that too.',
    ctaLabel: 'Book a 15-min chat',
    ctaHref: '#',
    testimonialQuote: 'I had been told no so many times I stopped trying. Kingfisher found me an offer in two weeks. I genuinely could not believe it.',
    testimonialName: 'Daniel M.',
    testimonialRole: 'IT contractor, Manchester',
    testimonialInitials: 'DM',
  })
  docCount++

  console.log(`\nDone -- ${docCount} docs, ${assetCount} assets uploaded.`)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
