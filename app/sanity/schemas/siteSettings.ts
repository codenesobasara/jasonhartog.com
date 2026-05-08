import { defineType, defineField } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      description: 'Displayed in the navigation bar when no logo is uploaded.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Optional. If uploaded, this replaces the site name text in the navigation bar.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'logoAlt',
      title: 'Logo Alt Text',
      type: 'string',
      description: 'Alt text for the logo image (for accessibility).',
      hidden: ({ parent }) => !parent?.logo,
    }),
  ],
  preview: {
    select: { title: 'siteName' },
  },
})
