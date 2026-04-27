  import { defineType, defineField } from 'sanity'                                                                                                          
   
  export const aboutPage = defineType({                                                                                                                     
    name: 'aboutPage',                                                                                                                                    
    title: 'About Page',
    type: 'document',
    fields: [
      defineField({
        name: 'name',
        title: 'Name',
        type: 'string',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'headshot',
        title: 'Headshot',
        type: 'image',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'headshotAlt',
        title: 'Headshot Alt Text',
        type: 'string',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'bio',
        title: 'Bio',
        type: 'blockContent',
      }),
      defineField({
        name: 'testimonials',
        title: 'Testimonials',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              defineField({ name: 'quote', title: 'Quote', type: 'text', validation: (rule) => rule.required() }),
              defineField({ name: 'clientName', title: 'Client Name', type: 'string', validation: (rule) => rule.required() }),
              defineField({ name: 'clientTitle', title: 'Client Title', type: 'string' }),
            ],
          },
        ],
      }),
    ],
  })