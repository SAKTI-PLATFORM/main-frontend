import type { Metadata } from 'next'
import { harga as c } from '../_content'
import { CtaBand } from '../_components/blocks'
import { FaqGroups } from '../_components/faq-groups'
import { PageHero } from '../_components/page-hero'
import { PricingGroup } from '../_components/pricing'

export const metadata: Metadata = {
  title: 'Harga',
  description: c.hero.lead,
}

export default function HargaPage() {
  return (
    <main>
      <PageHero {...c.hero} />
      <PricingGroup
        id="pencari-kerja"
        eyebrow={c.seeker.eyebrow}
        title={c.seeker.title}
        lead={c.seeker.lead}
        tiers={c.seeker.list}
      />
      <PricingGroup
        id="perusahaan"
        eyebrow={c.company.eyebrow}
        title={c.company.title}
        lead={c.company.lead}
        tiers={c.company.list}
      />
      <PricingGroup
        id="skill"
        eyebrow={c.skill.eyebrow}
        title={c.skill.title}
        lead={c.skill.lead}
        tiers={c.skill.list}
      />
      <FaqGroups
        id="faq-harga"
        eyebrow={c.faq.eyebrow}
        title={c.faq.title}
        groups={c.faq.groups}
      />
      <CtaBand {...c.cta} />
    </main>
  )
}
