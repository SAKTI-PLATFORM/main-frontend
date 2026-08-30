'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'

const NAV_OFFSET = 104

/**
 * Smooth scrolling (Lenis) + smooth in-page anchor navigation.
 * Disabled entirely when the user prefers reduced motion.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      )
      if (!anchor) return
      const id = anchor.getAttribute('href')
      if (!id || id === '#') return
      const target = document.querySelector(id)
      if (!target) return
      event.preventDefault()
      lenis.scrollTo(target as HTMLElement, { offset: -NAV_OFFSET })
      history.replaceState(null, '', id)
    }

    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [reduced])

  return null
}

/** Thin accent bar at the very top that tracks scroll progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  })
  return <motion.div className="l-progress" style={{ scaleX }} aria-hidden />
}
