'use client'

import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  Brain,
  BriefcaseBusiness,
  ChevronRight,
  Compass,
  Gauge,
  MapPin,
  Sparkles,
  Target,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
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
  AssessmentResultResponse,
  DoubleDiamondResultResponse,
  OnboardingSessionResponse,
} from '@/types/career-onboarding.types'
import type { DashboardResponse } from '@/types/seeker.types'

const OCEAN_TRAITS = [
  { key: 'openness', label: 'Openness', short: 'O' },
  { key: 'conscientiousness', label: 'Conscientiousness', short: 'C' },
  { key: 'extraversion', label: 'Extraversion', short: 'E' },
  { key: 'agreeableness', label: 'Agreeableness', short: 'A' },
  { key: 'neuroticism', label: 'Neuroticism', short: 'N' },
] as const

const RIASEC_TRAITS = [
  { key: 'realistic', label: 'Realistic', short: 'R' },
  { key: 'investigative', label: 'Investigative', short: 'I' },
  { key: 'artistic', label: 'Artistic', short: 'A' },
  { key: 'social', label: 'Social', short: 'S' },
  { key: 'enterprising', label: 'Enterprising', short: 'E' },
  { key: 'conventional', label: 'Conventional', short: 'C' },
] as const

export default function SkillsDashboardPage() {
  const state = useDashboard()

  if (state.status === 'loading') return <DashboardLoading />
  if (state.status === 'error') return <DashboardError />

  const { data, assessment, career, session } = state
  const completed = session?.status === 'COMPLETED'
  const confidence = data.employabilityScore

  return (
    <div className="min-h-full bg-[#F7F7FA] p-4 sm:p-6">
      <div className="mx-auto max-w-[1540px] space-y-4">
        <div className="grid items-start gap-4 xl:grid-cols-[minmax(280px,0.88fr)_minmax(0,2.12fr)]">
          <aside className="space-y-4">
            <ProfileOverview profile={data.profile} completed={completed} />
            <OnboardingStatus
              session={session}
              progress={data.profileCompleteness}
            />
          </aside>

          <section className="min-w-0 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                icon={Gauge}
                label={completed ? 'Confidence' : 'Progress'}
                value={
                  completed && confidence != null
                    ? `${Math.round(confidence)}%`
                    : `${data.profileCompleteness}%`
                }
                badge={completed ? 'Final' : 'Auto-saved'}
                tone="blue"
              />
              <MetricCard
                icon={Brain}
                label="RIASEC Dominan"
                value={data.riasec?.hollandCode ?? '—'}
                badge={assessment ? 'Aktif' : 'Menunggu'}
                tone="green"
              />
              <MetricCard
                icon={Target}
                label="Bidang Terpilih"
                value={shortValue(career?.selected_field)}
                badge={career ? 'Terpilih' : 'Belum'}
                tone="orange"
              />
              <MetricCard
                icon={BriefcaseBusiness}
                label="Role Rekomendasi"
                value={career?.recommended_roles?.length.toString() ?? '—'}
                badge={career?.selected_role ? 'Terkurasi' : 'Menunggu'}
                tone="purple"
              />
            </div>

            <AssessmentTimeline assessment={assessment} career={career} />

            <CareerForecast career={career} assessment={assessment} />
          </section>
        </div>
      </div>
    </div>
  )
}

function ProfileOverview({
  profile,
  completed,
}: {
  profile: DashboardResponse['profile']
  completed: boolean
}) {
  const tags = [profile.targetRole, profile.field].filter(Boolean) as string[]

  return (
    <Card className="overflow-hidden rounded-2xl border-[#ECECF2] shadow-none">
      <CardContent className="p-0">
        <div className="flex items-start gap-4 border-b border-border/70 p-5">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">
            {initials(profile.fullName)}
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-base font-bold text-[#24242C]">
                  {profile.fullName}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {profile.professionalHeadline || 'Job Seeker SAKTI AI'}
                </p>
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  'shrink-0 border-0 text-[10px]',
                  completed
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700',
                )}
              >
                {completed ? 'Ready' : 'Onboarding'}
              </Badge>
            </div>
            <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" /> {profile.domicile || 'Indonesia'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-border/70">
          <ProfileFact label="Bidang" value={profile.field || 'Belum dipilih'} />
          <ProfileFact
            label="Target role"
            value={profile.targetRole || 'Belum dipilih'}
          />
        </div>

        <div className="space-y-3 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Profil Singkat
          </p>
          <p className="line-clamp-4 text-sm leading-6 text-foreground/75">
            {profile.profileSummary ||
              'Lengkapi profil dan onboarding agar SAKTI AI dapat menyusun ringkasan karier yang lebih akurat.'}
          </p>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function ProfileFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 bg-card px-5 py-4">
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate text-xs font-semibold text-foreground" title={value}>
        {value}
      </p>
    </div>
  )
}

