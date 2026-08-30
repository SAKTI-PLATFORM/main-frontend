'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { whoItsFor } from '../_data'
import {
  ArrowLink,
  Reveal,
  SectionHeading,
  SplitText,
  useMediaQuery,
} from './primitives'

type Segment = (typeof whoItsFor.segments)[number]

function SegmentCard({ seg, index }: { seg: Segment; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const stacks = useMediaQuery('(min-width: 768px)')
  const dark = index === 1

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.35])
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 9])

  const animate = stacks && !reduced

  return (
    <motion.article
      ref={ref}
      id={seg.id}
      className={`scroll-mt-28 md:scroll-mt-32 ${stacks ? 'l-stack__item' : ''}`}
      style={{
        ...(stacks
          ? { top: `calc(var(--l-nav-h) + ${1.75 + index * 0.85}rem)` }
          : {}),
        ...(animate
          ? { transformPerspective: 1200, scale, opacity, rotateX }
          : {}),
      }}
    >
      <div
        className={`overflow-hidden rounded-[28px] border p-7 sm:p-10 lg:p-14 ${
          dark
            ? 'l-panel-dark border-transparent'
            : 'border-[var(--l-line)] bg-[var(--l-bg-alt)]'
        }`}
      >
        <div className="flex items-start justify-between gap-6">
          <Reveal variant="left" distance={16}>
            <span className="l-eyebrow">{seg.eyebrow}</span>
          </Reveal>
          <Reveal variant="scale" distance={30}>
            <span
              className={`-mt-2 block text-[clamp(2.75rem,7vw,6rem)] font-medium leading-none tracking-[-0.04em] [font-family:var(--font-space-grotesk)] ${
                dark ? 'text-[rgba(234,232,232,0.28)]' : 'text-[rgba(20,21,29,0.13)]'
              }`}
            >
              {seg.number}
            </span>
          </Reveal>
        </div>

        <SplitText
          as="h3"
          text={seg.title}
          className="mt-5 max-w-[18ch] text-[clamp(1.6rem,3.4vw,2.9rem)] leading-[1.04]"
        />

        <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_1fr]">
          <Reveal delay={0.05} variant="blur">
            <p className={`l-lead ${dark ? 'text-[var(--l-on-dark-2)]' : ''}`}>
              {seg.description}
            </p>
          </Reveal>

          <ol className="flex flex-col">
            {seg.steps.map((step, i) => (
              <Reveal
                as="li"
                key={i}
                delay={i * 0.09}
                variant="left"
                distance={20}
                className={`flex items-baseline gap-4 border-t py-4 text-[0.98rem] ${
                  dark ? 'border-[var(--l-on-dark-line)]' : 'border-[var(--l-line)]'
                } ${i === seg.steps.length - 1 ? 'border-b' : ''}`}
              >
                <span
                  className={`shrink-0 text-xs font-medium tracking-[0.1em] [font-family:var(--font-space-grotesk)] ${
                    dark ? 'text-[var(--l-on-dark-2)]' : 'text-[var(--l-ink-3)]'
                  }`}
                >
                  0{i + 1}
                </span>
                <span
                  className={dark ? 'text-[var(--l-on-dark)]' : 'text-[var(--l-ink-2)]'}
                >
                  {step}
                </span>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal delay={0.1} className="mt-10" variant="left" distance={16}>
          <ArrowLink href={seg.cta.href} label={seg.cta.label} onDark={dark} />
        </Reveal>
      </div>
    </motion.article>
  )
}

export function WhoItsFor() {
  return (
    <section className="l-section">
      <div className="l-shell">
        <SectionHeading
          eyebrow={whoItsFor.eyebrow}
          headline={whoItsFor.headline}
          subtext={whoItsFor.subtext}
        />
        <div className="l-stack mt-14 md:mt-20">
          {whoItsFor.segments.map((seg, i) => (
            <SegmentCard key={seg.id} seg={seg} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
