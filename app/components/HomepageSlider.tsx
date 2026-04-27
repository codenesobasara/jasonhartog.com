 'use client'

  import useEmblaCarousel from 'embla-carousel-react'
  import Link from 'next/link'
  import { urlFor } from '@/app/sanity/image'

  export default function HomepageSlider({ pages }: { pages: any[] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true })  

    return (
      <div className="relative overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {pages.map((page) => (
            <Link
              key={page.slug.current}
              href={`/${page.slug.current}`}
              className="relative flex-none h-[calc(100vh-80px)] ml-4"
            >
              <img
                className="h-full w-auto"
                src={urlFor(page.mainImage).width(1200).quality(80).url()}
                alt={page.mainImageAlt}
              />
              <span className="absolute bottom-8 left-8 text-white text-xl">{page.categoryLabel}</span>
            </Link>
          ))}
        </div>
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 text-white p-10 rounded-full"
          onClick={() => emblaApi?.scrollPrev()}
        >
          &#8592;
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 text-white p-10 rounded-full"
          onClick={() => emblaApi?.scrollNext()}
        >
          &#8594;
        </button>
      </div>
    )
  }