'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ContactModal from './ContactModal'

type PortfolioLink = {
  title: string
  slug: { current: string }
}

type SiteSettings = {
  siteName?: string
  logo?: any
  logoAlt?: string
} | null

export default function NavClient({
  settings,
  logoUrl,
  portfolioPages,
}: {
  settings: SiteSettings
  logoUrl: string | null
  portfolioPages: PortfolioLink[]
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => {
    const handler = () => setContactOpen(true)
    document.addEventListener('open-contact', handler)
    return () => document.removeEventListener('open-contact', handler)
  }, [])

  return (
    <>
      <nav className="flex items-center justify-between px-4 md:px-8 h-[var(--nav-height)] flex-none bg-white relative z-40">
        {/* Left: Site identity */}
        <Link href="/">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={settings?.logoAlt || settings?.siteName || 'Home'}
              className="h-12 w-auto"
            />
          ) : (
            <span className="text-xl font-light tracking-wide text-black">
              {settings?.siteName || 'Jason Hartog'}
            </span>
          )}
        </Link>

        {/* Right: Nav links */}
        <div className="flex items-center gap-8 text-sm text-black">
          {/* Our Work dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button className="tracking-wide hover:opacity-60 transition-opacity">
              Our Work
            </button>
            {dropdownOpen && (
              <div className="absolute top-full right-0 bg-white shadow-md py-2 min-w-48">
                {portfolioPages.map((page) => (
                  <Link
                    key={page.slug.current}
                    href={`/${page.slug.current}`}
                    className="block px-6 py-2 hover:bg-gray-50 whitespace-nowrap"
                  >
                    {page.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/about" className="tracking-wide hover:opacity-60 transition-opacity">
            About
          </Link>

          <button
            onClick={() => setContactOpen(true)}
            className="tracking-wide hover:opacity-60 transition-opacity"
          >
            Contact
          </button>
        </div>
      </nav>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  )
}
