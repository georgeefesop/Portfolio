import { defineField, defineType } from 'sanity'

export const faq = defineType({
  name: 'kf_faq',
  title: 'FAQ Section',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section heading',
      type: 'string',
      description: 'e.g. "Awkward questions, answered."',
    }),
    defineField({
      name: 'items',
      title: 'FAQ items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', type: 'string', title: 'Question' },
            { name: 'answer', type: 'text', title: 'Answer' },
          ],
        },
      ],
    }),
  ],
})
