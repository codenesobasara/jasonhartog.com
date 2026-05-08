 import { defineType, defineField } from 'sanity'                                                                                                          
                                                                                                                                                            
  export const portfolioPage = defineType({                                                                                                                 
    name: 'portfolioPage',                                                                                                                                  
    title: 'Portfolio Page',                                                                                                                                
    type: 'document',
    fields: [                                                                                                                                               
      defineField({                                                                                                                                         
        name: 'title',                                                                                                                                      
        title: 'Title',                                                                                                                                     
        type: 'string',                                                                                                                                     
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: { source: 'title' },
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'displayOrder',
        title: 'Display Order',
        type: 'number',
        validation: (rule) => rule.required().min(1).max(4),
      }),
      defineField({
        name: 'mainImage',
        title: 'Main Image',
        type: 'image',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'mainImageAlt',
        title: 'Main Image Alt Text',
        type: 'string',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'categoryLabel',
        title: 'Category Label',
        type: 'string',
        description: 'Label shown on the homepage slider (can differ from title)',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'headerImage',
        title: 'Header Image (Desktop)',
        type: 'image',
        description: 'Wide horizontal banner displayed at the top of the gallery page. Use a landscape-oriented image sized around 1600×500px or similar wide aspect ratio.',
        options: { hotspot: true },
      }),
      defineField({
        name: 'headerImageAlt',
        title: 'Header Image Alt Text (Desktop)',
        type: 'string',
        hidden: ({ parent }) => !parent?.headerImage,
      }),
      defineField({
        name: 'headerImageMobile',
        title: 'Header Image (Mobile)',
        type: 'image',
        description: 'Header image shown on mobile devices. Use a portrait-oriented image sized around 800×1000px.',
        options: { hotspot: true },
      }),
      defineField({
        name: 'headerImageMobileAlt',
        title: 'Header Image Alt Text (Mobile)',
        type: 'string',
        hidden: ({ parent }) => !parent?.headerImageMobile,
      }),
      defineField({
        name: 'galleryImages',
        title: 'Gallery Images',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              defineField({ name: 'image', title: 'Image', type: 'image', validation: (rule) => rule.required() }),
              defineField({ name: 'alt', title: 'Alt Text', type: 'string', validation: (rule) => rule.required() }),
              defineField({ name: 'caption', title: 'Caption', type: 'string' }),
            ],
          },
        ],
      }),
    ],
  })