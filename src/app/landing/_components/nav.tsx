'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { nav, navMega, navPanels, type NavIcon } from '../_data'
import { Arrow, Magnetic } from './primitives'

/* -------------------------------------------------------------- icons ----- */

function MenuIcon({ name }: { name: NavIcon }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  if (name === 'briefcase')
    return (
      <svg {...common}>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />
      </svg>
    )
  if (name === 'gem')
    return (
      <svg {...common}>
        <path d="M6 3h12l4 6-10 12L2 9l4-6ZM2 9h20M12 21 8 9l2-6M12 21l4-12-2-6" />
      </svg>
    )
  return (
    <svg {...common}>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="12" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <path d="M8.2 7.2 15.6 10.9M15.6 13.1 8.2 16.8" />
    </svg>
  )
}

function Chevron({ open }: { open: boolean }) {
  return (
    <motion.svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      <path
        d="M2.5 4.5 6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  )
}

/* -------------------------------------------------------------- panels ---- */

const PANEL_SPRING = { type: 'spring', stiffness: 380, damping: 32 } as const
const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
}

function FeatureRow({
  icon,
  title,
  desc,
  href,
  onNavigate,
}: {
  icon: NavIcon
  title: string
  desc: string
  href: string
  onNavigate: () => void
}) {
  return (
    <motion.div variants={rowVariants}>
      <Link
        href={href}
        onClick={onNavigate}
        className="group flex items-start gap-3.5 rounded-2xl p-3 transition-colors hover:bg-[#F3F0FF]"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#EDE8FF] text-[#5003FF] transition-transform duration-300 group-hover:scale-105">
          <MenuIcon name={icon} />
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[var(--l-ink)]">
            {title}
          </span>
          <span className="text-[0.8rem] leading-snug text-[var(--l-ink-3)]">
            {desc}
          </span>
        </span>
      </Link>
    </motion.div>
  )
}

