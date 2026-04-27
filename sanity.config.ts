  'use client'

  import { defineConfig } from 'sanity'                                                                                                                                       
  import { structureTool } from 'sanity/structure'                                                                                                                            
  import { schemaTypes } from './app/sanity/schemas'                                                                                                                              
                                                                                                                                                                            
  export default defineConfig({
    name: 'jasonhartog',
    title: 'Jason Hartog Photography',
    projectId: '9jt26sz2',
    dataset: 'jasonhartog',
    basePath: '/studio',
    plugins: [structureTool()],
    schema: {
      types: schemaTypes,
    },
  })