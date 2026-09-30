import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

const SRCSET_WIDTHS = [480, 640, 828, 1080, 1440, 1920, 2400]

// Original pixel dimensions, parsed from the asset ref ("...-8192x5464-jpg").
export function dimsFor(source: any): { width: number; height: number } | null {
  const ref: string | undefined =
    typeof source === 'string' ? source : source?.asset?._ref ?? source?.asset?._id
  const m = ref?.match(/-(\d+)x(\d+)-/)
  return m ? { width: Number(m[1]), height: Number(m[2]) } : null
}

// Width-descriptor srcset served straight from Sanity's CDN (WebP/AVIF via
// auto=format). Widths above the original are dropped so Sanity never upscales.
export function srcSetFor(source: any, quality = 80): string {
  const dims = dimsFor(source)
  const widths = dims ? SRCSET_WIDTHS.filter((w) => w <= dims.width) : SRCSET_WIDTHS
  return (widths.length ? widths : [dims!.width])
    .map(
      (w) =>
        `${urlFor(source).width(w).quality(quality).auto('format').fit('max').url()} ${w}w`,
    )
    .join(', ')
}

// sizes value for the landscape sliders, where images fill the viewport height
// (100dvh minus nav) and their rendered width follows from the aspect ratio.
export function landscapeSizesFor(source: any): string {
  const dims = dimsFor(source)
  const ar = dims ? dims.width / dims.height : 1.5
  return `calc((100dvh - 100px) * ${ar.toFixed(3)})`
}
