import type { Metadata } from 'next'
import { skill as c } from '../_content'
import { CtaBand, NumberedGrid } from '../_components/blocks'
import { PageHero } from '../_components/page-hero'
import { SkillGapPreview } from '../_components/skill-gap-card'

export const metadata: Metadata = {
  title: 'Pengembangan Skill',
  description: c.hero.lead,
}

export default function PengembanganSkillPage() {
  return (
    <main>
      <PageHero {...c.hero} />
      <NumberedGrid id="kenapa" {...c.why} />
      <SkillGapPreview id="contoh" {...c.preview} />
      <CtaBand {...c.cta} />
    </main>
  )
}
