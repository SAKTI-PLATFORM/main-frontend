import { Binoculars, Brain, Check, CheckCircle2, CircleUser } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { OnboardingCurrentStep } from '@/types/career-onboarding.types'

const STAGES = [
  { title: 'Profil', caption: 'CV & identitas', icon: CircleUser },
  { title: 'Psikometri', caption: 'OCEAN & RIASEC', icon: Brain },
  { title: 'Eksplorasi Karier', caption: 'Double Diamond', icon: Binoculars },
  { title: 'Selesai', caption: 'Preferensi & siap matching', icon: CheckCircle2 },
] as const

/**
 * Maps a session's current_step to one of the 4 onboarding stages above.
 * Profil covers both CV_UPLOAD and IDENTITY (upload, then later review) —
 * Psikometri (OCEAN/RIASEC) now runs in the background-parsing window
 * between them, so it's not a strict linear walk through this list.
 */
export function onboardingStageIndex(step: OnboardingCurrentStep): number {
  if (step === 'OCEAN' || step === 'RIASEC') return 1
  if (
    step === 'DIVERGE_1' ||
    step === 'CONVERGE_1' ||
    step === 'DIVERGE_2' ||
    step === 'CONVERGE_2'
  ) {
    return 2
  }
  if (step === 'PREFERENCE' || step === 'COMPLETE') return 3
  return 0 // CV_UPLOAD, IDENTITY
}

/**
 * The one onboarding sidebar, shared by every onboarding screen (CV upload,
 * profile review, OCEAN/RIASEC, Double Diamond, preference) — styled to
 * match the main dashboard's Sidebar (`components/dashboard/sidebar.tsx`)
 * exactly: same shell, borders, spacing, and nav-row treatment, so moving
 * between onboarding and the dashboard doesn't feel like two different apps.
 */
export function OnboardingSidebar({ activeIndex }: { activeIndex: number }) {
  return (
    <aside className="sticky top-0 z-30 hidden h-screen w-[264px] shrink-0 flex-col border-r border-[#ECECF2] bg-white md:flex">
      <div className="flex h-16 shrink-0 items-center border-b border-[#F0F0F5] px-6">
        <Image src="/logo.png" alt="SAKTI AI" width={584} height={211} className="h-9 w-auto" priority />
      </div>

      <nav aria-label="Tahapan onboarding" className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
        <p className="px-3 pb-3 text-[11px] font-semibold tracking-[0.08em] text-[#9A9AAB] uppercase">
          Progress Onboarding
        </p>
        <div>
          {STAGES.map((stage, index) => {
            const done = index < activeIndex
            const active = index === activeIndex
            const isLast = index === STAGES.length - 1
            const Icon = stage.icon
            return (
              <div key={stage.title} className="grid grid-cols-[36px_1fr] gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      'flex size-9 shrink-0 items-center justify-center rounded-lg',
                      done || active ? 'bg-[#4138D8] text-white' : 'bg-[#EEEEF3] text-[#9A9AAB]',
                    )}
                  >
                    {done ? (
                      <Check className="size-4" strokeWidth={2.6} />
                    ) : (
                      <Icon className="size-4" strokeWidth={active ? 2.2 : 1.9} />
                    )}
                  </span>
                  {!isLast && (
                    <span
                      className={cn('mt-1 w-px min-h-6 flex-1', done ? 'bg-[#4138D8]/40' : 'bg-[#E4E4EC]')}
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className={cn('min-w-0', isLast ? 'pb-2' : 'pb-6')}>
                  <p
                    className={cn(
                      'pt-1.5 text-[15px] leading-5',
                      active
                        ? 'font-semibold text-[#4138D8]'
                        : done
                          ? 'font-medium text-[#3B3B4C]'
                          : 'font-medium text-[#9293A2]',
                    )}
                  >
                    {stage.title}
                  </p>
                  <p
                    className={cn(
                      'mt-0.5 truncate text-xs leading-4',
                      active ? 'text-[#4138D8]/70' : 'text-[#9A9AAB]',
                    )}
                  >
                    {stage.caption}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}
