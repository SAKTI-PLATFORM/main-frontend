import type { Metadata } from 'next'
import { Instrument_Sans } from 'next/font/google'
import { ScrollProgress, SmoothScroll } from './_components/effects'
import { Footer } from './_components/footer'
import { Nav } from './_components/nav'
import './landing.css'

// Single typeface for the whole landing page — landing.css aliases both the
// heading (--font-space-grotesk) and body (--font-inter-tight) variables to
// this one, so every existing usage picks it up without touching each file.
const instrumentSans = Instrument_Sans({
  variable: '--font-instrument-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'SAKTI — Pencocokan kerja berbasis AI',
    template: '%s — SAKTI',
  },
  description:
    'Upload CV kamu sekali, biar SAKTI yang cari lowongan yang beneran cocok dan tunjukkan skill apa yang masih perlu diasah. Gratis untuk pencari kerja.',
  openGraph: {
    title: 'SAKTI — Pencocokan kerja berbasis AI',
    description:
      'Upload CV sekali, dapat rekomendasi lowongan yang benar-benar cocok plus saran menutup skill gap.',
    type: 'website',
  },
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`landing-root ${instrumentSans.variable}`}>
      <SmoothScroll />
      <ScrollProgress />
      <Nav />
      {children}
      <Footer />
    </div>
  )
}
