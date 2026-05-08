import { getSiteSettings, getportfoliopages } from '@/app/sanity/queries'
import { urlFor } from '@/app/sanity/image'
import NavClient from './NavClient'

export default async function Nav() {
  const [settings, portfolioPages] = await Promise.all([
    getSiteSettings(),
    getportfoliopages(),
  ])

  const logoUrl = settings?.logo
    ? urlFor(settings.logo).height(48).url()
    : null

  return (
    <NavClient
      settings={settings}
      logoUrl={logoUrl}
      portfolioPages={portfolioPages}
    />
  )
}
