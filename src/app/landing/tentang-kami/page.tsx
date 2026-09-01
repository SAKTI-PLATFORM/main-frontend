import type { Metadata } from 'next'
import { tentang as c } from '../_content'
import { CtaBand, NumberedGrid, Prose } from '../_components/blocks'
import { PageHero } from '../_components/page-hero'

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: c.hero.lead,
}

export default function TentangKamiPage() {
  return (
    <main>
      <PageHero {...c.hero} />
      <NumberedGrid id="masalah" {...c.problem} />
      <Prose id="jembatan" {...c.bridge} />
      <NumberedGrid id="visi" {...c.vision} />
      <CtaBand {...c.cta} />
    </main>
  )
}
