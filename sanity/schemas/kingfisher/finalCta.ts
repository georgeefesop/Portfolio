import { defineField, defineType } from 'sanity'

export const finalCta = defineType({
  name: 'kf_finalCta',
  title: 'Final CTA Section',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'e.g. "Still renting because your bank said no?"',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA label',
      type: 'string',
    }),
    defineField({
      name: 'ctaHref',
      title: 'CTA href',
      type: 'string',
    }),
    defineField({
      name: 'testimonialQuote',
      title: 'Social proof quote',
      type: 'text',
    }),
    defineField({
      name: 'testimonialName',
      title: 'Testimonial name',
      type: 'string',
    }),
    defineField({
      name: 'testimonialRole',
      title: 'Testimonial role / location',
      type: 'string',
    }),
    defineField({
      name: 'testimonialInitials',
      title: 'Testimonial avatar initials',
      type: 'string',
    }),
  ],
})
