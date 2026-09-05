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
    // Tighter gap between sections on this page only — --l-section-y is the
    // shared padding token every other landing page still uses at full size.
    <main style={{ '--l-section-y': 'clamp(2.5rem, 6vw, 5rem)' } as React.CSSProperties}>
      <PageHero {...c.hero} />
      <PricingGroup
        id="paket"
        eyebrow={c.pricing.eyebrow}
        title={c.pricing.title}
        lead={c.pricing.lead}
        tiers={c.pricing.list}
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
