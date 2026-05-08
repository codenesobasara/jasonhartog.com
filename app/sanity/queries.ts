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

export async function getSiteSettings() {
  return client.fetch(`
    *[_type == "siteSettings"][0] {
      siteName,
      logo,
      logoAlt
    }
  `)
}

export async function getPortfolioPage(slug: string) {
  return client.fetch(`
    *[_type == "portfolioPage" && slug.current == $slug][0] {
      title,
      slug,
      headerImage,
      headerImageAlt,
      headerImageMobile,
      headerImageMobileAlt,
      galleryImages[] {
        image,
        alt,
        caption
      }
    }
  `, { slug })
}

export async function getAboutPage() {
  return client.fetch(`
    *[_type == "aboutPage"][0] {
      name,
      quote,
      headshot,
      headshotAlt,
      bio,
      clients,
      testimonials[] {
        quote,
        clientName,
        clientTitle
      }
    }
  `)
}
    
