'use client'

import Link from 'next/link'
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type Variants,
} from 'motion/react'
import type { Stat } from '../_data'

/* Shared motion language --------------------------------------------------- */

export const EASE = [0.16, 1, 0.3, 1] as const // expo-out
export const EASE_SOFT = [0.22, 1, 0.36, 1] as const
export const SPRING = { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 } as const
export const SPRING_SNAPPY = {
  type: 'spring',
  stiffness: 420,
  damping: 32,
  mass: 0.7,
} as const

/**
 * SSR-safe media query. Returns `false` until mounted, then tracks the query.
 * Use for "only on desktop" behaviour where a mobile-first default is correct.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const update = () => setMatches(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])

  return matches
}

/**
 * Reliable "reveal when visible" signal: IntersectionObserver on a container
 * ref, with a safety net that only triggers if the observer never fires for
 * *any* element on the page (seen on some iOS Safari / in-app browsers).
 * Once IO has proven to work once, every other instance trusts it and keeps
 * its scroll-triggered animation.
 */
let ioProven = false

function useReveal(amount = 0.2) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount })
  const [forced, setForced] = useState(false)

  useEffect(() => {
    if (inView) ioProven = true
  }, [inView])

  useEffect(() => {
    if (ioProven) return
    const t = setTimeout(() => {
      if (!ioProven) setForced(true)
    }, 3000)
    return () => clearTimeout(t)
  }, [])

  return { ref, revealed: inView || forced }
}

/* -------------------------------------------------------------------------- */
/*  Arrow icon                                                                 */
/* -------------------------------------------------------------------------- */

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M3 8h10M9 3.5 13.5 8 9 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/*  Reveal: fade / blur / slide on scroll into view                            */
/* -------------------------------------------------------------------------- */

type RevealTag = 'div' | 'section' | 'article' | 'li' | 'ul' | 'span' | 'p'
type RevealVariant = 'up' | 'fade' | 'blur' | 'scale' | 'left' | 'right'

function hiddenState(variant: RevealVariant, distance: number) {
  switch (variant) {
    case 'fade':
      return { opacity: 0 }
    case 'blur':
      return { opacity: 0, y: distance * 0.5, filter: 'blur(12px)' }
    case 'scale':
      return { opacity: 0, y: distance * 0.4, scale: 0.94 }
    case 'left':
      return { opacity: 0, x: -distance }
    case 'right':
      return { opacity: 0, x: distance }
    default:
      return { opacity: 0, y: distance }
  }
}

function shownState(variant: RevealVariant) {
  const base: Record<string, number | string> = { opacity: 1, y: 0, x: 0 }
  if (variant === 'blur') base.filter = 'blur(0px)'
  if (variant === 'scale') base.scale = 1
  return base
}

export function Reveal({
  children,
  as = 'div',
  className,
  delay = 0,
  distance = 28,
  variant = 'up',
  duration = 0.8,
  amount = 0.15,
}: {
  children: ReactNode
  as?: RevealTag
  className?: string
  delay?: number
  distance?: number
  variant?: RevealVariant
  duration?: number
  amount?: number
}) {
  const prefersReduced = useReducedMotion()
  const { ref, revealed } = useReveal(amount)
  const Comp = motion[as] as typeof motion.div

  if (prefersReduced) {
    return <Comp className={className}>{children}</Comp>
  }

  const hidden = hiddenState(variant, distance)

  return (
    <Comp
      ref={ref as never}
      className={className}
      initial={hidden}
      animate={revealed ? shownState(variant) : hidden}
      transition={{ duration, ease: EASE_SOFT, delay }}
    >
      {children}
    </Comp>
  )
}

/* -------------------------------------------------------------------------- */
/*  Stagger container + item                                                   */
/* -------------------------------------------------------------------------- */

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: EASE_SOFT },
  },
}

export function Stagger({
  children,
  className,
  gap = 0.08,
  delay = 0.04,
  as = 'div',
  amount = 0.2,
}: {
  children: ReactNode
  className?: string
  gap?: number
  delay?: number
  as?: RevealTag
  amount?: number
}) {
  const prefersReduced = useReducedMotion()
  const { ref, revealed } = useReveal(amount)
  const Comp = motion[as] as typeof motion.div

  if (prefersReduced) return <Comp className={className}>{children}</Comp>

  return (
    <Comp
      ref={ref as never}
      className={className}
      initial="hidden"
      animate={revealed ? 'show' : 'hidden'}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
    >
      {children}
    </Comp>
  )
}

/* -------------------------------------------------------------------------- */
/*  SplitText: per-word blur + rise reveal, for headings                       */
/* -------------------------------------------------------------------------- */

