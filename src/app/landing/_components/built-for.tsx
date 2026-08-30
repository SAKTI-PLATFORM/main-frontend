import { builtFor } from '../_data'
import { Marquee, Reveal } from './primitives'

export function BuiltFor() {
  return (
    <section className="l-panel-dark overflow-hidden py-14 md:py-20">
      <Reveal className="l-shell flex justify-center" variant="blur">
        <span className="block max-w-[44ch] text-center text-[0.72rem] font-medium uppercase leading-relaxed tracking-[0.18em] text-[var(--l-on-dark-2)]">
          {builtFor.eyebrow}
        </span>
      </Reveal>
      <Reveal className="mt-9 md:mt-12" variant="fade" duration={1}>
        <Marquee items={builtFor.themes} />
      </Reveal>
    </section>
  )
}
