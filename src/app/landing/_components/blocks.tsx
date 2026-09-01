'use client'

import { useRef, useState, type ReactNode } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import type { Stat } from '../_data'
import {
  ArrowLink,
  CountUp,
  CtaButton,
  EASE,
  Reveal,
  SPRING_SNAPPY,
  SectionHeading,
  SplitText,
  Stagger,
  staggerItem,
} from './primitives'
import type { Cta } from './page-hero'

/* ---------------------------------------------------------------- shell --- */

export function SectionShell({
  id,
  children,
  className = '',
  dark = false,
}: {
  id?: string
  children: ReactNode
  className?: string
  dark?: boolean
}) {
  return (
    <section
      id={id}
      className={`l-section scroll-mt-28 ${dark ? 'l-panel-dark' : ''} ${className}`}
    >
      <div className="l-shell">{children}</div>
    </section>
  )
}

/* ------------------------------------------------------------ numbered ---- */

export type NumberedItem = { number: string; title: string; desc: string }

export function NumberedGrid({
  id,
  eyebrow,
  title,
  lead,
  items,
  dark = false,
}: {
  id?: string
  eyebrow: string
  title: string
  lead?: string
  items: NumberedItem[]
  dark?: boolean
}) {
  return (
    <SectionShell id={id} dark={dark}>
      <SectionHeading eyebrow={eyebrow} headline={title} subtext={lead} />
      <Stagger
        className="mt-14 grid border-t border-[var(--l-line)] md:mt-20 md:grid-cols-3"
        gap={0.12}
      >
        {items.map((it, i) => (
          <motion.div
            key={it.number}
            variants={staggerItem}
            className={`relative flex flex-col border-b py-9 md:border-b-0 md:py-11 ${
              dark ? 'border-[var(--l-on-dark-line)]' : 'border-[var(--l-line)]'
            } ${
              i > 0
                ? dark
                  ? 'md:border-l md:border-[var(--l-on-dark-line)] md:pl-8'
                  : 'md:border-l md:border-[var(--l-line)] md:pl-8'
                : ''
            } ${i < items.length - 1 ? 'md:pr-8' : ''}`}
          >
            <span
              className={`text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-none tracking-[-0.04em] [font-family:var(--font-space-grotesk)] ${
                dark ? 'text-[rgba(234,232,232,0.24)]' : 'text-[rgba(20,21,29,0.14)]'
              }`}
            >
              {it.number}
            </span>
            <h3 className="mt-5 text-[clamp(1.15rem,1.9vw,1.45rem)] font-semibold leading-snug tracking-[-0.02em]">
              {it.title}
            </h3>
            <p
              className={`mt-3 max-w-[34ch] text-[0.95rem] leading-relaxed ${
                dark ? 'text-[var(--l-on-dark-2)]' : 'text-[var(--l-ink-2)]'
              }`}
            >
              {it.desc}
            </p>
          </motion.div>
        ))}
      </Stagger>
    </SectionShell>
  )
}

/* --------------------------------------------------------- simple steps -- */

