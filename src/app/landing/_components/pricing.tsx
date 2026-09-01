'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { SectionHeading, Stagger, staggerItem } from './primitives'

export type Tier = {
  name: string
  badge?: string
  price: string
  unit?: string
  desc: string
  features: string[]
  cta: { label: string; href: string }
}

function Check({ muted = false }: { muted?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="mt-0.5 shrink-0"
    >
      <path
        d="M3.5 8.5 6.5 11.5 12.5 5"
        stroke={muted ? 'var(--l-ink-3)' : 'var(--l-accent)'}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PricingGroup({
  id,
  eyebrow,
  title,
  lead,
  tiers,
}: {
  id?: string
  eyebrow: string
  title: string
  lead?: string
  tiers: Tier[]
}) {
  return (
    <section id={id} className="l-section scroll-mt-28">
      <div className="l-shell">
        <SectionHeading eyebrow={eyebrow} headline={title} subtext={lead} />
        <Stagger
          className={`mt-14 grid gap-4 md:mt-20 ${
            tiers.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
          }`}
          gap={0.1}
        >
          {tiers.map((t) => {
            const featured = Boolean(t.badge)
            return (
              <motion.div
                key={t.name}
                variants={staggerItem}
                className={`relative flex flex-col rounded-[28px] border p-7 sm:p-8 ${
                  featured
                    ? 'border-[var(--l-accent)] bg-[var(--l-bg-alt)] shadow-[0_24px_60px_-28px_rgba(80,3,255,0.4)]'
                    : 'border-[var(--l-line)] bg-[var(--l-bg-alt)]'
                }`}
              >
                {featured && (
                  <span className="absolute -top-3 left-7 rounded-full bg-[var(--l-accent)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-white">
                    {t.badge}
                  </span>
                )}
                <span className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--l-ink-3)]">
                  {t.name}
                </span>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-[clamp(1.7rem,3.4vw,2.3rem)] font-medium tracking-[-0.03em] [font-family:var(--font-space-grotesk)]">
                    {t.price}
                  </span>
                  {t.unit && (
                    <span className="text-sm text-[var(--l-ink-3)]">{t.unit}</span>
                  )}
                </div>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-[var(--l-ink-2)]">
                  {t.desc}
                </p>
                <ul className="mt-6 flex flex-1 flex-col gap-2.5 border-t border-[var(--l-line)] pt-6">
                  {t.features.map((f) => (
                    <li
                      key={f}
                      className="flex gap-2.5 text-[0.9rem] leading-snug text-[var(--l-ink-2)]"
                    >
                      <Check muted={!featured} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={t.cta.href}
                  className={`l-btn mt-7 w-full justify-center ${
                    featured ? 'l-btn--accent' : 'l-btn--ghost'
                  }`}
                >
                  <span className="l-btn__label">{t.cta.label}</span>
                </Link>
              </motion.div>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
