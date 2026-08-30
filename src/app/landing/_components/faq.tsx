'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { faq } from '../_data'
import { ArrowLink, Reveal, SectionHeading, Stagger, staggerItem } from './primitives'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const reduced = useReducedMotion()

  return (
    <section id="faq" className="l-section scroll-mt-28">
      <div className="l-shell grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
        <div className="md:sticky md:top-32 md:self-start">
          <SectionHeading eyebrow={faq.eyebrow} headline={faq.headline} />
          <Reveal className="mt-8 block" variant="left" distance={16}>
            <ArrowLink href="/register" label={faq.cta.label} />
          </Reveal>
        </div>

        <Stagger className="flex flex-col border-t border-[var(--l-line)]" gap={0.07}>
          {faq.items.map((item, i) => {
            const isOpen = open === i
            return (
              <motion.div
                key={i}
                variants={staggerItem}
                className="border-b border-[var(--l-line)]"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center gap-5 py-6 text-left"
                >
                  <motion.span
                    aria-hidden
                    className="h-4 w-[3px] shrink-0 rounded-full bg-[var(--l-accent)]"
                    animate={{
                      opacity: isOpen ? 1 : 0,
                      scaleY: isOpen ? 1 : 0.3,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                  <span
                    className={`flex-1 text-[clamp(1.05rem,1.7vw,1.35rem)] font-medium tracking-[-0.02em] transition-colors [font-family:var(--font-space-grotesk)] ${
                      isOpen ? 'text-[var(--l-ink)]' : 'text-[var(--l-ink-2)] group-hover:text-[var(--l-ink)]'
                    }`}
                  >
                    {item.q}
                  </span>
                  <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--l-line)]">
                    <span className="absolute h-px w-3 bg-[var(--l-ink)]" />
                    <motion.span
                      className="absolute h-3 w-px bg-[var(--l-ink)]"
                      animate={{ scaleY: isOpen ? 0 : 1, rotate: isOpen ? 90 : 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    />
                  </span>
                </button>

                {reduced ? (
                  isOpen && (
                    <p className="max-w-[54ch] pb-6 pl-8 text-[0.98rem] leading-relaxed text-[var(--l-ink-2)]">
                      {item.a}
                    </p>
                  )
                ) : (
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
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
                          className="max-w-[54ch] pb-6 pl-8 text-[0.98rem] leading-relaxed text-[var(--l-ink-2)]"
                        >
                          {item.a}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
