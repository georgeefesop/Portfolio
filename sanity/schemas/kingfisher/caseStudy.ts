import { defineField, defineType } from 'sanity'

export const caseStudy = defineType({
  name: 'kf_caseStudy',
  title: 'Case Study Section',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'e.g. "A recent case"',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body copy',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'heroImage',
      title: 'Case study image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroImageAlt',
      title: 'Image alt text',
      type: 'string',
    }),
    defineField({
      name: 'stats',
      title: 'Stats (animated counters)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'target', type: 'number', title: 'Target value' },
            { name: 'prefix', type: 'string', title: 'Prefix', description: 'e.g. "+" or "£"' },
            { name: 'suffix', type: 'string', title: 'Suffix', description: 'e.g. "k" or "%"' },
            { name: 'decimals', type: 'number', title: 'Decimal places' },
            { name: 'label', type: 'string', title: 'Stat label' },
          ],
        },
      ],
    }),
    defineField({
      name: 'pullQuote',
      title: 'Pull quote',
      type: 'text',
    }),
    defineField({
      name: 'quoteAttribution',
      title: 'Quote attribution',
      type: 'string',
    }),
  ],
})
