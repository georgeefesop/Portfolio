import { defineField, defineType } from 'sanity'

export const calculator = defineType({
  name: 'kf_calculator',
  title: 'Calculator Section',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'e.g. "What could you actually afford?"',
    }),
    defineField({
      name: 'lede',
      title: 'Lede',
      type: 'text',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'e.g. "Based on self-employed income"',
    }),
    defineField({
      name: 'defaultIncome',
      title: 'Default annual income',
      type: 'number',
    }),
    defineField({
      name: 'defaultDeposit',
      title: 'Default deposit',
      type: 'number',
    }),
    defineField({
      name: 'defaultTermYears',
      title: 'Default term (years)',
      type: 'number',
    }),
    defineField({
      name: 'incomeMultiplier',
      title: 'Income multiplier for indicative borrowing',
      type: 'number',
      description: 'e.g. 3.94 to arrive at ~284k from 72k',
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
      name: 'disclaimer',
      title: 'Disclaimer',
      type: 'text',
    }),
  ],
})
