import type { Metadata } from 'next'
import { faqPage as c } from '../_content'
import { CtaBand } from '../_components/blocks'
import { FaqGroups } from '../_components/faq-groups'
import { PageHero } from '../_components/page-hero'

export const metadata: Metadata = {
  title: 'FAQ',
  description: c.hero.lead,
}

export default function FaqPage() {
  return (
    <main>
      <PageHero {...c.hero} />
      <FaqGroups
        id="daftar"
        eyebrow="Semua topik"
        title="Cari jawaban per kategori"
        groups={c.groups}
      />
      <CtaBand {...c.cta} />
    </main>
  )
}
