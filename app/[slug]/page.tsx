import { getPortfolioPage, getportfoliopages } from '@/app/sanity/queries'
import { urlFor } from '@/app/sanity/image'
import { notFound } from 'next/navigation'
import GalleryGrid from '@/app/components/GalleryGrid'

export async function generateStaticParams() {
  const pages = await getportfoliopages()
  return pages.map((page: any) => ({ slug: page.slug.current }))
}

export default async function GalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPortfolioPage(slug)

  if (!page) notFound()

  const images = (page.galleryImages || []).map((item: any) => ({
    src: urlFor(item.image).width(800).quality(80).url(),
    alt: item.alt,
    caption: item.caption,
  }))

  const headerDesktop = page.headerImage
    ? urlFor(page.headerImage).width(1600).quality(80).url()
    : null
  const headerMobile = page.headerImageMobile
    ? urlFor(page.headerImageMobile).width(800).quality(80).url()
    : null

  return (
    <main>
        {/* Header image — desktop */}
        {headerDesktop && (
          <img
            src={headerDesktop}
            alt={page.headerImageAlt || page.title}
            className="w-full h-[60vh] object-cover hidden md:block px-4 md:px-8"
          />
        )}
        {/* Header image — mobile */}
        {headerMobile && (
          <img
            src={headerMobile}
            alt={page.headerImageMobileAlt || page.title}
            className="w-full h-[40vh] object-cover md:hidden px-4"
          />
        )}
        <h1 className="text-3xl font-light tracking-wide text-black px-4 md:px-8 py-8">{page.title}</h1>
        <div className="px-4 md:px-8 pb-8">
          <GalleryGrid images={images} />
        </div>
    </main>
  )
}
