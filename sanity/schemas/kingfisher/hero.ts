import { defineField, defineType } from 'sanity'

export const hero = defineType({
  name: 'kf_hero',
  title: 'Hero Section',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow label',
      type: 'string',
      description: 'e.g. "SPECIALIST MORTGAGES"',
    }),
    defineField({
      name: 'headlineLine1',
      title: 'Headline line 1',
      type: 'string',
      description: 'e.g. "The bank said no."',
    }),
    defineField({
      name: 'headlineLine2',
      title: 'Headline line 2 (italic)',
      type: 'string',
      description: 'e.g. "So we said fine."',
    }),
    defineField({
      name: 'lede',
      title: 'Lede paragraph',
      type: 'text',
    }),
    defineField({
      name: 'ctaPrimary',
      title: 'Primary CTA label',
      type: 'string',
    }),
    defineField({
      name: 'ctaPrimaryHref',
      title: 'Primary CTA href',
      type: 'string',
    }),
    defineField({
      name: 'ctaSubtext',
      title: 'CTA subtext',
      type: 'string',
      description: 'e.g. "Fifteen minutes. No application forms. No sales pressure."',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroImageAlt',
      title: 'Hero image alt text',
      type: 'string',
    }),
    defineField({
      name: 'rateBadgeLabel',
      title: 'Rate badge label',
      type: 'string',
      description: 'e.g. "Best 5-yr fix today"',
    }),
    defineField({
      name: 'rateBadgeValue',
      title: 'Rate badge value',
      type: 'string',
      description: 'e.g. "4.09%"',
    }),
    defineField({
      name: 'rateBadgeTag',
      title: 'Rate badge tag',
      type: 'string',
      description: 'e.g. "Live - self-employed"',
    }),
    defineField({
      name: 'lenderLogos',
      title: 'Lender logos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Lender name' },
            { name: 'logo', type: 'image', title: 'Logo SVG/PNG' },
          ],
        },
      ],
    }),
    defineField({
      name: 'lenderCountSuffix',
      title: 'Lender count suffix',
      type: 'string',
      description: 'e.g. "+ 47 more"',
    }),
  ],
})
