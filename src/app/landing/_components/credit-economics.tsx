'use client'

import { Reveal, SectionHeading } from './primitives'

export type EconomicsCard = {
  /** e.g. "Job Seekers (B2C)" */
  audience: string
  /** e.g. "Rp1.500" */
  price: string
  /** e.g. "/credit" */
  priceUnit: string
  /** e.g. "Pay-per-use per model" */
  model: string
  flow: {
    from: { title: string; note: string }
    to: { title: string; note: string }
  }
  /** Small breakdown box, rendered two-up. */
  metrics: { value: string; label: string }[]
}

function FlowArrow() {
  return (
    <svg
      width="48"
      height="18"
      viewBox="0 0 48 18"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M2 9h40M35 2.5 43.5 9 35 15.5"
        stroke="var(--l-accent)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function EconomicsCardView({ card }: { card: EconomicsCard }) {
  return (
    <article
      className="flex flex-col gap-6 rounded-[28px] border-2 p-7 sm:p-9"
      style={{
        borderColor: 'var(--l-accent)',
        background: 'rgba(80, 3, 255, 0.06)',
      }}
    >
      <h3 className="text-[clamp(1.7rem,3.4vw,2.15rem)] font-medium leading-[1.12] tracking-[-0.02em] text-[var(--l-ink)]">
        {card.audience}
      </h3>

      <div>
        <p className="flex items-baseline gap-1">
          <span className="text-[clamp(2.6rem,6vw,3.7rem)] font-bold leading-none tracking-[-0.03em] text-[var(--l-ink)] [font-family:var(--font-space-grotesk)]">
            {card.price}
          </span>
          <span className="text-[clamp(1.05rem,2.4vw,1.5rem)] font-medium text-[var(--l-ink-3)]">
            {card.priceUnit}
          </span>
        </p>
        <p className="mt-2 text-[clamp(1rem,2vw,1.2rem)] font-medium text-[var(--l-ink)]">
          {card.model}
        </p>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="min-w-0">
          <p className="text-[1.02rem] font-bold leading-[1.15] text-[var(--l-ink)]">
            {card.flow.from.title}
          </p>
          <p className="mt-0.5 text-xs text-[var(--l-ink-3)]">
            {card.flow.from.note}
          </p>
        </div>
        <FlowArrow />
        <div className="min-w-0">
          <p className="text-[1.02rem] font-bold leading-[1.15] text-[var(--l-ink)]">
            {card.flow.to.title}
          </p>
          <p className="mt-0.5 text-xs text-[var(--l-ink-3)]">
            {card.flow.to.note}
          </p>
        </div>
      </div>

      <div
        className="grid grid-cols-2 gap-4 rounded-2xl p-5"
        style={{ background: 'rgba(80, 3, 255, 0.1)' }}
      >
        {card.metrics.map((metric) => (
          <div key={metric.label}>
            <p className="text-[clamp(1.3rem,3.2vw,1.75rem)] font-bold leading-none tracking-[-0.02em] text-[var(--l-ink)] [font-family:var(--font-space-grotesk)]">
              {metric.value}
            </p>
            <p className="mt-1.5 text-[0.85rem] leading-snug text-[var(--l-ink-2)]">
              {metric.label}
            </p>
          </div>
        ))}
      </div>
    </article>
  )
}

export function CreditEconomics({
  id,
  eyebrow,
  title,
  lead,
  cards,
}: {
  id?: string
  eyebrow: string
  title: string
  lead?: string
  cards: EconomicsCard[]
}) {
  return (
    <section id={id} className="l-section scroll-mt-28">
      <div className="l-shell">
        <SectionHeading eyebrow={eyebrow} headline={title} subtext={lead} />
        <div
          className={`mt-14 grid gap-6 md:mt-20 ${
            cards.length > 1 ? 'md:grid-cols-2' : 'max-w-[460px]'
          }`}
        >
          {cards.map((card) => (
            <Reveal key={card.audience} variant="blur">
              <EconomicsCardView card={card} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
