import {client} from '@/app/sanity/client'

export async function getportfoliopages() {
       return client.fetch(`                                                                                                                                                                                      
      *[_type == "portfolioPage"] | order(displayOrder asc) {                                                                                                                                                  
        title,                                                                                                                                                                                                 
        slug,                                                                                                                                                                                                
        displayOrder,
        mainImage,
        mainImageAlt,
        categoryLabel
      }
    `)
  }
    