export function SplitText({
  text,
  as = 'h2',
  className,
  delay = 0,
  stagger = 0.05,
}: {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  delay?: number
  stagger?: number
}) {
  const prefersReduced = useReducedMotion()
  const { ref, revealed } = useReveal(0.25)
  const Tag = as
  const words = text.split(' ')

  if (prefersReduced) {
    return <Tag className={className}>{text}</Tag>
  }

  const from = { opacity: 0, y: '0.5em', filter: 'blur(8px)' }
  const to = { opacity: 1, y: '0em', filter: 'blur(0px)' }

  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <motion.span
            aria-hidden
            style={{
              display: 'inline-block',
              willChange: 'transform, filter, opacity',
            }}
            initial={from}
            animate={revealed ? to : from}
            transition={{
              duration: 0.6,
              ease: EASE_SOFT,
              delay: revealed ? delay + i * stagger : 0,
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}

/* -------------------------------------------------------------------------- */
/*  CountUp: animated statistic                                                */
/* -------------------------------------------------------------------------- */

export function CountUp({ stat, className }: { stat: Stat; className?: string }) {
  const prefersReduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [started, setStarted] = useState(false)
  const [display, setDisplay] = useState(stat.value ?? 0)

  const decimals = stat.decimals ?? 0
  const fmt = (n: number) =>
    new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(n)

  useEffect(() => {
    if (inView) ioProven = true
  }, [inView])

  useEffect(() => {
    if (ioProven) return
    const t = setTimeout(() => {
      if (!ioProven) setStarted(true)
    }, 3000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (stat.value === undefined) return
    if (prefersReduced) {
      setDisplay(stat.value)
      return
    }
    if (!inView && !started) return
    const controls = animate(0, stat.value, {
      duration: 1.9,
      ease: EASE,
      onUpdate: (v) => setDisplay(v),
    })
    return () => controls.stop()
  }, [inView, started, stat.value, prefersReduced])

  if (stat.value === undefined) {
    return <span className={className}>{stat.text}</span>
  }

  return (
    <span ref={ref} className={className}>
      {stat.prefix}
      {fmt(display)}
      {stat.suffix}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/*  Marquee: dual row, skews with scroll velocity                              */
/* -------------------------------------------------------------------------- */

export function Marquee({ items }: { items: string[] }) {
  const prefersReduced = useReducedMotion()
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, {
    stiffness: 300,
    damping: 50,
  })
  const skew = useTransform(smoothVelocity, [-2500, 0, 2500], [4, 0, -4], {
    clamp: true,
  })

  const track = (reverse = false) => (
    <div
      className={`l-marquee__track ${reverse ? 'l-marquee__track--rev' : ''}`}
      aria-hidden
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="px-[clamp(1rem,4vw,3rem)] text-[clamp(1.4rem,4.2vw,3rem)] font-medium tracking-[-0.03em] whitespace-nowrap [font-family:var(--font-space-grotesk)]">
            {item}
          </span>
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--l-accent)]" />
        </span>
      ))}
    </div>
  )

  return (
    <motion.div
      className="l-marquee flex flex-col gap-3 py-2"
      style={prefersReduced ? undefined : { skewX: skew }}
    >
      <div className="l-marquee__row">
        {track()}
        {track()}
      </div>
      <div className="l-marquee__row l-marquee__row--rev opacity-55">
        {track(true)}
        {track(true)}
      </div>
      <span className="sr-only">{items.join(', ')}</span>
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Magnetic: pull toward the cursor                                           */
/* -------------------------------------------------------------------------- */

export function Magnetic({
  children,
  strength = 0.4,
  className = '',
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const prefersReduced = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.6 })

  if (prefersReduced) {
    return <span className={`inline-flex ${className}`}>{children}</span>
  }

  const onMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={`inline-flex ${className}`}
    >
      {children}
    </motion.span>
  )
}

/* -------------------------------------------------------------------------- */
/*  CtaButton / ArrowLink                                                      */
/* -------------------------------------------------------------------------- */

type BtnVariant = 'solid' | 'accent' | 'ghost' | 'on-dark'

export function CtaButton({
  href,
  label,
  variant = 'solid',
  size,
  className = '',
  withArrow = true,
  magnetic = false,
}: {
  href: string
  label: string
  variant?: BtnVariant
  size?: 'sm'
  className?: string
  withArrow?: boolean
  magnetic?: boolean
}) {
  const variantClass =
    variant === 'accent'
      ? 'l-btn--accent'
      : variant === 'ghost'
        ? 'l-btn--ghost'
        : variant === 'on-dark'
          ? 'l-btn--on-dark'
          : ''

  const btn = (
    <Link
      href={href}
      className={`l-btn ${variantClass} ${size === 'sm' ? 'l-btn--sm' : ''} ${className}`}
    >
      <span className="l-btn__label">{label}</span>
      {withArrow && (
        <span className="l-btn__icon">
          <Arrow />
        </span>
      )}
    </Link>
  )

  return magnetic ? <Magnetic strength={0.35}>{btn}</Magnetic> : btn
}

export function ArrowLink({
  href,
  label,
  className = '',
  onDark = false,
}: {
  href: string
  label: string
  className?: string
  onDark?: boolean
}) {
  return (
    <Link
      href={href}
      className={`l-link ${className}`}
      style={onDark ? { color: 'var(--l-on-dark)' } : undefined}
    >
      <span className="l-link__line">{label}</span>
      <Arrow />
    </Link>
  )
}

/* -------------------------------------------------------------------------- */
/*  SectionHeading                                                             */
/* -------------------------------------------------------------------------- */

export function SectionHeading({
  eyebrow,
  headline,
  subtext,
  align = 'left',
  className = '',
}: {
  eyebrow: string
  headline: string
  subtext?: string
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div
      className={`flex flex-col gap-5 ${
        align === 'center' ? 'items-center text-center' : 'items-start'
      } ${className}`}
    >
      <Reveal variant="left" distance={18}>
        <span
          className={`l-eyebrow ${align === 'center' ? 'l-eyebrow--plain' : ''}`}
        >
          {eyebrow}
        </span>
      </Reveal>
      <SplitText
        text={headline}
        as="h2"
        className={`l-h2 ${align === 'center' ? 'max-w-[18ch]' : 'max-w-[20ch]'}`}
      />
      {subtext && (
        <Reveal delay={0.1} variant="blur">
          <p
            className={`l-lead ${align === 'center' ? 'mx-auto text-balance' : ''}`}
          >
            {subtext}
          </p>
        </Reveal>
      )}
    </div>
  )
}
