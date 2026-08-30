'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { testimonials } from '../_data'
import { Arrow, SectionHeading } from './primitives'

const AUTOPLAY = 6500

export function Testimonials() {
  const items = testimonials.items
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()

  const go = useCallback(
    (next: number) => {
      setDir(next > index || (index === items.length - 1 && next === 0) ? 1 : -1)
      setIndex((next + items.length) % items.length)
    },
    [index, items.length],
  )

  useEffect(() => {
    if (paused || reduced) return
    const id = setInterval(() => {
      setDir(1)
      setIndex((v) => (v + 1) % items.length)
    }, AUTOPLAY)
    return () => clearInterval(id)
  }, [paused, reduced, items.length])

  const item = items[index]

  return (
    <section
      className="l-panel-dark l-section overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="l-shell">
        <SectionHeading
          eyebrow={testimonials.eyebrow}
          headline={testimonials.headline}
          subtext={testimonials.subtext}
        />

        <div className="relative mt-14 min-h-[17rem] md:mt-20 md:min-h-[20rem]">
          <span
            aria-hidden
            className="pointer-events-none absolute -left-1 -top-6 select-none text-[5rem] leading-none text-[var(--l-on-dark)] opacity-[0.08] [font-family:var(--font-space-grotesk)] sm:-left-2 sm:-top-10 sm:text-[9rem] md:-top-14 md:text-[12rem]"
          >
            &ldquo;
          </span>

          <AnimatePresence mode="wait" custom={dir}>
            <motion.blockquote
              key={index}
              custom={dir}
              initial={
                reduced
                  ? { opacity: 0 }
                  : { opacity: 0, x: 64 * dir, filter: 'blur(10px)', scale: 0.97 }
              }
              animate={
                reduced
                  ? { opacity: 1 }
                  : { opacity: 1, x: 0, filter: 'blur(0px)', scale: 1 }
              }
              exit={
                reduced
                  ? { opacity: 0 }
                  : { opacity: 0, x: -64 * dir, filter: 'blur(10px)', scale: 0.97 }
              }
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="relative"
            >
              <p className="max-w-[26ch] text-[clamp(1.45rem,3.3vw,2.55rem)] font-medium leading-[1.18] tracking-[-0.02em] [font-family:var(--font-space-grotesk)]">
                {item.quote}
              </p>
              <footer className="mt-9 flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[var(--l-on-dark-line)] text-sm font-medium [font-family:var(--font-space-grotesk)]">
                  {item.name}
                </span>
                <span className="text-sm text-[var(--l-on-dark-2)]">
                  {item.role} &middot; {item.context}
                </span>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-between gap-6 border-t border-[var(--l-on-dark-line)] pt-6">
          <div className="flex flex-1 items-center gap-4">
            <span className="text-sm tracking-[0.08em] text-[var(--l-on-dark-2)] [font-family:var(--font-space-grotesk)]">
              0{index + 1}
              <span className="opacity-40"> / 0{items.length}</span>
            </span>
            {!reduced && (
              <span className="relative h-px w-full max-w-[9rem] overflow-hidden bg-[var(--l-on-dark-line)]">
                <motion.span
                  key={`${index}-${paused}`}
                  className="absolute inset-y-0 left-0 bg-[var(--l-on-dark)]"
                  initial={{ width: '0%' }}
                  animate={{ width: paused ? '0%' : '100%' }}
                  transition={{
                    duration: paused ? 0.3 : AUTOPLAY / 1000,
                    ease: 'linear',
                  }}
                />
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <motion.button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Testimoni sebelumnya"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              className="grid h-11 w-11 place-items-center rounded-full border border-[var(--l-on-dark-line)] text-[var(--l-on-dark)] transition-colors hover:bg-[var(--l-on-dark)] hover:text-[var(--l-ink)]"
            >
              <span className="rotate-180">
                <Arrow />
              </span>
            </motion.button>
            <motion.button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Testimoni berikutnya"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              className="grid h-11 w-11 place-items-center rounded-full border border-[var(--l-on-dark-line)] text-[var(--l-on-dark)] transition-colors hover:bg-[var(--l-on-dark)] hover:text-[var(--l-ink)]"
            >
              <Arrow />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
}
