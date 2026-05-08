'use client'

import { useEffect, useRef } from 'react'

export default function NoRightClick({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const block = (e: MouseEvent) => e.preventDefault()
    el.addEventListener('contextmenu', block, true)
    return () => el.removeEventListener('contextmenu', block, true)
  }, [])

  return <div ref={ref}>{children}</div>
}
