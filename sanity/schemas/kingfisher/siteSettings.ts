import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'kf_siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site name',
      type: 'string',
    }),
    defineField({
      name: 'logoLight',
      title: 'Logo (light)',
      type: 'image',
      description: 'Used on dark backgrounds (footer)',
    }),
    defineField({
      name: 'logoDark',
      title: 'Logo (dark)',
      type: 'image',
      description: 'Used on light backgrounds (nav)',
    }),
    defineField({
      name: 'navLinks',
      title: 'Nav links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label' },
            { name: 'href', type: 'string', title: 'href' },
            { name: 'isCta', type: 'boolean', title: 'CTA style?' },
          ],
        },
      ],
    }),
    defineField({
      name: 'footerTagline',
      title: 'Footer tagline',
      type: 'string',
      description: 'e.g. "From Brighton, working nationwide, with care."',
    }),
    defineField({
      name: 'footerBlurb',
      title: 'Footer brand blurb',
      type: 'text',
    }),
    defineField({
      name: 'email',
      title: 'Contact email',
      type: 'string',
    }),
    defineField({
      name: 'fcaReference',
      title: 'FCA reference number',
      type: 'string',
    }),
    defineField({
      name: 'companyNumber',
      title: 'Company number',
      type: 'string',
    }),
    defineField({
      name: 'riskWarning',
      title: 'Regulatory risk warning',
      type: 'text',
    }),
    defineField({
      name: 'footerPages',
      title: 'Footer page links',
      type: 'array',
      of: [{ type: 'object', fields: [{ name: 'label', type: 'string' }, { name: 'href', type: 'string' }] }],
    }),
    defineField({
      name: 'footerLegal',
      title: 'Footer legal links',
      type: 'array',
      of: [{ type: 'object', fields: [{ name: 'label', type: 'string' }, { name: 'href', type: 'string' }] }],
    }),
  ],
})
