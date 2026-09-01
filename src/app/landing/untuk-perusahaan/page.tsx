import type { Metadata } from 'next'
import { perusahaan as c } from '../_content'
import {
  CtaBand,
  EngineFlow,
  NumberedGrid,
  TabbedProfiles,
} from '../_components/blocks'
import { PageHero } from '../_components/page-hero'

export const metadata: Metadata = {
  title: 'Untuk Perusahaan',
  description: c.hero.lead,
}

export default function PerusahaanPage() {
  return (
    <main>
      <PageHero {...c.hero} />
      <NumberedGrid id="masalah" {...c.problems} />
      <EngineFlow id="alur" {...c.flow} />
      <TabbedProfiles id="skala" {...c.profiles} />
      <CtaBand {...c.cta} />
    </main>
  )
}
