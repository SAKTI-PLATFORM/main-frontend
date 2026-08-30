import { finalCta } from '../_data'
import { CountUp, CtaButton, Reveal, SplitText } from './primitives'

export function FinalCta() {
  return (
    <section id="harga" className="l-section scroll-mt-28">
      <div className="l-shell">
        <div className="rounded-[32px] border border-[var(--l-line)] bg-[var(--l-bg-alt)] px-6 py-16 text-center sm:px-10 md:py-24">
          <SplitText
            as="h2"
            text={finalCta.headline}
            className="l-display mx-auto max-w-[16ch]"
          />

          <Reveal delay={0.1}>
            <p className="l-lead mx-auto mt-6 text-balance text-center">
              {finalCta.subtext}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <CtaButton
                href={finalCta.ctaPrimary.href}
                label={finalCta.ctaPrimary.label}
                variant="accent"
              />
              <CtaButton
                href={finalCta.ctaSecondary.href}
                label={finalCta.ctaSecondary.label}
                variant="ghost"
                withArrow={false}
              />
            </div>
          </Reveal>

          <div className="mx-auto mt-14 grid max-w-2xl gap-8 border-t border-[var(--l-line)] pt-10 sm:grid-cols-3">
            {finalCta.stats.map((stat, i) => (
              <Reveal key={i} delay={i * 0.1} className="flex flex-col gap-2">
                <CountUp
                  stat={stat}
                  className="text-[clamp(1.6rem,3vw,2.4rem)] font-medium tracking-[-0.03em] [font-family:var(--font-space-grotesk)]"
                />
                <span className="text-sm text-[var(--l-ink-3)]">{stat.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
