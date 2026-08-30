'use client'

import { motion } from 'motion/react'
import { problemStats } from '../_data'
import { CountUp, Reveal, Stagger, staggerItem } from './primitives'

export function ProblemStats() {
  return (
    <section className="l-section">
      <div className="l-shell">
        <Reveal variant="left" distance={18}>
          <span className="l-eyebrow">Masalah yang kami lihat</span>
        </Reveal>

        <Stagger
          className="mt-12 grid border-t border-[var(--l-line)] md:mt-16 md:grid-cols-3"
          gap={0.14}
        >
          {problemStats.map((stat, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className={`relative border-b border-[var(--l-line)] py-9 md:border-b-0 md:py-11 ${
                i > 0 ? 'md:border-l md:border-[var(--l-line)] md:pl-8' : ''
              } ${i < problemStats.length - 1 ? 'md:pr-8' : ''}`}
            >
              <motion.span
                aria-hidden
                className={`absolute top-[-1px] h-[2px] w-10 bg-[var(--l-accent)] ${
                  i > 0 ? 'left-0 md:left-8' : 'left-0'
                }`}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.15 + i * 0.14,
                }}
                style={{ originX: 0 }}
              />
              <CountUp
                stat={stat}
                className="block text-[clamp(1.9rem,3.6vw,3rem)] font-medium leading-[1.05] tracking-[-0.035em] [font-family:var(--font-space-grotesk)]"
              />
              <p className="mt-5 max-w-[28ch] text-[0.98rem] leading-relaxed text-[var(--l-ink-2)]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
