import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard'

const TOTAL_STEPS = 4

function parseStep(raw: string | undefined): number {
  const value = Number(raw)
  if (!Number.isInteger(value) || value < 0 || value > TOTAL_STEPS - 1) return 0
  return value
}

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>
}) {
  const { step } = await searchParams

  return (
    <div className="min-h-screen bg-white">
      <OnboardingWizard initialStep={parseStep(step)} />
    </div>
  )
}
