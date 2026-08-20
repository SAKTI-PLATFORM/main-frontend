import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type {
  AssessmentResultResponse,
  DoubleDiamondResultResponse,
} from '@/types/career-onboarding.types'
import { CheckCircle2, Navigation, ShieldAlert } from 'lucide-react'

interface OnboardingResultOverviewProps {
  assessment: AssessmentResultResponse
  career: DoubleDiamondResultResponse
}

export function OnboardingResultOverview({
  assessment,
  career,
}: OnboardingResultOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <SummaryCard title="Ringkasan karier" text={career.career_summary} />
        <SummaryCard title="Gaya kerja" text={career.work_style_summary} />
        <SummaryCard title="Kesiapan" text={career.readiness_summary} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="size-4 text-emerald-600" />
              Kekuatan utama
            </CardTitle>
            <CardDescription>
              Sinyal konsisten dari profil, assessment, dan eksplorasi karier.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {career.strengths.map((strength) => (
              <Badge key={strength} variant="secondary">
                {strength}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldAlert className="size-4 text-amber-600" />
              Hambatan yang perlu disiapkan
            </CardTitle>
            <CardDescription>
              Area yang perlu diperkuat sebelum masuk ke role target.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {career.barriers?.length ? (
              career.barriers.map((barrier) => (
                <Badge key={barrier} variant="outline">
                  {barrier}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Tidak ada hambatan utama yang terdeteksi.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Navigation className="size-4 text-primary" />
            Rekomendasi arah karier
          </CardTitle>
          <CardDescription>
            Role terpilih {career.selected_role || 'belum dikonfirmasi'} · RIASEC{' '}
            {assessment.riasec.dominant_code}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {career.recommended_roles?.length ? (
            career.recommended_roles.map((role) => (
              <div key={role.code} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{role.label}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {role.reason}
                    </p>
                  </div>
                  <Badge>{Math.round(role.score * 100)}%</Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Belum ada role rekomendasi.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function SummaryCard({ title, text }: { title: string; text: string | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">
          {text || 'Belum ada ringkasan.'}
        </p>
      </CardContent>
    </Card>
  )
}
