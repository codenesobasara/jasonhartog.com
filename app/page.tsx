import { getportfoliopages } from './sanity/queries'
  import HomepageSlider from '@/app/components/HomepageSlider'
                                                                                                                                                                                                             
  export default async function HomePage() {                                                                                                                                                                   
    const pages = await getportfoliopages()
                                                                                                                                                                                                               
    return (                                                                                                                                                                                                 
      <main className="flex-1 min-h-0 overflow-hidden">
        <HomepageSlider pages={pages} />
      </main>
    )
  }