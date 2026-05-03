import { defineField, defineType } from 'sanity'

export const marquee = defineType({
  name: 'kf_marquee',
  title: 'Marquee Stats Bar',
  type: 'document',
  fields: [
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', type: 'string', title: 'Value', description: 'e.g. "2.1bn" or "92%"' },
            { name: 'label', type: 'string', title: 'Label', description: 'e.g. "lent to the self-employed"' },
          ],
        },
      ],
    }),
  ],
})