export function SimpleSteps({
  id,
  eyebrow,
  title,
  lead,
  steps,
  cta,
}: {
  id?: string
  eyebrow: string
  title: string
  lead?: string
  steps: NumberedItem[]
  cta?: Cta
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 78%', 'end 62%'],
  })
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.4,
  })
  const dotLeft = useTransform(scaleX, (v) => `${Math.min(v, 1) * 100}%`)

  return (
    <SectionShell id={id}>
      <SectionHeading eyebrow={eyebrow} headline={title} subtext={lead} />
      <div
        ref={trackRef}
        className="relative mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-8"
      >
        <div className="absolute inset-x-0 top-[2.15rem] hidden h-px bg-[var(--l-line)] md:block" />
        {!reduced && (
          <>
            <motion.div
              className="absolute left-0 top-[2.15rem] hidden h-px w-full origin-left bg-[var(--l-ink)] md:block"
              style={{ scaleX }}
              aria-hidden
            />
            <motion.span
              className="absolute top-[2.15rem] hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--l-accent)] shadow-[0_0_0_5px_rgba(80,3,255,0.16)] md:block"
              style={{ left: dotLeft }}
              aria-hidden
            />
          </>
        )}

        {steps.map((step, i) => (
          <Reveal key={step.number} delay={i * 0.14} variant="blur" className="relative">
            <motion.span
              className="relative z-10 grid h-[4.3rem] w-[4.3rem] place-items-center rounded-full border border-[var(--l-line)] bg-[var(--l-bg)] text-lg font-medium [font-family:var(--font-space-grotesk)]"
              initial={reduced ? undefined : { scale: 0.35, opacity: 0 }}
              whileInView={reduced ? undefined : { scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ ...SPRING_SNAPPY, delay: 0.1 + i * 0.14 }}
            >
              {step.number}
            </motion.span>
            <h3 className="mt-6 text-[clamp(1.3rem,2.1vw,1.8rem)] leading-tight">
              {step.title}
            </h3>
            <p className="mt-3 max-w-[36ch] text-[0.98rem] leading-relaxed text-[var(--l-ink-2)]">
              {step.desc}
            </p>
          </Reveal>
        ))}
      </div>
      {cta && (
        <Reveal className="mt-14 md:mt-20" variant="left" distance={16}>
          <ArrowLink href={cta.href} label={cta.label} />
        </Reveal>
      )}
    </SectionShell>
  )
}

/* --------------------------------------------------------- engine flow --- */

export type EngineStep = {
  number: string
  name: string
  title: string
  desc: string
  points: string[]
}

export function EngineFlow({
  id,
  eyebrow,
  title,
  lead,
  steps,
}: {
  id?: string
  eyebrow: string
  title: string
  lead?: string
  steps: EngineStep[]
}) {
  return (
    <SectionShell id={id}>
      <SectionHeading eyebrow={eyebrow} headline={title} subtext={lead} />
      <div className="mt-14 flex flex-col gap-5 md:mt-20 md:gap-7">
        {steps.map((step, i) => {
          const dark = i % 2 === 1
          return (
            <Reveal
              key={step.number}
              as="article"
              variant="up"
              distance={40}
              className={`overflow-hidden rounded-[26px] border p-7 sm:p-10 lg:p-12 ${
                dark
                  ? 'l-panel-dark border-transparent'
                  : 'border-[var(--l-line)] bg-[var(--l-bg-alt)]'
              }`}
            >
              <div className="flex items-start justify-between gap-6">
                <span className="l-eyebrow">{step.name}</span>
                <span
                  className={`-mt-2 text-[clamp(2.5rem,6vw,5rem)] font-medium leading-none tracking-[-0.04em] [font-family:var(--font-space-grotesk)] ${
                    dark
                      ? 'text-[rgba(234,232,232,0.24)]'
                      : 'text-[rgba(20,21,29,0.12)]'
                  }`}
                >
                  {step.number}
                </span>
              </div>
              <h3 className="mt-5 max-w-[20ch] text-[clamp(1.45rem,3vw,2.4rem)] leading-[1.06]">
                {step.title}
              </h3>
              <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
                <p
                  className={`l-lead ${dark ? 'text-[var(--l-on-dark-2)]' : ''}`}
                >
                  {step.desc}
                </p>
                <ol className="flex flex-col">
                  {step.points.map((p, pi) => (
                    <Reveal
                      as="li"
                      key={pi}
                      delay={pi * 0.07}
                      variant="left"
                      distance={18}
                      className={`flex items-baseline gap-4 border-t py-3.5 text-[0.96rem] ${
                        dark
                          ? 'border-[var(--l-on-dark-line)]'
                          : 'border-[var(--l-line)]'
                      } ${pi === step.points.length - 1 ? 'border-b' : ''}`}
                    >
                      <span
                        className={`shrink-0 text-xs font-medium [font-family:var(--font-space-grotesk)] ${
                          dark
                            ? 'text-[var(--l-on-dark-2)]'
                            : 'text-[var(--l-ink-3)]'
                        }`}
                      >
                        0{pi + 1}
                      </span>
                      <span
                        className={
                          dark
                            ? 'text-[var(--l-on-dark)]'
                            : 'text-[var(--l-ink-2)]'
                        }
                      >
                        {p}
                      </span>
                    </Reveal>
                  ))}
                </ol>
              </div>
            </Reveal>
          )
        })}
      </div>
    </SectionShell>
  )
}

