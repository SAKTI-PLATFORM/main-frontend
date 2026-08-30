import { BuiltFor } from './_components/built-for'
import { ScrollProgress, SmoothScroll } from './_components/effects'
import { Faq } from './_components/faq'
import { Footer } from './_components/footer'
import { Hero } from './_components/hero'
import { HowItWorks } from './_components/how-it-works'
import { Nav } from './_components/nav'
import { ProblemStats } from './_components/problem-stats'
import { Testimonials } from './_components/testimonials'
import { WhoItsFor } from './_components/who-its-for'

export default function LandingPage() {
  return (
    <>
      <SmoothScroll />
      <ScrollProgress />
      <Nav />

      <main>
        <Hero />
        <BuiltFor />
        <ProblemStats />
        <hr className="l-shell l-divider" />
        <WhoItsFor />
        <HowItWorks />
        <Testimonials />
        <Faq />
        <hr className="l-shell l-divider" />
      </main>

      <Footer />
    </>
  )
}
