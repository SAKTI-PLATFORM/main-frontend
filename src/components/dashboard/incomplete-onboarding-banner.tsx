import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const TOTAL_STEPS = 4

interface IncompleteOnboardingBannerProps {
  /** profileCompleteness 0..100 (each onboarding section = 25%). */
  completeness: number
}

/**
 * Shown on the dashboard while onboarding is unfinished (e.g. the seeker only
 * completed step 1/2). Hidden once the profile is 100% complete.
 */
export function IncompleteOnboardingBanner({
  completeness,
}: IncompleteOnboardingBannerProps) {
  if (completeness >= 100) return null

  const stepsDone = Math.round((completeness / 100) * TOTAL_STEPS)
  // Resume at the first unfinished step (steps are completed in order).
  const resumeStep = Math.min(stepsDone, TOTAL_STEPS - 1)

  return (
    <Card className="border-amber-300/60 bg-amber-50">
      <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <Sparkles className="size-4" />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-amber-900">
              Profilmu belum lengkap — {stepsDone}/{TOTAL_STEPS} langkah selesai
            </p>
            <p className="text-xs text-amber-700">
              Selesaikan onboarding untuk membuka skor employability, matching,
              dan rekomendasi yang akurat.
            </p>
            <Progress
              value={completeness}
              className="h-1.5 max-w-xs bg-amber-200"
            />
          </div>
        </div>
        <Link
          href={`/job-seeker/onboarding?step=${resumeStep}`}
          className={`${buttonVariants()} shrink-0 gap-1.5`}
        >
          Lanjutkan Onboarding
          <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  )
}
