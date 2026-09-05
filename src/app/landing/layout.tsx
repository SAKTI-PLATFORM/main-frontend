import type { Metadata } from 'next'
import { Space_Grotesk, Inter_Tight } from 'next/font/google'
import { ScrollProgress, SmoothScroll } from './_components/effects'
import { Footer } from './_components/footer'
import { Nav } from './_components/nav'
import './landing.css'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['500', '700'],
  display: 'swap',
})

const interTight = Inter_Tight({
  variable: '--font-inter-tight',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
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
    <div
      className={`landing-root ${spaceGrotesk.variable} ${interTight.variable}`}
    >
      <SmoothScroll />
      <ScrollProgress />
      <Nav />
      {children}
      <Footer />
    </div>
  )
}