function MegaMenu({ onNavigate }: { onNavigate: () => void }) {
  const [tab, setTab] = useState(navMega.tabs[0].id)
  const active = navMega.tabs.find((t) => t.id === tab) ?? navMega.tabs[0]

  return (
    <div className="grid w-[min(46rem,calc(100vw-2rem))] grid-cols-1 gap-2 sm:grid-cols-[15rem_1fr]">
      <div className="flex flex-col gap-1 sm:border-r sm:border-[var(--l-line)] sm:pr-2">
        {navMega.tabs.map((t) => {
          const isActive = t.id === tab
          return (
            <button
              key={t.id}
              type="button"
              onMouseEnter={() => setTab(t.id)}
              onFocus={() => setTab(t.id)}
              className="relative rounded-2xl px-3.5 py-3 text-left"
            >
              {isActive && (
                <motion.span
                  layoutId="nav-mega-tab"
                  className="absolute inset-0 -z-10 rounded-2xl bg-[#F3F0FF]"
                  transition={PANEL_SPRING}
                />
              )}
              <span
                className={`text-[1.05rem] font-semibold tracking-[-0.01em] transition-colors ${
                  isActive ? 'text-[var(--l-ink)]' : 'text-[var(--l-ink-2)]'
                }`}
              >
                {t.label}
              </span>
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden text-[0.8rem] leading-snug text-[var(--l-ink-3)]"
                  >
                    <span className="mt-1.5 block">{t.description}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col"
        >
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            className="flex flex-col"
          >
            {active.items.map((item) => (
              <FeatureRow key={item.title} {...item} onNavigate={onNavigate} />
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function SimplePanel({
  id,
  onNavigate,
}: {
  id: string
  onNavigate: () => void
}) {
  const items = navPanels[id] ?? []
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      className="flex w-[min(22rem,calc(100vw-2rem))] flex-col"
    >
      {items.map((item) => (
        <motion.div key={item.title} variants={rowVariants}>
          <Link
            href={item.href}
            onClick={onNavigate}
            className="flex flex-col gap-0.5 rounded-2xl p-3 transition-colors hover:bg-[#F3F0FF]"
          >
            <span className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[var(--l-ink)]">
              {item.title}
            </span>
            <span className="text-[0.8rem] leading-snug text-[var(--l-ink-3)]">
              {item.desc}
            </span>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}

/* -------------------------------------------------------------- nav ------- */

export function Nav() {
  const reduced = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSection, setMobileSection] = useState<string | null>('kegunaan')
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenId(null)
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }
  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = setTimeout(() => setOpenId(null), 140)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 md:pt-4">
      <div
        className="l-nav-wrap relative w-full max-w-[1180px]"
        onMouseLeave={scheduleClose}
        onMouseEnter={cancelClose}
      >
        <motion.div
          className={`l-nav ${scrolled ? 'is-scrolled' : ''}`}
          initial={reduced ? undefined : { y: -22, opacity: 0 }}
          animate={reduced ? undefined : { y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/landing"
            className="flex items-center"
            aria-label="SAKTI beranda"
            onClick={() => {
              setOpenId(null)
              setMobileOpen(false)
            }}
          >
            <Image
              src="/logo-white.png"
              alt="SAKTI"
              width={178}
              height={65}
              priority
              className="h-7 w-auto sm:h-[1.85rem]"
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.triggers.map((t) => {
              const isOpen = openId === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onMouseEnter={() => {
                    cancelClose()
                    setOpenId(t.id)
                  }}
                  onFocus={() => setOpenId(t.id)}
                  onClick={() => setOpenId(isOpen ? null : t.id)}
                  aria-expanded={isOpen}
                  className={`l-nav-link ${isOpen ? 'is-open' : ''}`}
                >
                  {t.label}
                  <Chevron open={isOpen} />
                </button>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link href={nav.masuk.href} className="l-nav-btn l-nav-btn--ghost hidden sm:inline-flex">
              {nav.masuk.label}
            </Link>
            <Magnetic strength={0.25}>
              <Link href={nav.cta.href} className="l-nav-btn l-nav-btn--solid">
                {nav.cta.label}
                <Arrow />
              </Link>
            </Magnetic>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileOpen}
              className="relative grid h-9 w-9 place-items-center rounded-full text-white transition-colors hover:bg-white/15 lg:hidden"
            >
              <span className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 block h-[1.5px] w-5 rounded bg-current transition-all duration-300 ${
                    mobileOpen ? 'top-1.5 rotate-45' : 'top-0.5'
                  }`}
                />
                <span
                  className={`absolute left-0 block h-[1.5px] w-5 rounded bg-current transition-all duration-300 ${
                    mobileOpen ? 'top-1.5 -rotate-45' : 'top-2.5'
                  }`}
                />
              </span>
            </button>
          </div>
        </motion.div>

        {/* desktop dropdown */}
        <AnimatePresence>
          {openId && (
            <motion.div
              key="nav-panel"
              className="absolute left-1/2 top-full hidden -translate-x-1/2 pt-2 lg:block"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={PANEL_SPRING}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
            >
              <motion.div
                layout
                transition={PANEL_SPRING}
                className="origin-top rounded-[22px] border border-[var(--l-line)] bg-white p-2.5 shadow-[0_28px_70px_-20px_rgba(20,21,29,0.35)]"
              >
                {openId === 'kegunaan' ? (
                  <MegaMenu onNavigate={() => setOpenId(null)} />
                ) : (
                  <SimplePanel id={openId} onNavigate={() => setOpenId(null)} />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.button
                type="button"
                aria-hidden
                tabIndex={-1}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 -z-10 cursor-default bg-[rgba(20,21,29,0.28)] lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.div
                className="absolute inset-x-0 top-full mt-2 origin-top overflow-hidden rounded-[24px] border border-[var(--l-line)] bg-white p-3 shadow-[0_28px_70px_-18px_rgba(20,21,29,0.4)] lg:hidden"
                initial={{ opacity: 0, y: -12, scaleY: 0.9 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -12, scaleY: 0.92 }}
                transition={PANEL_SPRING}
              >
                {nav.triggers.map((t) => {
                  const expanded = mobileSection === t.id
                  const items =
                    t.id === 'kegunaan'
                      ? navMega.tabs.flatMap((tab) => tab.items)
                      : navPanels[t.id] ?? []
                  return (
                    <div key={t.id} className="border-b border-[var(--l-line)] last:border-b-0">
                      <button
                        type="button"
                        onClick={() => setMobileSection(expanded ? null : t.id)}
                        aria-expanded={expanded}
                        className="flex w-full items-center justify-between py-3.5 text-left text-[1.05rem] font-semibold tracking-[-0.01em] text-[var(--l-ink)]"
                      >
                        {t.label}
                        <Chevron open={expanded} />
                      </button>
                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-1 pb-3">
                              {items.map((item) => (
                                <Link
                                  key={item.title}
                                  href={item.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="rounded-xl px-3 py-2.5 text-sm text-[var(--l-ink-2)] transition-colors hover:bg-[#F3F0FF]"
                                >
                                  <span className="block font-medium text-[var(--l-ink)]">
                                    {item.title}
                                  </span>
                                  <span className="block text-xs leading-snug text-[var(--l-ink-3)]">
                                    {item.desc}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}

                <div className="mt-3 flex flex-col gap-2">
                  <Link
                    href={nav.masuk.href}
                    onClick={() => setMobileOpen(false)}
                    className="grid h-11 place-items-center rounded-full border border-[var(--l-line)] text-sm font-semibold text-[var(--l-ink)]"
                  >
                    {nav.masuk.label}
                  </Link>
                  <Link
                    href={nav.cta.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#5003FF] text-sm font-semibold text-white"
                  >
                    {nav.cta.label}
                    <Arrow />
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
