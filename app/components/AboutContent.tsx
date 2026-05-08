'use client'

import { PortableText } from 'next-sanity'

type Testimonial = {
  quote: string
  clientName: string
  clientTitle?: string
}

export default function AboutContent({
  bio,
  clients,
  testimonials,
}: {
  bio: any
  clients: string[] | null
  testimonials: Testimonial[] | null
}) {
  return (
    <div>
      {/* Bio */}
      {bio && (
        <div className="prose prose-sm text-black max-w-none mt-8">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-black mb-4">Bio</h2>
          <PortableText value={bio} />
        </div>
      )}

      {/* Clients */}
      {clients && clients.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-black mb-6">Clients</h2>
          <ul className="flex flex-col gap-2">
            {clients.map((name, i) => (
              <li key={i} className="text-sm text-gray-700">{name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-black mb-8">Clients and Testimonials</h2>
          <div className="flex flex-col gap-6">
            {testimonials.map((t, i) => (
              <blockquote key={i} className="bg-gray-50 p-6">
                <p className="text-sm text-gray-700 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 text-sm font-medium text-black">
                  {t.clientName}
                  {t.clientTitle && (
                    <span className="text-gray-500 uppercase text-xs ml-2">{t.clientTitle}</span>
                  )}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      )}

      {/* Contact button */}
      <div className="mt-16">
        <button
          onClick={() => document.dispatchEvent(new CustomEvent('open-contact'))}
          className="bg-black text-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors"
        >
          Contact
        </button>
      </div>
    </div>
  )
}
