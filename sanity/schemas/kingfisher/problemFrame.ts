import { defineField, defineType } from 'sanity'

export const problemFrame = defineType({
  name: 'kf_problemFrame',
  title: 'Problem Framing Section',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow label',
      type: 'string',
      description: 'e.g. "HOW WE THINK DIFFERENTLY"',
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
      name: 'checklistEyebrow',
      title: 'Checklist eyebrow',
      type: 'string',
      description: 'e.g. "WHAT WE ACCEPT"',
    }),
    defineField({
      name: 'checklist',
      title: 'Checklist items',
      type: 'array',
      of: [{ type: 'string' }],
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
  ],
})
