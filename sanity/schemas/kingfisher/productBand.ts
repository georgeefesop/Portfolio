import { defineField, defineType } from 'sanity'

export const productBand = defineType({
  name: 'kf_productBand',
  title: 'Product Band (Remortgage / BTL)',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug / anchor ID',
      type: 'slug',
      options: { source: 'heading' },
      description: 'Used as the section id, e.g. "remortgage" or "buy-to-let"',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body copy',
      type: 'text',
    }),
    defineField({
      name: 'featureRows',
      title: 'Feature rows',
      type: 'array',
      description: 'Accepted/feature rows shown as a definition list',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label', description: 'e.g. "Accepted"' },
            { name: 'line', type: 'string', title: 'Line' },
          ],
        },
      ],
    }),
    defineField({
      name: 'checklist',
      title: 'Checklist items (bullet list variant)',
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
    defineField({
      name: 'trustNote',
      title: 'Trust note',
      type: 'string',
      description: 'e.g. "No credit check. Five-minute form."',
    }),
    defineField({
      name: 'image',
      title: 'Section image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'imageAlt',
      title: 'Image alt text',
      type: 'string',
    }),
    defineField({
      name: 'imageCaption',
      title: 'Image caption',
      type: 'string',
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image position in grid',
      type: 'string',
      options: { list: ['left', 'right'] },
    }),
  ],
})
