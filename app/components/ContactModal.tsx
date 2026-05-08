'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const turnstileRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const renderWidget = useCallback(() => {
    if (!turnstileRef.current || !window.turnstile || widgetIdRef.current) return

    widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
      callback: (token: string) => setTurnstileToken(token),
      'expired-callback': () => setTurnstileToken(null),
      'error-callback': () => setTurnstileToken(null),
    })
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      dialog.showModal()
      // Render Turnstile when modal opens (script may already be loaded)
      setTimeout(renderWidget, 100)
    } else {
      dialog.close()
      // Clean up widget when modal closes
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
        setTurnstileToken(null)
      }
    }
  }, [open, renderWidget])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onReady={renderWidget}
      />
      <dialog
        ref={dialogRef}
        className="fixed inset-0 z-50 m-auto w-full max-w-lg bg-white p-8 backdrop:bg-black/50"
        onClick={(e) => {
          if (e.target === dialogRef.current) onClose()
        }}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-light text-black">Contact</h2>
            <button onClick={onClose} className="text-black text-2xl leading-none">&times;</button>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const form = e.currentTarget
              const honeypot = (form.elements.namedItem('website') as HTMLInputElement).value
              if (honeypot) return
              if (!turnstileToken) return
              // Form submission TBD — include turnstileToken for server-side verification
            }}
            className="flex flex-col gap-4"
          >
            {/* Honeypot — invisible to real users, bots will fill it in */}
            <input
              type="text"
              name="website"
              autoComplete="off"
              tabIndex={-1}
              aria-hidden="true"
              className="absolute -left-[9999px] opacity-0 h-0 w-0 overflow-hidden"
            />
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              className="border border-gray-300 px-4 py-3 text-black text-sm"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="border border-gray-300 px-4 py-3 text-black text-sm"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone (optional)"
              className="border border-gray-300 px-4 py-3 text-black text-sm"
            />
            <textarea
              name="message"
              placeholder="Message"
              required
              rows={5}
              className="border border-gray-300 px-4 py-3 text-black text-sm resize-none"
            />
            <div ref={turnstileRef} />
            <button
              type="submit"
              disabled={!turnstileToken}
              className="bg-black text-white py-3 text-sm tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      </dialog>
    </>
  )
}
