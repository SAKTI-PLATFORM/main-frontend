'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLink, Reveal, SectionHeading, Stagger, staggerItem } from './primitives'

export type FaqGroup = {
  label: string
  heading: string
  items: { q: string; a: string }[]
}

function AccordionItem({
  q,
  a,
  index,
}: {
  q: string
  a: string
  index: number
}) {
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()

  return (
    <motion.div
      variants={staggerItem}
      className="border-b border-[var(--l-line)]"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group flex w-full items-center gap-5 py-5 text-left"
      >
        <motion.span
          aria-hidden
          className="h-4 w-[3px] shrink-0 rounded-full bg-[var(--l-accent)]"
          animate={{ opacity: open ? 1 : 0, scaleY: open ? 1 : 0.3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
        <span
          className={`flex-1 text-[clamp(1rem,1.6vw,1.2rem)] font-medium tracking-[-0.02em] transition-colors [font-family:var(--font-space-grotesk)] ${
            open
              ? 'text-[var(--l-ink)]'
              : 'text-[var(--l-ink-2)] group-hover:text-[var(--l-ink)]'
          }`}
        >
          {q}
        </span>
        <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--l-line)]">
          <span className="absolute h-px w-3 bg-[var(--l-ink)]" />
          <motion.span
            className="absolute h-3 w-px bg-[var(--l-ink)]"
            animate={{ scaleY: open ? 0 : 1, rotate: open ? 90 : 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          />
        </span>
      </button>

      {reduced ? (
        open && (
          <p className="max-w-[60ch] pb-5 pl-8 text-[0.96rem] leading-relaxed text-[var(--l-ink-2)]">
            {a}
          </p>
        )
      ) : (
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key={`a-${index}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { type: 'spring', stiffness: 260, damping: 32 },
                opacity: { duration: 0.25 },
              }}
              className="overflow-hidden"
            >
              <motion.p
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-[60ch] pb-5 pl-8 text-[0.96rem] leading-relaxed text-[var(--l-ink-2)]"
              >
                {a}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  )
}

export function FaqGroups({
  id,
  eyebrow,
  title,
  lead,
  groups,
  cta,
}: {
  id?: string
  eyebrow: string
  title: string
  lead?: string
  groups: FaqGroup[]
  cta?: { label: string; href: string }
}) {
  return (
    <section id={id} className="l-section scroll-mt-28">
      <div className="l-shell">
        <SectionHeading eyebrow={eyebrow} headline={title} subtext={lead} />

        <div className="mt-14 flex flex-col gap-14 md:mt-20 md:gap-20">
          {groups.map((g) => (
            <div
              key={g.label}
              className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16"
            >
              <div className="md:sticky md:top-32 md:self-start">
                <Reveal variant="left" distance={16}>
                  <span className="l-eyebrow">{g.label}</span>
                </Reveal>
                <h3 className="mt-4 text-[clamp(1.4rem,2.4vw,2rem)] leading-tight">
                  {g.heading}
                </h3>
              </div>
              <Stagger
                className="flex flex-col border-t border-[var(--l-line)]"
                gap={0.06}
              >
                {g.items.map((it, i) => (
                  <AccordionItem key={i} q={it.q} a={it.a} index={i} />
                ))}
              </Stagger>
            </div>
          ))}
        </div>

        {cta && (
          <Reveal className="mt-16 block" variant="left" distance={16}>
            <ArrowLink href={cta.href} label={cta.label} />
          </Reveal>
        )}
      </div>
    </section>
  )
}
