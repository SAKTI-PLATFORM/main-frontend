'use client'

import {
  AlertTriangle,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  Gauge,
  Sparkles,
  Target,
} from 'lucide-react'
import Link from 'next/link'
import {
  DashboardError,
  DashboardLoading,
} from '@/components/dashboard/dashboard-status'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useDashboard } from '@/features/dashboard/use-dashboard'
import { cn } from '@/lib/utils'
import type {
  CareerCandidate,
} from '@/types/career-onboarding.types'

export default function JobRoleMatchesPage() {
  const state = useDashboard()

  if (state.status === 'loading') return <DashboardLoading />
  if (state.status === 'error') return <DashboardError />

  const { career, assessment } = state

  if (!career) {
    return (
      <div className="min-h-full bg-[#F7F7FA] p-4 sm:p-6">
        <Card className="mx-auto max-w-3xl rounded-2xl border-dashed shadow-none">
          <CardContent className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BriefcaseBusiness className="size-5" />
            </div>
            <h1 className="mt-4 text-lg font-bold">Job &amp; Role Matches belum tersedia</h1>
            <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
              Selesaikan seluruh tahap onboarding dan Double Diamond untuk
              membuka rekomendasi role, kekuatan, kesiapan, serta analisis gaya
              kerja.
            </p>
            <Link
              href="/job-seeker/onboarding"
              className={cn(buttonVariants({ size: 'lg' }), 'mt-5')}
            >
              Lanjutkan Onboarding
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const confidence = normalizePercent(career.confidence_score)
  const roles = career.recommended_roles ?? []

  return (
    <div className="min-h-full bg-[#F7F7FA] p-4 sm:p-6">
      <div className="mx-auto max-w-[1540px] space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryMetric
            icon={Target}
            label="Bidang Terpilih"
            value={career.selected_field || 'Belum dipilih'}
            tone="orange"
          />
          <SummaryMetric
            icon={BriefcaseBusiness}
            label="Role Terpilih"
            value={career.selected_role || 'Belum dipilih'}
            tone="purple"
          />
          <SummaryMetric
            icon={Gauge}
            label="Confidence"
            value={`${Math.round(confidence)}%`}
            tone="blue"
          />
          <SummaryMetric
            icon={Brain}
            label="Profil RIASEC"
            value={assessment?.riasec.dominant_code || '—'}
            tone="green"
          />
        </div>

        <Card className="rounded-2xl border-[#ECECF2] shadow-none">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="size-5 text-primary" />
                  Role Matches
                </CardTitle>
                <CardDescription className="mt-1">
                  Rekomendasi role berdasarkan profil, assessment, dan proses
                  Double Diamond.
                </CardDescription>
              </div>
              <Badge variant="secondary">{roles.length} rekomendasi</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {roles.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {roles.map((role, index) => (
                  <RoleMatchCard
                    key={role.code}
                    role={role}
                    rank={index + 1}
                    selected={
                      career.selected_role === role.code ||
                      career.selected_role === role.label
                    }
                  />
                ))}
              </div>
            ) : (
              <EmptyMessage text="Belum ada role rekomendasi yang dihasilkan." />
            )}
          </CardContent>
        </Card>

        <div className="grid items-start gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <Card className="rounded-2xl border-[#ECECF2] shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="size-4 text-sky-600" />
                  Ringkasan Karier SAKTI AI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-foreground/75">
                  {career.career_summary || 'Belum ada ringkasan karier.'}
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <NarrativeCard
                icon={Brain}
                title="Gaya Kerja"
                text={career.work_style_summary}
                tone="blue"
              />
              <NarrativeCard
                icon={Gauge}
                title="Kesiapan"
                text={career.readiness_summary}
                tone="purple"
              />
            </div>

            <DetectedFields fields={career.detected_fields} />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <AttributeCard
              icon={CheckCircle2}
              title="Kekuatan"
              description="Modal utama yang mendukung kecocokan role."
              items={career.strengths}
              tone="positive"
            />
            <AttributeCard
              icon={AlertTriangle}
              title="Perlu Disiapkan"
              description="Area yang sebaiknya diperkuat sebelum melamar."
              items={career.barriers ?? []}
              tone="warning"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function RoleMatchCard({
  role,
  rank,
  selected,
}: {
  role: CareerCandidate
  rank: number
  selected: boolean
}) {
  const score = normalizePercent(role.score)

  return (
    <div className="rounded-2xl border bg-[#FCFCFE] p-4 sm:p-5">
      <div className="flex items-start gap-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
          #{rank}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-bold text-foreground">{role.label}</h2>
            {selected && (
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                Role terpilih
              </Badge>
            )}
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {role.reason}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Progress value={score} className="h-2 flex-1" />
            <span className="w-11 text-right text-sm font-bold text-primary">
              {Math.round(score)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetectedFields({ fields }: { fields: CareerCandidate[] }) {
  return (
    <Card className="rounded-2xl border-[#ECECF2] shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="size-4 text-orange-600" />
          Bidang yang Terdeteksi
        </CardTitle>
        <CardDescription>
          Kelompok bidang yang paling selaras selama eksplorasi.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {fields.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((field) => {
              const score = normalizePercent(field.score)
              return (
                <div key={field.code} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{field.label}</p>
                    <Badge variant="secondary">{Math.round(score)}%</Badge>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {field.reason}
                  </p>
                </div>
              )
            })}
          </div>
        ) : (
          <EmptyMessage text="Belum ada bidang yang terdeteksi." />
        )}
      </CardContent>
    </Card>
  )
}

function AttributeCard({
  icon: Icon,
  title,
  description,
  items,
  tone,
}: {
  icon: typeof CheckCircle2
  title: string
  description: string
  items: string[]
  tone: 'positive' | 'warning'
}) {
  const positive = tone === 'positive'

  return (
    <Card className="rounded-2xl border-[#ECECF2] shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className={cn('size-4', positive ? 'text-emerald-600' : 'text-amber-600')} />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item}
              className={cn(
                'rounded-xl px-3 py-2.5 text-sm leading-6',
                positive
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-amber-50 text-amber-800',
              )}
            >
              {item}
            </div>
          ))
        ) : (
          <EmptyMessage text={`Belum ada data ${title.toLowerCase()}.`} />
        )}
      </CardContent>
    </Card>
  )
}

function NarrativeCard({
  icon: Icon,
  title,
  text,
  tone,
}: {
  icon: typeof Brain
  title: string
  text: string | null
  tone: 'blue' | 'purple'
}) {
  return (
    <Card className="rounded-2xl border-[#ECECF2] shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className={cn('size-4', tone === 'blue' ? 'text-sky-600' : 'text-violet-600')} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-7 text-foreground/75">
          {text || `Belum ada ringkasan ${title.toLowerCase()}.`}
        </p>
      </CardContent>
    </Card>
  )
}

function SummaryMetric({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Target
  label: string
  value: string
  tone: 'blue' | 'green' | 'orange' | 'purple'
}) {
  const tones = {
    blue: 'bg-sky-50 text-sky-600',
    green: 'bg-emerald-50 text-emerald-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-violet-50 text-violet-600',
  }

  return (
    <Card size="sm" className="rounded-2xl border-[#ECECF2] shadow-none">
      <CardContent className="flex items-center gap-3 py-1">
        <div className={cn('flex size-9 shrink-0 items-center justify-center rounded-xl', tones[tone])}>
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-0.5 truncate text-base font-bold" title={value}>
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyMessage({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed bg-muted/30 p-5 text-center text-sm text-muted-foreground">
      {text}
    </div>
  )
}

function normalizePercent(value: number): number {
  const percent = value <= 1 ? value * 100 : value
  return Math.min(100, Math.max(0, Number.isFinite(percent) ? percent : 0))
}