function OnboardingStatus({
  session,
  progress,
}: {
  session: OnboardingSessionResponse | null
  progress: number
}) {
  const completed = session?.status === 'COMPLETED'

  return (
    <Card className="rounded-2xl border-[#ECECF2] shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Activity className="size-4 text-primary" />
            Status Onboarding
          </CardTitle>
          <span className="text-sm font-bold text-primary">{progress}%</span>
        </div>
        <CardDescription>
          {completed
            ? 'Seluruh tahap telah selesai.'
            : `Tahap aktif: ${humanizeStep(session?.current_step)}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} className="h-2" />
        <div className="grid grid-cols-5 gap-1">
          {Array.from({ length: 5 }, (_, index) => (
            <span
              key={index}
              className={cn(
                'h-1.5 rounded-full',
                progress >= (index + 1) * 20 ? 'bg-primary' : 'bg-muted',
              )}
            />
          ))}
        </div>
        {!completed && (
          <Link
            href="/job-seeker/onboarding"
            className={cn(buttonVariants({ size: 'lg' }), 'w-full')}
          >
            Lanjutkan Onboarding
            <ChevronRight className="size-4" />
          </Link>
        )}
      </CardContent>
    </Card>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  badge,
  tone,
}: {
  icon: LucideIcon
  label: string
  value: string
  badge: string
  tone: 'blue' | 'green' | 'orange' | 'purple'
}) {
  const tones = {
    blue: 'bg-sky-50 text-sky-600',
    green: 'bg-emerald-50 text-emerald-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-violet-50 text-violet-600',
  }

  return (
    <Card size="sm" className="gap-1 rounded-2xl border-[#ECECF2] py-2 shadow-none">
      <CardContent className="px-3 py-1">
        <div className="flex items-start justify-between gap-2">
          <div className={cn('flex size-7 items-center justify-center rounded-lg', tones[tone])}>
            <Icon className="size-3.5" />
          </div>
          <span className={cn('rounded-full px-2 py-0.5 text-[9px] font-semibold', tones[tone])}>
            {badge}
          </span>
        </div>
        <p className="mt-2 text-[11px] font-medium text-muted-foreground">{label}</p>
        <p className="mt-0.5 truncate text-xl font-bold tracking-tight text-[#27272F]" title={value}>
          {value}
        </p>
      </CardContent>
    </Card>
  )
}

function AssessmentTimeline({
  assessment,
  career,
}: {
  assessment: AssessmentResultResponse | null
  career: DoubleDiamondResultResponse | null
}) {
  const [mode, setMode] = useState<'OCEAN' | 'RIASEC' | 'DOUBLE_DIAMOND'>('OCEAN')
  const series =
    mode === 'OCEAN'
      ? OCEAN_TRAITS.map((trait) => ({
          key: trait.key,
          label: trait.label,
          short: trait.short,
          value: assessment ? clampScore(assessment.ocean[trait.key]) : 0,
        }))
      : mode === 'RIASEC'
        ? RIASEC_TRAITS.map((trait) => ({
            key: trait.key,
            label: trait.label,
            short: trait.short,
            value: assessment ? clampScore(assessment.riasec[trait.key]) : 0,
          }))
        : (career?.recommended_roles ?? career?.detected_fields ?? [])
            .slice(0, 6)
            .map((item) => ({
              key: item.code,
              label: item.label,
              short: compactLabel(item.label),
              value: ratioToPercent(item.score),
            }))
  const available =
    mode === 'DOUBLE_DIAMOND' ? series.length > 0 : assessment !== null
  const xFor = (index: number) =>
    series.length <= 1 ? 380 : 40 + index * (680 / (series.length - 1))
  const points = series
    .map((item, index) => `${xFor(index)},${148 - item.value * 1.08}`)
    .join(' ')

  return (
    <Card className="overflow-hidden rounded-2xl border-[#ECECF2] shadow-none">
      <CardHeader className="border-b border-border/70 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Activity className="size-4 text-primary" />
              Assessment &amp; Career Journey
            </CardTitle>
            <CardDescription className="mt-1">
              OCEAN, RIASEC, dan hasil Double Diamond dalam satu visual.
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-muted p-1">
            {(['OCEAN', 'RIASEC', 'DOUBLE_DIAMOND'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-[10px] font-medium transition-colors',
                  mode === item
                    ? 'bg-primary font-semibold text-white'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item === 'DOUBLE_DIAMOND' ? 'Double Diamond' : item}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-5">
        {available ? (
          <>
            <svg
              viewBox="0 0 760 165"
              role="img"
              aria-label={`Grafik skor ${mode}`}
              className="h-[165px] w-full overflow-visible"
            >
              <defs>
                <linearGradient id="oceanArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#6558E8" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#6558E8" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[40, 94, 148].map((y) => (
                <line
                  key={y}
                  x1="40"
                  x2="720"
                  y1={y}
                  y2={y}
                  stroke="#ECECF2"
                  strokeDasharray="4 6"
                />
              ))}
              <polygon
                points={`40,148 ${points} 720,148`}
                fill="url(#oceanArea)"
              />
              <polyline
                points={points}
                fill="none"
                stroke="#5147D9"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {series.map((item, index) => {
                const x = xFor(index)
                const y = 148 - item.value * 1.08
                return (
                  <g key={item.key}>
                    <circle cx={x} cy={y} r="5" fill="white" stroke="#5147D9" strokeWidth="3" />
                    <text x={x} y={y - 13} textAnchor="middle" fontSize="11" fontWeight="700" fill="#35343E">
                      {Math.round(item.value)}
                    </text>
                  </g>
                )
              })}
            </svg>
            <div
              className="grid gap-1 border-t pt-3"
              style={{ gridTemplateColumns: `repeat(${series.length}, minmax(0, 1fr))` }}
            >
              {series.map((item) => (
                <div key={item.key} className="min-w-0 text-center">
                  <p className="truncate text-xs font-bold text-foreground">{item.short}</p>
                  <p className="hidden truncate text-[9px] text-muted-foreground sm:block">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmptyPanel
            text={
              mode === 'DOUBLE_DIAMOND'
                ? 'Grafik Double Diamond tersedia setelah rekomendasi karier selesai dibuat.'
                : 'Grafik psychometric tersedia setelah assessment OCEAN dan RIASEC selesai.'
            }
          />
        )}
      </CardContent>
    </Card>
  )
}

function CareerForecast({
  career,
  assessment,
}: {
  career: DoubleDiamondResultResponse | null
  assessment: AssessmentResultResponse | null
}) {
  const roles = career?.recommended_roles?.slice(0, 3) ?? []

  return (
    <Card className="rounded-2xl border-[#ECECF2] shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Compass className="size-4 text-primary" />
              Career Forecast
            </CardTitle>
            <CardDescription className="mt-1">
              Rekomendasi berdasarkan assessment dan Double Diamond.
            </CardDescription>
          </div>
          {assessment && (
            <Badge variant="secondary">RIASEC {assessment.riasec.dominant_code}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {career ? (
          <>
            {roles.length > 0 ? (
              <div className="grid gap-3 lg:grid-cols-3">
                {roles.map((role) => {
                const score = ratioToPercent(role.score)
                return (
                  <div key={role.code} className="flex min-h-28 items-center gap-3 rounded-xl border bg-[#FCFCFE] p-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-xs font-bold">{role.label}</p>
                        {career.selected_role === role.code || career.selected_role === role.label ? (
                          <Badge className="bg-emerald-100 text-[9px] text-emerald-700 hover:bg-emerald-100">Terpilih</Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 line-clamp-3 text-xs leading-5 text-muted-foreground">{role.reason}</p>
                    </div>
                    <ScoreRing value={score} />
                  </div>
                )
                })}
              </div>
            ) : (
              <EmptyPanel text="Belum ada role rekomendasi." compact />
            )}

            <div className="rounded-xl border border-sky-100 bg-sky-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-sky-600">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-sky-900">SAKTI AI Report</p>
                  <p className="mt-1 text-xs leading-5 text-sky-900/70">
                    {career.career_summary || 'Belum ada ringkasan karier.'}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyPanel text="Career forecast tersedia setelah seluruh rangkaian onboarding selesai." />
        )}
      </CardContent>
    </Card>
  )
}

function ScoreRing({ value }: { value: number }) {
  return (
    <div
      className="flex size-12 shrink-0 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(#5147D9 ${value}%, #E9E9F2 ${value}% 100%)`,
      }}
    >
      <div className="flex size-9 items-center justify-center rounded-full bg-white text-[10px] font-bold">
        {Math.round(value)}%
      </div>
    </div>
  )
}

