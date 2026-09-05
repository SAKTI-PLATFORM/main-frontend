import type { Metadata } from 'next'
import { caraKerja as c } from '../_content'
import { EngineFlow } from '../_components/blocks'
import { PageHero } from '../_components/page-hero'

export const metadata: Metadata = {
  title: 'Cara Kerja',
  description: c.hero.lead,
}

export default function CaraKerjaPage() {
  return (
    <main>
      <PageHero {...c.hero} />
      <EngineFlow id="alur" {...c.flow} />
    </main>
  )
}
