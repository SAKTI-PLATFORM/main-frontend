'use client'

import { ProfileRadarChart } from '@/components/charts/profile-radar-chart'
import {
  DashboardError,
  DashboardLoading,
} from '@/components/dashboard/dashboard-status'
import { IncompleteOnboardingBanner } from '@/components/dashboard/incomplete-onboarding-banner'
import { TraitChip } from '@/components/dashboard/trait-chip'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  OCEAN_TRAIT_LABELS,
  RIASEC_TYPE_LABELS,
} from '@/features/onboarding/constants'
import { useDashboard } from '@/features/dashboard/use-dashboard'
import type { OceanTraitKey, RiasecTypeKey } from '@/types/seeker.types'

export default function PersonalityDashboardPage() {
  const state = useDashboard()

  if (state.status === 'loading') return <DashboardLoading />
  if (state.status === 'error') return <DashboardError />

  const { data } = state

  const oceanData = data.ocean
    ? Object.entries(data.ocean.scores).map(([key, value]) => ({
        label: OCEAN_TRAIT_LABELS[key as OceanTraitKey],
        value,
      }))
    : []
  const riasecData = data.riasec
    ? Object.entries(data.riasec.scores).map(([key, value]) => ({
        label: RIASEC_TYPE_LABELS[key as RiasecTypeKey],
        value,
      }))
    : []

  return (
    <div className="space-y-6 p-6">
      <IncompleteOnboardingBanner
        completeness={data.profileCompleteness}
        session={state.session}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">OCEAN Personality</CardTitle>
            </div>
            <CardDescription>
              {data.ocean
                ? `Big Five · Confidence ${Math.round(data.ocean.confidence)}%`
                : 'Belum ada data asesmen'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.ocean ? (
              <>
                <ProfileRadarChart
                  data={oceanData}
                  color="#6366f1"
                  gradientId="oceanRadar"
                  dashed
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  {Object.entries(data.ocean.scores).map(([key, value]) => (
                    <TraitChip
                      key={key}
                      label={OCEAN_TRAIT_LABELS[key as OceanTraitKey]}
                      value={value}
                      variant="ocean"
                      isNeuroticism={key === 'N'}
                    />
                  ))}
                </div>
              </>
            ) : (
              <EmptyAssessment />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">RIASEC Alignment</CardTitle>
            </div>
            <CardDescription>Holland code dari 3 tipe tertinggi</CardDescription>
          </CardHeader>
          <CardContent>
            {data.riasec ? (
              <>
                <ProfileRadarChart
                  data={riasecData}
                  color="#a78bfa"
                  gradientId="riasecRadar"
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  {Object.entries(data.riasec.scores).map(([key, value]) => (
                    <TraitChip
                      key={key}
                      label={RIASEC_TYPE_LABELS[key as RiasecTypeKey]}
                      value={value}
                      variant="riasec"
                    />
                  ))}
                </div>
              </>
            ) : (
              <EmptyAssessment />
            )}
          </CardContent>
        </Card>
      </div>

      {data.aiInsight && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="py-4">
            <p className="mb-1 text-sm font-semibold text-primary">
              Ringkasan Kepribadian
            </p>
            <p className="text-sm leading-relaxed text-foreground/80">
              {data.aiInsight.narrative}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function EmptyAssessment() {
  return (
    <p className="text-sm text-muted-foreground">
      Selesaikan asesmen psikometrik (Step 03) untuk melihat profil ini.
    </p>
  )
}