function EmptyPanel({ text, compact = false }: { text: string; compact?: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl border border-dashed bg-muted/30 px-5 text-center text-xs leading-5 text-muted-foreground',
        compact ? 'min-h-20' : 'min-h-40',
      )}
    >
      {text}
    </div>
  )
}

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0))
}

function ratioToPercent(value: number): number {
  return clampScore(value <= 1 ? value * 100 : value)
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || '?'
}

function shortValue(value: string | null | undefined): string {
  if (!value) return '—'
  return value.length > 18 ? `${value.slice(0, 16)}…` : value
}

function compactLabel(value: string): string {
  const words = value.trim().split(/\s+/)
  if (words.length > 1) {
    return words.map((word) => word[0]).join('').slice(0, 4).toUpperCase()
  }
  return value.slice(0, 8)
}

function humanizeStep(step: OnboardingSessionResponse['current_step'] | undefined): string {
  if (!step) return 'Mulai onboarding'
  return (
    {
      CV_UPLOAD: 'Upload CV',
      IDENTITY: 'Review profil CV',
      OCEAN: 'Assessment OCEAN',
      RIASEC: 'Assessment RIASEC',
      DIVERGE_1: 'Eksplorasi bidang',
      CONVERGE_1: 'Pemilihan bidang',
      DIVERGE_2: 'Eksplorasi role',
      CONVERGE_2: 'Pemilihan role',
      PREFERENCE: 'Preferensi akhir',
      COMPLETE: 'Selesai',
    } satisfies Record<OnboardingSessionResponse['current_step'], string>
  )[step]
}
