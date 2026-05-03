import { defineField, defineType } from 'sanity'

export const audiences = defineType({
  name: 'kf_audiences',
  title: 'Audiences Section',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Section heading',
      type: 'string',
      description: 'e.g. "Whatever self-employed looks like for you."',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
    }),
    defineField({
      name: 'cards',
      title: 'Audience cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'number', type: 'string', title: 'Number', description: 'e.g. "01"' },
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'description', type: 'text', title: 'Description' },
            { name: 'linkLabel', type: 'string', title: 'Link label' },
            { name: 'linkHref', type: 'string', title: 'Link href' },
          ],
        },
      ],
    }),
  ],
})
