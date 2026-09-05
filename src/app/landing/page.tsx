import { BuiltFor } from './_components/built-for'
import { Faq } from './_components/faq'
import { Hero } from './_components/hero'
import { HowItWorks } from './_components/how-it-works'
import { ProblemStats } from './_components/problem-stats'
import { Testimonials } from './_components/testimonials'
import { WhoItsFor } from './_components/who-its-for'

export default function LandingPage() {
  return (
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
  )
}
