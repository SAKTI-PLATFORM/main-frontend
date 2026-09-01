'use client'

import type { Stat } from '../_data'
import { CountUp, CtaButton, Reveal, SplitText } from './primitives'

export type Cta = { label: string; href: string; variant?: 'accent' | 'ghost' }

export function PageHero({
  eyebrow,
  breadcrumb,
  title,
  lead,
  ctas,
  stats,
}: {
  eyebrow?: string
  breadcrumb?: string
  title: string
  lead: string
  ctas?: Cta[]
  stats?: Stat[]
}) {
  return (
    <section className="relative overflow-hidden pt-[calc(var(--l-nav-h)+clamp(1.25rem,5vw,3.75rem))]">
      <div className="l-shell">
        {breadcrumb && (
          <Reveal variant="fade">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--l-ink-3)]">
              {breadcrumb}
            </p>
          </Reveal>
        )}

        {eyebrow && (
          <Reveal variant="left" distance={16} className="mt-4 block">
            <span className="l-eyebrow">{eyebrow}</span>
          </Reveal>
        )}

        <SplitText
          as="h1"
          text={title}
          className="l-display mt-4 max-w-[20ch]"
          delay={0.05}
          stagger={0.035}
        />

        <Reveal delay={0.24} variant="blur">
          <p className="l-lead mt-6 max-w-[52ch]">{lead}</p>
        </Reveal>

        {ctas?.length ? (
          <Reveal delay={0.4} variant="scale">
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {ctas.map((c, i) => {
                const variant = c.variant ?? (i === 0 ? 'accent' : 'ghost')
                return (
                  <CtaButton
                    key={`${c.href}-${i}`}
                    href={c.href}
                    label={c.label}
                    variant={variant}
                    magnetic={variant === 'accent'}
                    withArrow={variant === 'accent'}
                  />
                )
              })}
            </div>
          </Reveal>
        ) : null}
      </div>

      {stats?.length ? (
        <div className="l-shell mt-14 md:mt-20">
          <div className="grid grid-cols-1 border-t border-[var(--l-line)] sm:grid-cols-3">
            {stats.map((s, i) => (
              <Reveal
                key={i}
                delay={0.1 + i * 0.1}
                className={`relative flex flex-col gap-2 border-b border-[var(--l-line)] py-8 sm:border-b-0 sm:py-9 sm:pr-6 ${
                  i < stats.length - 1
                    ? 'sm:border-r sm:border-[var(--l-line)]'
                    : ''
                } ${i > 0 ? 'sm:pl-8' : ''}`}
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-[-1px] h-[2px] w-10 origin-left bg-[var(--l-accent)]"
                />
                <CountUp
                  stat={s}
                  className="text-[clamp(1.85rem,3.3vw,2.7rem)] font-medium tracking-[-0.03em] [font-family:var(--font-space-grotesk)]"
                />
                <span className="max-w-[26ch] text-sm text-[var(--l-ink-3)]">
                  {s.label}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}
