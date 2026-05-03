import { defineField, defineType } from 'sanity'

export const howItWorks = defineType({
  name: 'kf_howItWorks',
  title: 'How It Works Section',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section heading',
      type: 'string',
      description: 'e.g. "From stuck to keys in four to six weeks."',
    }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'number', type: 'string', title: 'Step number', description: 'e.g. "01"' },
            { name: 'label', type: 'string', title: 'Step label', description: 'e.g. "Step one"' },
            { name: 'heading', type: 'string', title: 'Step heading' },
            { name: 'body', type: 'text', title: 'Step body' },
          ],
        },
      ],
    }),
  ],
})
