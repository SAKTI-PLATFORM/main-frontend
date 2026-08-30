'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { footer } from '../_data'
import { Reveal, Stagger, staggerItem } from './primitives'

export function Footer() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end end'],
  })
  const markY = useTransform(scrollYProgress, [0, 1], [90, -10])
  const markOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 0.08])

  return (
    <footer
      ref={ref}
      className="l-footer relative overflow-hidden pt-20 pb-10"
    >
      <div className="l-shell relative z-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <Reveal variant="blur">
            <Image
              src="/logo-white.png"
              width={178}
              height={65}
              alt="SAKTI"
              className="h-9 w-auto"
            />
            <p className="mt-6 max-w-[34ch] text-sm leading-relaxed text-[var(--l-on-dark-2)]">
              {footer.tagline}
            </p>
          </Reveal>

          {Object.entries(footer.columns).map(([title, links], ci) => (
            <Stagger key={title} gap={0.05} delay={ci * 0.06} amount={0.4}>
              <motion.h4
                variants={staggerItem}
                className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--l-on-dark-2)]"
              >
                {title}
              </motion.h4>
              <ul className="mt-5 flex flex-col gap-3">
                {links.map((label) => (
                  <motion.li key={label} variants={staggerItem}>
                    <a
                      href="#top"
                      className="text-sm text-[var(--l-on-dark)] transition-opacity hover:opacity-60"
                    >
                      {label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </Stagger>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-[var(--l-on-dark-line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-[var(--l-on-dark-2)]">
            {footer.copyright}
          </span>
          <a
            href="#top"
            className="group inline-flex items-center gap-2 text-sm text-[var(--l-on-dark)]"
          >
            <span className="relative">
              Kembali ke atas
              <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
            >
              <path
                d="M8 13V3M3.5 7.5 8 3l4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>

      <motion.span
        aria-hidden
        style={
          reduced ? { opacity: 0.07 } : { y: markY, opacity: markOpacity }
        }
        className="pointer-events-none absolute -bottom-[0.18em] left-1/2 w-[120vw] -translate-x-1/2 select-none text-center text-[22vw] font-medium leading-none tracking-[-0.05em] text-[var(--l-on-dark)] [font-family:var(--font-space-grotesk)]"
      >
        SAKTI
      </motion.span>
    </footer>
  )
}
