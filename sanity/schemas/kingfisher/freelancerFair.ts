import { defineField, defineType } from 'sanity'

export const freelancerFair = defineType({
  name: 'kf_freelancerFair',
  title: 'Freelancer Fair Section',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'e.g. "Come say hi at a freelancer fair."',
    }),
    defineField({
      name: 'lede',
      title: 'Lede',
      type: 'text',
    }),
    defineField({
      name: 'photo',
      title: 'Fair photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'photoAlt',
      title: 'Photo alt text',
      type: 'string',
    }),
    defineField({
      name: 'photoCaption',
      title: 'Photo caption',
      type: 'string',
    }),
    defineField({
      name: 'events',
      title: 'Events',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'month', type: 'string', title: 'Month abbreviation', description: 'e.g. "MAR"' },
            { name: 'name', type: 'string', title: 'Event name' },
            { name: 'city', type: 'string', title: 'City' },
            { name: 'stand', type: 'string', title: 'Stand reference' },
          ],
        },
      ],
    }),
  ],
})
