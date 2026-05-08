'use client'

import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

type GalleryImage = {
  src: string
  alt: string
  caption?: string
}

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {images.map((item, i) => (
          <div key={i} className="mb-4 break-inside-avoid">
            <img
              src={item.src}
              alt={item.alt}
              className="w-full h-auto cursor-pointer"
              onClick={() => {
                setIndex(i)
                setOpen(true)
              }}
            />
            {item.caption && (
              <p className="text-sm text-gray-600 mt-2">{item.caption}</p>
            )}
          </div>
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
