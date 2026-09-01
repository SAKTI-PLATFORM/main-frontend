import type { Metadata } from 'next'
import { kontak as c } from '../_content'
import { LinkCards } from '../_components/blocks'
import { ContactForm } from '../_components/contact-form'

export const metadata: Metadata = {
  title: 'Kontak',
  description:
    'Ceritakan kebutuhanmu: upload CV, jadwalkan demo untuk perusahaan, atau diskusi kolaborasi kelembagaan.',
}

export default function KontakPage() {
  return (
    <main>
      <ContactForm />
      <LinkCards
        id="bantuan"
        eyebrow={c.help.eyebrow}
        title={c.help.title}
        cards={c.help.cards}
      />
    </main>
  )
}
