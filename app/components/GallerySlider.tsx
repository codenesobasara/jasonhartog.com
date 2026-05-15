'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

type GalleryImage = {
  src: string
  alt: string
  caption?: string
}

export default function GallerySlider({ images, imageBorder }: { images: GalleryImage[]; imageBorder?: boolean }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const currentX = useRef(0)
  const targetX = useRef(0)
  const rafRef = useRef<number>(0)
  const dragged = useRef(false)
  const dragStart = useRef({ x: 0, scrollX: 0 })
  const isDragging = useRef(false)
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const getMax = () => {
    if (!trackRef.current || !viewportRef.current) return 0
    return Math.max(0, trackRef.current.scrollWidth - viewportRef.current.clientWidth)
  }

  const clamp = (v: number) => Math.min(0, Math.max(-getMax(), v))

  // Single RAF loop — smoothly chases targetX
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

  // Wheel — just moves the target
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

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open) return
      const step = window.innerWidth * 0.6
      if (e.key === 'ArrowRight') targetX.current = clamp(targetX.current - step)
      if (e.key === 'ArrowLeft') targetX.current = clamp(targetX.current + step)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const handleClick = useCallback((i: number) => {
    if (!dragged.current) { setIndex(i); setOpen(true) }
  }, [])

  return (
    <>
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
          {images.map((item, i) => (
            <div key={i} className="relative flex-none h-full" onClick={() => handleClick(i)}>
              <img
                className={`h-full w-auto pointer-events-none select-none${imageBorder ? ' border border-gray-300' : ''}`}
                src={item.src}
                alt={item.alt}
                draggable={false}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
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

      <div className="flex flex-col gap-6 px-4 py-6 landscape:hidden">
        {images.map((item, i) => (
          <img
            key={i}
            className={`w-full h-auto cursor-pointer${imageBorder ? ' border border-gray-300' : ''}`}
            src={item.src}
            alt={item.alt}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
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
