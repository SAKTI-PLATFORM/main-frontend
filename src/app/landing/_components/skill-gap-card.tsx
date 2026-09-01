'use client'

import { motion } from 'motion/react'
import { Reveal, SectionHeading, Stagger, staggerItem } from './primitives'

export type SkillGapRow = { skill: string; note: string; priority: string }

export function SkillGapPreview({
  id,
  eyebrow,
  title,
  lead,
  target,
  score,
  rows,
}: {
  id?: string
  eyebrow: string
  title: string
  lead?: string
  target: string
  score: number
  rows: SkillGapRow[]
}) {
  return (
    <section id={id} className="l-section scroll-mt-28">
      <div className="l-shell">
        <SectionHeading eyebrow={eyebrow} headline={title} subtext={lead} />

        <Reveal variant="up" distance={36} className="mt-14 block md:mt-20">
          <div className="rounded-[28px] border border-[var(--l-line)] bg-[var(--l-bg-alt)] p-6 sm:p-9">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--l-ink-3)]">
                  Target
                </span>
                <p className="mt-1 text-[1.15rem] font-semibold tracking-[-0.02em] [font-family:var(--font-space-grotesk)]">
                  {target}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--l-ink-3)]">
                  Skor kecocokan
                </span>
                <p className="mt-1 text-[1.6rem] font-medium text-[var(--l-accent)] [font-family:var(--font-space-grotesk)]">
                  {score}%
                </p>
              </div>
            </div>

            <span className="mt-4 block h-2 w-full overflow-hidden rounded-full bg-[rgba(20,21,29,0.1)]">
              <motion.span
                className="block h-full rounded-full bg-[var(--l-accent)]"
                initial={{ width: 0 }}
                whileInView={{ width: `${score}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              />
            </span>

            <Stagger className="mt-8 flex flex-col gap-3" gap={0.08}>
              {rows.map((r) => (
                <motion.div
                  key={r.skill}
                  variants={staggerItem}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--l-line)] bg-[var(--l-bg)] p-4"
                >
                  <div className="min-w-0">
                    <p className="text-[0.98rem] font-semibold tracking-[-0.01em]">
                      {r.skill}
                    </p>
                    <p className="mt-0.5 text-[0.82rem] leading-snug text-[var(--l-ink-3)]">
                      {r.note}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-[var(--l-accent)] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[var(--l-accent)]">
                    {r.priority}
                  </span>
                </motion.div>
              ))}
            </Stagger>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
