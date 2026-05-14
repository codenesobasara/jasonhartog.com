'use client'

import { useCallback, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

type GalleryImage = {
  src: string
  alt: string
  caption?: string
}

export default function GallerySlider({ images }: { images: GalleryImage[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true })
  const dragged = useRef(false)
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const onPointerDown = useCallback(() => {
    dragged.current = false
  }, [])

  const onPointerMove = useCallback(() => {
    dragged.current = true
  }, [])

  const handleClick = useCallback((i: number) => {
    if (!dragged.current) {
      setIndex(i)
      setOpen(true)
    }
  }, [])

  return (
    <>
      {/* Desktop / landscape: horizontal slider */}
      <div className="relative overflow-hidden h-[calc(100dvh-var(--nav-height))] hidden landscape:block" ref={emblaRef}>
        <div className="flex gap-8 h-full">
          {images.map((item, i) => (
            <div
              key={i}
              className="relative flex-none h-full cursor-pointer"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onClick={() => handleClick(i)}
            >
              <img
                className="h-full w-auto"
                src={item.src}
                alt={item.alt}
                draggable={false}
              />
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

      {/* Portrait: stacked images */}
      <div className="flex flex-col gap-6 px-4 py-6 landscape:hidden">
        {images.map((item, i) => (
          <img
            key={i}
            className="w-full h-auto cursor-pointer"
            src={item.src}
            alt={item.alt}
            onClick={() => { setIndex(i); setOpen(true) }}
          />
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map((item) => ({ src: item.src, alt: item.alt }))}
      />
    </>
  )
}
