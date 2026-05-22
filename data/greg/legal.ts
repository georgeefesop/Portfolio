/**
 * Legal page content for greg.efesop.com.
 *
 * Standard, plain-English privacy and terms for a small Cyprus building
 * company. Have a lawyer review before launch if you want certainty - this
 * is a sensible starting point, not formal legal advice.
 */

import { GREG } from '@/lib/greg/site';

export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalDoc {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

export const privacyContent: LegalDoc = {
  title: 'Privacy Policy',
  updated: 'May 2026',
  intro: `This policy explains how ${GREG.company} handles personal information collected through ${GREG.siteUrl}.`,
  sections: [
    {
      heading: 'Who we are',
      body: [
        `${GREG.company} is a company registered in Cyprus, registration number ${GREG.regNumber}, with its registered office at ${GREG.address}. For any question about your data, contact us at ${GREG.email}.`,
      ],
    },
    {
      heading: 'What we collect',
      body: [
        'When you contact us by WhatsApp, phone or email, we receive the contact details and project information you choose to share.',
        'When you make a payment, our payment processor Stripe handles your card details. We never see or store full card numbers. We do receive your name, email address, the amount paid and what the payment was for.',
        'When you browse the site we use privacy-friendly analytics to understand how the site is used, such as which pages are visited. This data is aggregated and is not used to identify you personally.',
      ],
    },
    {
      heading: 'Why we use it',
      body: [
        'We use your information to respond to enquiries, prepare quotes, carry out agreed work, process payments, keep proper business records, and improve the website. Our legal bases are performing a contract with you, our legitimate interest in running the business, and your consent for analytics.',
      ],
    },
    {
      heading: 'Who we share it with',
      body: [
        'We share information only with the service providers that make the site and payments work: Stripe for payment processing, PostHog for website analytics, and Vercel for website hosting. We do not sell your personal information to anyone.',
      ],
    },
    {
      heading: 'How long we keep it',
      body: [
        'We keep enquiry and project information for as long as needed to provide our services and to meet legal and tax obligations under Cyprus law. Analytics data is retained only in aggregate form.',
      ],
    },
    {
      heading: 'Your rights',
      body: [
        `Under the GDPR you can ask to see the personal information we hold about you, ask us to correct or delete it, and object to certain uses. To make a request, email us at ${GREG.email}.`,
      ],
    },
    {
      heading: 'Cookies and analytics',
      body: [
        'The site uses PostHog for analytics, configured to be privacy-friendly and to avoid storing unnecessary cookies. You can block analytics through your browser settings if you prefer.',
      ],
    },
    {
      heading: 'Changes to this policy',
      body: [
        'We may update this policy from time to time. The date at the top shows when it was last changed.',
      ],
    },
  ],
};

export const termsContent: LegalDoc = {
  title: 'Terms of Use',
  updated: 'May 2026',
  intro: `These terms apply to your use of ${GREG.siteUrl}, the website of ${GREG.company}.`,
  sections: [
    {
      heading: 'Using this website',
      body: [
        'By using this website you agree to these terms. If you do not agree with them, please do not use the site.',
      ],
    },
    {
      heading: 'The information on this site',
      body: [
        'We work to keep the information on the site accurate and up to date, but we cannot guarantee it is complete or error-free. Service descriptions and project examples are for general information and do not form a contract.',
      ],
    },
    {
      heading: 'Quotes and building work',
      body: [
        'Any quote is given after we have understood the job, usually following a site visit, and is an estimate based on the information available at that time. The building work itself is governed by the separate agreement we make with you for that project, not by this website.',
      ],
    },
    {
      heading: 'Payments',
      body: [
        'Payments made through this site are processed securely by Stripe and charged in euro. You receive a receipt by email, and an invoice where requested. If you have a question about a payment or a refund, contact us and we will help.',
      ],
    },
    {
      heading: 'Intellectual property',
      body: [
        `The content, text and images on this website belong to ${GREG.company} unless stated otherwise, and may not be copied or reused without permission.`,
      ],
    },
    {
      heading: 'Limitation of liability',
      body: [
        'The website is provided as it is. To the extent allowed by law, we are not liable for any loss arising from the use of, or inability to use, this website. This does not affect your rights in relation to building work carried out for you.',
      ],
    },
    {
      heading: 'Governing law',
      body: [
        'These terms are governed by the law of the Republic of Cyprus.',
      ],
    },
    {
      heading: 'Contact',
      body: [`Questions about these terms can be sent to ${GREG.email}.`],
    },
  ],
};
