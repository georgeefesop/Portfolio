import { defineField, defineType } from 'sanity'

export const receiptTestimonial = defineType({
  name: 'kf_receiptTestimonial',
  title: 'Receipt Testimonial Section',
  type: 'document',
  fields: [
    defineField({
      name: 'introText',
      title: 'Intro text',
      type: 'string',
      description: 'e.g. "Three high-street lenders. Same applicant. Same week."',
    }),
    defineField({
      name: 'declinedRows',
      title: 'Declined rows',
      type: 'array',
      description: 'The "bank: verdict" list. Mark winner=true for the Kingfisher row.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'bank', type: 'string', title: 'Bank name' },
            { name: 'verdict', type: 'string', title: 'Verdict', description: 'e.g. "declined." or "9 days."' },
            { name: 'isWinner', type: 'boolean', title: 'Is Kingfisher row?' },
          ],
        },
      ],
    }),
    defineField({
      name: 'outroText',
      title: 'Outro text',
      type: 'text',
    }),
    defineField({
      name: 'clientPhoto',
      title: 'Client photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'clientPhotoAlt',
      title: 'Client photo alt text',
      type: 'string',
    }),
    defineField({
      name: 'stats',
      title: 'Stats panel',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', type: 'string', title: 'Value', description: 'e.g. "420k" or "4.09%"' },
            { name: 'label', type: 'string', title: 'Label', description: 'e.g. "Borrowed"' },
          ],
        },
      ],
    }),
    defineField({
      name: 'clientAttribution',
      title: 'Client attribution',
      type: 'string',
      description: 'e.g. "Marcus T. - music producer - Bristol - 2026"',
    }),
  ],
})
