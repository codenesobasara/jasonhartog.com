import { getPortfolioPage, getportfoliopages } from '@/app/sanity/queries'
import { urlFor, srcSetFor, landscapeSizesFor } from '@/app/sanity/image'
import { notFound } from 'next/navigation'
import GallerySlider from '@/app/components/GallerySlider'

export async function generateStaticParams() {
  const pages = await getportfoliopages()
  return pages.map((page: any) => ({ slug: page.slug.current }))
}

export default async function GalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPortfolioPage(slug)

  if (!page) notFound()

  const images = (page.galleryImages || []).map((item: any) => ({
    src: urlFor(item.image).width(1920).quality(82).auto('format').fit('max').url(),
    srcSet: srcSetFor(item.image, 82),
    landscapeSizes: landscapeSizesFor(item.image),
    alt: item.alt,
    caption: item.caption,
  }))

  return (
    <main className="flex-1 min-h-0 overflow-hidden">
      <GallerySlider images={images} imageBorder={slug === 'personal-projects'} />
    </main>
  )
}
