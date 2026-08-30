'use client'

import { useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { howItWorks } from '../_data'
import { ArrowLink, Reveal, SectionHeading, SPRING_SNAPPY } from './primitives'

export function HowItWorks() {
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
    <section id="cara-kerja" className="l-section scroll-mt-28">
      <div className="l-shell">
        <SectionHeading
          eyebrow={howItWorks.eyebrow}
          headline={howItWorks.headline}
          subtext={howItWorks.subtext}
        />

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

          {howItWorks.steps.map((step, i) => (
            <Reveal
              key={step.number}
              delay={i * 0.14}
              variant="blur"
              className="relative"
            >
              <motion.span
                className="relative z-10 grid h-[4.3rem] w-[4.3rem] place-items-center rounded-full border border-[var(--l-line)] bg-[var(--l-bg)] text-lg font-medium [font-family:var(--font-space-grotesk)]"
                initial={reduced ? undefined : { scale: 0.35, opacity: 0 }}
                whileInView={reduced ? undefined : { scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ ...SPRING_SNAPPY, delay: 0.1 + i * 0.14 }}
              >
                {step.number}
              </motion.span>
              <h3 className="mt-6 text-[clamp(1.35rem,2.2vw,1.9rem)] leading-tight">
                {step.title}
              </h3>
              <p className="mt-3 max-w-[36ch] text-[0.98rem] leading-relaxed text-[var(--l-ink-2)]">
                {step.description}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 md:mt-20" variant="left" distance={16}>
          <ArrowLink href={howItWorks.cta.href} label={howItWorks.cta.label} />
        </Reveal>
      </div>
    </section>
  )
}
