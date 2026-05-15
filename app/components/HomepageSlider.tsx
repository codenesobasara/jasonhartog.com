'use client'

import { useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { urlFor } from '@/app/sanity/image'

export default function HomepageSlider({ pages }: { pages: any[] }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const currentX = useRef(0)
  const targetX = useRef(0)
  const rafRef = useRef<number>(0)
  const router = useRouter()
  const dragged = useRef(false)
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, scrollX: 0 })

  const getMax = () => {
    if (!trackRef.current || !viewportRef.current) return 0
    return Math.max(0, trackRef.current.scrollWidth - viewportRef.current.clientWidth)
  }

  const clamp = (v: number) => Math.min(0, Math.max(-getMax(), v))

  // RAF loop — smoothly chases targetX
  useEffect(() => {
    const tick = () => {
      const dx = targetX.current - currentX.current
      currentX.current += dx * 0.08
      if (Math.abs(dx) < 0.5) currentX.current = targetX.current
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${currentX.current}px,0,0)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Wheel
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      targetX.current = clamp(targetX.current - d * 1.5)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const step = window.innerWidth * 0.6
      if (e.key === 'ArrowRight') targetX.current = clamp(targetX.current - step)
      if (e.key === 'ArrowLeft') targetX.current = clamp(targetX.current + step)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Drag
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragged.current = false
    isDragging.current = true
    dragStart.current = { x: e.clientX, scrollX: targetX.current }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return
    const dx = e.clientX - dragStart.current.x
    if (Math.abs(dx) > 3) dragged.current = true
    targetX.current = clamp(dragStart.current.scrollX + dx)
  }, [])

  const onPointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  const handleClick = useCallback((slug: string) => {
    if (!dragged.current) {
      router.push(`/${slug}`)
    }
  }, [router])

  return (
    <>
      {/* Desktop / landscape: horizontal slider */}
      <div
        ref={viewportRef}
        className="relative overflow-hidden h-[calc(100dvh-var(--nav-height)-20px)] hidden landscape:block pb-[20px] cursor-grab active:cursor-grabbing"
      >
        <div
          ref={trackRef}
          className="flex gap-2 h-full will-change-transform"
          style={{ transform: 'translate3d(0,0,0)' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          {pages.map((page, i) => (
            <div
              key={page.slug.current}
              className="relative flex-none h-full"
              onClick={() => handleClick(page.slug.current)}
            >
              <img
                className="h-full w-auto pointer-events-none select-none"
                src={urlFor(page.mainImage).height(1400).quality(82).auto('format').url()}
                alt={page.mainImageAlt}
                draggable={false}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
              <span className="absolute bottom-8 left-8 text-white text-xl bg-gray-600/20 px-4 py-2 backdrop-blur-sm rounded-lg">{page.categoryLabel}</span>
            </div>
          ))}
        </div>
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 text-white p-10 rounded-full z-10"
          onClick={() => { targetX.current = clamp(targetX.current + window.innerWidth * 0.6) }}
        >
          &#8592;
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 text-white p-10 rounded-full z-10"
          onClick={() => { targetX.current = clamp(targetX.current - window.innerWidth * 0.6) }}
        >
          &#8594;
        </button>
      </div>

      {/* Portrait: stacked images with overlay */}
      <div className="flex flex-col gap-6 px-4 py-6 landscape:hidden">
        {pages.map((page, i) => (
          <Link key={page.slug.current} href={`/${page.slug.current}`} className="relative block">
            <img
              className="w-full h-auto"
              src={urlFor(page.mainImage).height(1400).quality(82).auto('format').url()}
              alt={page.mainImageAlt}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
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
