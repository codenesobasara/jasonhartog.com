import { getAboutPage } from '@/app/sanity/queries'
import { urlFor } from '@/app/sanity/image'
import AboutContent from '@/app/components/AboutContent'

export default async function AboutPage() {
  const about = await getAboutPage()

  if (!about) {
    return (
      <main className="px-4 md:px-8 py-8">
        <p className="text-black">About page content coming soon.</p>
      </main>
    )
  }

  const headshotUrl = about.headshot
    ? urlFor(about.headshot).width(800).quality(80).url()
    : null

  return (
    <main className="flex flex-col md:flex-row h-[80dvh] overflow-hidden pl-8 md:pl-16">
      {/* Left: Image — 50% width, full height */}
      {headshotUrl && (
        <div className="md:w-1/2 flex-none">
          <img
            src={headshotUrl}
            alt={about.headshotAlt || about.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Right: Name, bio, testimonials stacked */}
      <div className="md:w-1/2 px-8 md:px-16 py-16 overflow-y-auto">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-black mb-4">{about.name}</h1>
        {about.quote && (
          <p className="text-sm italic text-gray-600 mb-8">{about.quote}</p>
        )}
        <AboutContent bio={about.bio} clients={about.clients} testimonials={about.testimonials} />
      </div>
    </main>
  )
}
