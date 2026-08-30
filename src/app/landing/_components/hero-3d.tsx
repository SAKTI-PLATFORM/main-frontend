'use client'

import Image from 'next/image'
import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'
import { EASE } from './primitives'

/** Little increasing bar-chart glyph used on the floating cards. */
function MiniBars() {
  return (
    <span className="flex items-end gap-[3px]" aria-hidden>
      {[7, 11, 9, 15, 13].map((h, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-[var(--l-accent)]"
          style={{ height: h, opacity: 0.35 + i * 0.16 }}
        />
      ))}
    </span>
  )
}

/**
 * Hero visual: the real SAKTI dashboard as a floating 3D panel.
 * - entrance: unfolds from a flatter, lower angle
 * - idle: gentle CSS drift (.l-scene)
 * - pointer parallax: tilts toward the cursor (pointer devices only)
 * Fully static under prefers-reduced-motion.
 */
export function Hero3D() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-6, -26]), {
    stiffness: 90,
    damping: 18,
  })
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [12, 0]), {
    stiffness: 90,
    damping: 18,
  })

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  const handleLeave = () => {
    px.set(0)
    py.set(0)
  }

  const cardEntrance = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24, scale: 0.9 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { delay: 0.95 + i * 0.14, duration: 0.7, ease: EASE },
        }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="l-scene mx-auto w-full max-w-[24rem] sm:max-w-[30rem] lg:max-w-[38rem]"
    >
      <div className="l-hero-glow" aria-hidden />

      <motion.div
        style={{ transformStyle: 'preserve-3d' }}
        initial={
          reduced ? undefined : { opacity: 0, y: 70, rotateX: 24, scale: 0.9 }
        }
        animate={
          reduced ? undefined : { opacity: 1, y: 0, rotateX: 0, scale: 1 }
        }
        transition={{ delay: 0.3, duration: 1.15, ease: EASE }}
      >
        <motion.div
          className="l-deck"
          style={
            reduced
              ? { transform: 'rotateY(-15deg) rotateX(6deg)' }
              : { rotateY: rotY, rotateX: rotX }
          }
        >
          <div className="l-deck__screen">
            <Image
              src="/dashboard-preview.png"
              alt="Dashboard SAKTI: rekomendasi karier, skill gap, dan roadmap belajar"
              width={962}
              height={599}
              priority
              className="block h-auto w-full"
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 600px"
            />
          </div>

          {/* Career match card -------------------------------------- */}
          <motion.div
            className="l-deck__card"
            style={{ top: '-7%', left: '-9%', width: '58%', z: 70 }}
            {...cardEntrance(0)}
          >
            <span className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[var(--l-ink-3)]">
              Career match
            </span>
            <p className="mt-1.5 text-[0.9rem] font-semibold tracking-[-0.02em] text-[var(--l-ink)] [font-family:var(--font-space-grotesk)]">
              Full-Stack Tech Lead
            </p>
            <p className="text-[0.68rem] text-[var(--l-ink-3)]">
              MateCareer &middot; Jakarta
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <MiniBars />
              <span className="rounded-full bg-[var(--l-accent)] px-2 py-0.5 text-[0.62rem] font-semibold text-white">
                92% cocok
              </span>
            </div>
          </motion.div>

          {/* Skill gap card ---------------------------------------- */}
          <motion.div
            className="l-deck__card"
            style={{ bottom: '-8%', right: '-7%', width: '52%', z: 104 }}
            {...cardEntrance(1)}
          >
            <span className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[var(--l-ink-3)]">
              Analisis Skill Gap
            </span>
            <div className="mt-2 flex items-end gap-[5px]" aria-hidden>
              {[42, 70, 33, 55, 80, 48].map((h, i) => (
                <span
                  key={i}
                  className="w-2 rounded-sm bg-[var(--l-accent)]"
                  style={{ height: h * 0.45, opacity: 0.3 + (i % 3) * 0.28 }}
                />
              ))}
            </div>
            <p className="mt-2 text-[0.66rem] font-medium text-[var(--l-ink-2)]">
              Trending up 5,2% bulan ini &#8599;
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