/* ------------------------------------------------------ tabbed profiles -- */

export type ProfileTab = {
  label: string
  meta?: string
  title: string
  desc: string
}

export function TabbedProfiles({
  id,
  eyebrow,
  title,
  lead,
  tabs,
}: {
  id?: string
  eyebrow: string
  title: string
  lead?: string
  tabs: ProfileTab[]
}) {
  const [active, setActive] = useState(0)
  const tab = tabs[active]

  return (
    <SectionShell id={id}>
      <SectionHeading eyebrow={eyebrow} headline={title} subtext={lead} />

      <Reveal variant="fade" className="mt-12 block">
        <div className="flex flex-wrap gap-2 rounded-full border border-[var(--l-line)] bg-[var(--l-bg-alt)] p-1.5">
          {tabs.map((t, i) => (
            <button
              key={t.label}
              type="button"
              onClick={() => setActive(i)}
              className="relative rounded-full px-4 py-2 text-[0.9rem] font-medium tracking-[-0.01em] transition-colors"
            >
              {active === i && (
                <motion.span
                  layoutId="profile-tab"
                  className="absolute inset-0 -z-10 rounded-full bg-[var(--l-ink)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span
                className={
                  active === i ? 'text-[var(--l-bg)]' : 'text-[var(--l-ink-2)]'
                }
              >
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </Reveal>

      <div className="relative mt-10 min-h-[13rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -18, filter: 'blur(8px)' }}
            transition={{ duration: 0.35, ease: EASE }}
            className="max-w-[46rem]"
          >
            {tab.meta && (
              <span className="l-eyebrow">{tab.meta}</span>
            )}
            <h3 className="mt-3 text-[clamp(1.5rem,3vw,2.3rem)] leading-[1.08]">
              {tab.title}
            </h3>
            <p className="l-lead mt-4">{tab.desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </SectionShell>
  )
}

/* --------------------------------------------------------- stat cards ---- */

export type StatCard = { value: string; name: string; desc: string }

export function StatCards({
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
  cards: StatCard[]
}) {
  return (
    <SectionShell id={id}>
      <SectionHeading eyebrow={eyebrow} headline={title} subtext={lead} />
      <Stagger
        className="mt-14 grid gap-4 sm:grid-cols-2 md:mt-20 lg:grid-cols-4"
        gap={0.1}
      >
        {cards.map((c) => (
          <motion.div
            key={c.name}
            variants={staggerItem}
            className="flex flex-col rounded-3xl border border-[var(--l-line)] bg-[var(--l-bg-alt)] p-6"
          >
            <span className="text-[clamp(1.9rem,4vw,2.6rem)] font-medium leading-none tracking-[-0.04em] text-[var(--l-accent)] [font-family:var(--font-space-grotesk)]">
              {c.value}
            </span>
            <span className="mt-4 text-[0.95rem] font-semibold tracking-[-0.01em]">
              {c.name}
            </span>
            <span className="mt-1.5 text-[0.85rem] leading-relaxed text-[var(--l-ink-3)]">
              {c.desc}
            </span>
          </motion.div>
        ))}
      </Stagger>
    </SectionShell>
  )
}

/* ------------------------------------------------------------ prose ------ */

export function Prose({
  id,
  eyebrow,
  title,
  paragraphs,
}: {
  id?: string
  eyebrow: string
  title: string
  paragraphs: string[]
}) {
  return (
    <SectionShell id={id}>
      <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <div>
          <Reveal variant="left" distance={16}>
            <span className="l-eyebrow">{eyebrow}</span>
          </Reveal>
          <SplitText
            as="h2"
            text={title}
            className="l-h2 mt-5 max-w-[16ch]"
          />
        </div>
        <Stagger className="flex flex-col gap-5" gap={0.1}>
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              variants={staggerItem}
              className="text-[1.02rem] leading-relaxed text-[var(--l-ink-2)]"
            >
              {p}
            </motion.p>
          ))}
        </Stagger>
      </div>
    </SectionShell>
  )
}

/* ---------------------------------------------------------- link cards --- */

export type LinkCard = { title: string; desc: string; label: string; href: string }

export function LinkCards({
  id,
  eyebrow,
  title,
  lead,
  cards,
}: {
  id?: string
  eyebrow?: string
  title: string
  lead?: string
  cards: LinkCard[]
}) {
  return (
    <SectionShell id={id}>
      <SectionHeading
        eyebrow={eyebrow ?? 'Langkah selanjutnya'}
        headline={title}
        subtext={lead}
      />
      <Stagger className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3" gap={0.1}>
        {cards.map((c) => (
          <motion.a
            key={c.title}
            href={c.href}
            variants={staggerItem}
            className="group flex flex-col rounded-3xl border border-[var(--l-line)] bg-[var(--l-bg-alt)] p-7 transition-colors hover:border-[var(--l-ink)]"
          >
            <h3 className="text-[1.1rem] font-semibold tracking-[-0.01em]">
              {c.title}
            </h3>
            <p className="mt-2 flex-1 text-[0.92rem] leading-relaxed text-[var(--l-ink-3)]">
              {c.desc}
            </p>
            <span className="l-link mt-5 text-[0.9rem]">
              <span className="l-link__line">{c.label}</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path
                  d="M3 8h10M9 3.5 13.5 8 9 12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </motion.a>
        ))}
      </Stagger>
    </SectionShell>
  )
}

/* ------------------------------------------------------------ cta band --- */

export function CtaBand({
  id,
  title,
  lead,
  ctas,
  stats,
  tone = 'plain',
}: {
  id?: string
  title: string
  lead: string
  ctas: Cta[]
  stats?: Stat[]
  tone?: 'plain' | 'accent'
}) {
  const accent = tone === 'accent'
  return (
    <section id={id} className="l-section scroll-mt-28">
      <div className="l-shell">
        <div
          className={`rounded-[32px] px-6 py-16 text-center sm:px-10 md:py-24 ${
            accent
              ? 'l-footer'
              : 'border border-[var(--l-line)] bg-[var(--l-bg-alt)]'
          }`}
        >
          <SplitText
            as="h2"
            text={title}
            className={`l-display mx-auto max-w-[18ch] ${accent ? 'text-[var(--l-on-dark)]' : ''}`}
          />
          <Reveal delay={0.1} variant="blur">
            <p
              className={`l-lead mx-auto mt-6 text-balance text-center ${
                accent ? 'text-[var(--l-on-dark-2)]' : ''
              }`}
            >
              {lead}
            </p>
          </Reveal>
          <Reveal delay={0.2} variant="scale">
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              {ctas.map((c, i) => {
                const variant =
                  c.variant ??
                  (i === 0 ? (accent ? 'on-dark' : 'accent') : 'ghost')
                return (
                  <CtaButton
                    key={`${c.href}-${i}`}
                    href={c.href}
                    label={c.label}
                    variant={variant}
                    magnetic={i === 0}
                    withArrow={i === 0}
                  />
                )
              })}
            </div>
          </Reveal>

          {stats?.length ? (
            <div
              className={`mx-auto mt-14 grid max-w-2xl gap-8 border-t pt-10 sm:grid-cols-3 ${
                accent
                  ? 'border-[var(--l-on-dark-line)]'
                  : 'border-[var(--l-line)]'
              }`}
            >
              {stats.map((s, i) => (
                <Reveal key={i} delay={i * 0.1} className="flex flex-col gap-2">
                  <CountUp
                    stat={s}
                    className={`text-[clamp(1.5rem,3vw,2.2rem)] font-medium tracking-[-0.03em] [font-family:var(--font-space-grotesk)] ${
                      accent ? 'text-[var(--l-on-dark)]' : ''
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      accent
                        ? 'text-[var(--l-on-dark-2)]'
                        : 'text-[var(--l-ink-3)]'
                    }`}
                  >
                    {s.label}
                  </span>
                </Reveal>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
