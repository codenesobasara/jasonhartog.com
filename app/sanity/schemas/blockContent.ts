  import { defineType } from 'sanity'                                                                                                                                         
   
  export const blockContent = defineType({                                                                                                                                    
    name: 'blockContent',                                                                                                                                                   
    title: 'Block Content',
    type: 'array',
    of: [
      {
        type: 'block',
        styles: [{ title: 'Normal', value: 'normal' }],
        marks: {
          decorators: [
            { title: 'Bold', value: 'strong' },
            { title: 'Italic', value: 'em' },
          ],
          annotations: [
            {
              name: 'link',
              type: 'object',
              title: 'Link',
              fields: [{ name: 'href', type: 'url', title: 'URL' }],
            },
          ],
        },
      },
    ],
  })