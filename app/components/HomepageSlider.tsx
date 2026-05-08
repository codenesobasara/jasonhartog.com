'use client'

import { useRef, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { urlFor } from '@/app/sanity/image'

export default function HomepageSlider({ pages }: { pages: any[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true })
  const router = useRouter()
  const dragged = useRef(false)

  const onPointerDown = useCallback(() => {
    dragged.current = false
  }, [])

  const onPointerMove = useCallback(() => {
    dragged.current = true
  }, [])

  const handleClick = useCallback((slug: string) => {
    if (!dragged.current) {
      router.push(`/${slug}`)
    }
  }, [router])

  return (
    <>
      {/* Desktop / landscape: horizontal slider */}
      <div className="relative overflow-hidden h-[calc(100dvh-var(--nav-height))] hidden landscape:block" ref={emblaRef}>
        <div className="flex gap-8 h-full">
          {pages.map((page) => (
            <div
              key={page.slug.current}
              className="relative flex-none h-full cursor-pointer"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onClick={() => handleClick(page.slug.current)}
            >
              <img
                className="h-full w-auto"
                src={urlFor(page.mainImage).width(1200).quality(80).url()}
                alt={page.mainImageAlt}
                draggable={false}
              />
              <span className="absolute bottom-8 left-8 text-white text-xl">{page.categoryLabel}</span>
            </div>
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

      {/* Portrait: stacked images with overlay */}
      <div className="flex flex-col gap-6 px-4 py-6 landscape:hidden">
        {pages.map((page) => (
          <Link key={page.slug.current} href={`/${page.slug.current}`} className="relative block">
            <img
              className="w-full h-auto"
              src={urlFor(page.mainImage).width(800).quality(80).url()}
              alt={page.mainImageAlt}
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <span className="text-white/80 text-lg uppercase tracking-widest font-light">
                View {page.categoryLabel}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
