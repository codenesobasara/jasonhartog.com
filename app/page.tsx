import { getportfoliopages } from './sanity/queries'
  import HomepageSlider from '@/app/components/HomepageSlider'
                                                                                                                                                                                                             
  export default async function HomePage() {                                                                                                                                                                   
    const pages = await getportfoliopages()
                                                                                                                                                                                                               
    return (                                                                                                                                                                                                 
      <main className="homepage">
        <HomepageSlider pages={pages} />
      </main>
    )
  }