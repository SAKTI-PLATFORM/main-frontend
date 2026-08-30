'use client'

import { motion } from 'motion/react'
import { hero } from '../_data'
import { Hero3D } from './hero-3d'
import {
  CountUp,
  CtaButton,
  Reveal,
  SplitText,
  Stagger,
  staggerItem,
  useMediaQuery,
} from './primitives'

export function Hero() {
  const showVisual = useMediaQuery('(min-width: 768px)')

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-[calc(var(--l-nav-h)+clamp(1rem,4vw,3.25rem))]"
    >
      <div className="l-shell relative grid items-center gap-y-10 md:grid-cols-[1.1fr_0.9fr] md:gap-x-10 lg:gap-x-16">
        <div className="relative z-[2]">
          <SplitText
            as="h1"
            text={hero.headline}
            className="l-display max-w-[19ch]"
            delay={0.05}
            stagger={0.038}
          />

          <Reveal delay={0.3} variant="blur">
            <p className="l-lead mt-6 max-w-[46ch]">{hero.subheadline}</p>
          </Reveal>

          <Reveal delay={0.46} variant="scale">
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CtaButton
                href={hero.ctaPrimary.href}
                label={hero.ctaPrimary.label}
                variant="accent"
                magnetic
              />
              <CtaButton
                href={hero.ctaSecondary.href}
                label={hero.ctaSecondary.label}
                variant="ghost"
                withArrow={false}
              />
            </div>
          </Reveal>
        </div>

        <div className="relative z-[1] hidden w-full md:block">
          {showVisual && (
            <Reveal delay={0.2} variant="fade">
              <Hero3D />
            </Reveal>
          )}
        </div>
      </div>

      <Stagger
        className="l-shell mt-14 grid grid-cols-1 border-t border-[var(--l-line)] sm:mt-20 sm:grid-cols-3"
        gap={0.12}
      >
        {hero.stats.map((stat, i) => (
          <motion.div
            key={i}
            variants={staggerItem}
            className={`relative flex flex-col gap-2 border-b border-[var(--l-line)] py-8 sm:border-b-0 sm:py-9 sm:pr-6 ${
              i < hero.stats.length - 1
                ? 'sm:border-r sm:border-[var(--l-line)]'
                : ''
            } ${i > 0 ? 'sm:pl-8' : ''}`}
          >
            <motion.span
              aria-hidden
              className="absolute left-0 top-[-1px] h-[2px] bg-[var(--l-accent)]"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 + i * 0.12 }}
              style={{ originX: 0, width: '2.5rem' }}
            />
            <CountUp
              stat={stat}
              className="text-[clamp(2rem,3.6vw,3rem)] font-medium tracking-[-0.03em] [font-family:var(--font-space-grotesk)]"
            />
            <span className="max-w-[24ch] text-sm text-[var(--l-ink-3)]">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </Stagger>
    </section>
  )
}
