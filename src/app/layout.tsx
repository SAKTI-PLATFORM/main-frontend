import type { Metadata } from 'next'
import { Figtree, Instrument_Sans } from 'next/font/google'
import Providers from '@/components/layout/providers'
import './globals.css'

const figtree = Figtree({
  variable: '--font-figtree',
  subsets: ['latin'],
})

const instrumentSans = Instrument_Sans({
  variable: '--font-instrument-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://sakti-ai.vercel.app'),
  title: 'SAKTI AI',
  description: 'Platform job matching berbasis AI',
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      className={`${figtree.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-figtree)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
