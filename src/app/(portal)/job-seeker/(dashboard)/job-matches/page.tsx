'use client'

import {
  AlertCircle,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  MapPin,
  TrendingUp,
  Waypoints,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import {
  DashboardError,
  DashboardLoading,
} from '@/components/dashboard/dashboard-status'
import { AITurnTrail } from '@/components/career-pipeline/ai-turn-trail'
import { Badge } from '@/components/ui/badge'
import { MathCurveLoader } from '@/components/ui/math-curve-loader'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useCareerPipeline } from '@/features/career-pipeline/use-career-pipeline'
import { useDashboard } from '@/features/dashboard/use-dashboard'
import { cn } from '@/lib/utils'
import type {
  CareerCandidateRole,
  CareerMatchResult,
  CareerMatchScore,
  CareerSkillGap,
  JobMatcherResult,
} from '@/types/career-pipeline.types'

export default function JobMatchesPage() {
  const dashboard = useDashboard()
  const sessionId =
    dashboard.status === 'ready' && dashboard.session?.status === 'COMPLETED'
      ? dashboard.session.onboarding_session_id
      : null
  const pipeline = useCareerPipeline<JobMatcherResult>(sessionId, 'job-matcher')
  const [selectedId, setSelectedId] = useState('')

  if (dashboard.status === 'loading' || pipeline.loading) return <DashboardLoading />
  if (dashboard.status === 'error') return <DashboardError />
  if (!sessionId) return <OnboardingRequired />

  const busy =
    pipeline.generating ||
    pipeline.run?.status === 'PENDING' ||
    pipeline.run?.status === 'RUNNING'
  const result = pipeline.run?.status === 'COMPLETED' ? pipeline.run.result : null
  const rankedMatches = [...(result?.career_match_results ?? [])].sort(
    (left, right) => right.total_match_score - left.total_match_score,
  )
  const selectedMatch =
    rankedMatches.find((match) => match.match_id === selectedId) ?? rankedMatches[0]
  const selectedScore = result?.career_match_score_details.find(
    (score) => score.match_id === selectedMatch?.match_id,
  )
  const selectedRole = result?.candidate_roles.find(
    (role) => role.role_id === selectedMatch?.role_id,
  )
  const selectedGaps = result?.skill_gap_results.filter(
    (gap) => gap.match_id === selectedMatch?.match_id,
  ) ?? []

  return (
    <div className="min-h-full bg-[#F7F7FB] px-4 py-5 sm:px-6 sm:py-7">
      <div className="mx-auto max-w-[1480px] space-y-5">
        {pipeline.run?.status === 'FAILED' && (
          <PipelineNotice
            tone="error"
            title="Analisis belum berhasil"
            description={pipeline.run.errorMessage || 'JobMatcher gagal diproses setelah tiga percobaan otomatis.'}
          />
        )}
        {busy && (
          <>
            <PipelineNotice
              tone="loading"
              title="SAKTI AI sedang mencocokkan profilmu"
              description={`Kami membandingkan skill, pengalaman, psikometri, dan preferensimu. Percobaan ${pipeline.run?.attempt || 1} dari 3.`}
            />
            <AITurnTrail turns={pipeline.run?.turns} inFlight />
          </>
        )}
        {!pipeline.run && (
          <PipelineNotice
            tone="loading"
            title="Job Matches sedang disiapkan"
            description="Analisis otomatis dimulai setelah onboarding selesai. Hasil akan muncul di halaman ini tanpa perlu dijalankan manual."
          />
        )}

        {result && rankedMatches.length > 0 && selectedMatch && (
          <section className="grid items-start gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
              <div className="space-y-5 xl:sticky xl:top-5">
                <Card className="rounded-3xl bg-white shadow-[0_8px_30px_rgba(38,30,92,0.05)] ring-[#E9E7F2]">
                  <CardHeader className="border-b border-[#EFEDF5] px-5 pb-4">
                    <CardTitle className="text-lg font-bold">Peringkat role</CardTitle>
                    <CardDescription>Pilih role untuk melihat alasan, skor, dan skill gap.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 px-3 pb-0">
                    {rankedMatches.map((match, index) => (
                      <RoleListItem
                        key={match.match_id}
                        match={match}
                        rank={index + 1}
                        active={match.match_id === selectedMatch.match_id}
                        onSelect={() => setSelectedId(match.match_id)}
                      />
                    ))}
                  </CardContent>
                </Card>
                <VacancySection jobs={result.active_job_postings} />
              </div>

              <div className="space-y-5">
                <MatchDetail
                  match={selectedMatch}
                  role={selectedRole}
                  score={selectedScore}
                  gaps={selectedGaps}
                />
                <SkillGapSection gaps={selectedGaps} />
              </div>
          </section>
        )}
      </div>
    </div>
  )
}

function RoleListItem({
  match,
  rank,
  active,
  onSelect,
}: {
  match: CareerMatchResult
  rank: number
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'group flex w-full items-center gap-3 rounded-2xl p-3 text-left transition',
        active ? 'bg-[#F0EDFF] ring-1 ring-[#D9D2FF]' : 'hover:bg-[#F8F7FB]',
      )}
    >
      <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl text-xs font-bold', active ? 'bg-primary text-white' : 'bg-[#F0EEF5] text-[#797486]')}>
        {rank}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-[#302D37]">{match.role_name}</span>
        <span className="mt-1 flex items-center gap-2">
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E6E2EE]">
            <span className="block h-full rounded-full bg-gradient-to-r from-[#4D3FD2] to-[#8E82EA]" style={{ width: `${match.total_match_score}%` }} />
          </span>
          <span className="w-9 text-right text-xs font-bold text-primary">{Math.round(match.total_match_score)}%</span>
        </span>
      </span>
      <ChevronRight className={cn('size-4 shrink-0 transition', active ? 'text-primary' : 'text-[#BBB7C5] group-hover:translate-x-0.5')} />
    </button>
  )
}

function MatchDetail({
  match,
  role,
  score,
  gaps,
}: {
  match: CareerMatchResult
  role?: CareerCandidateRole
  score?: CareerMatchScore
  gaps: CareerSkillGap[]
}) {
  return (
    <Card className="rounded-3xl bg-white shadow-[0_8px_30px_rgba(38,30,92,0.05)] ring-[#E9E7F2]">
      <CardContent className="px-5 py-2 sm:px-6">
        <div className="flex flex-col justify-between gap-5 border-b border-[#EFEDF5] pb-6 sm:flex-row sm:items-start">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#EEEBFF] text-primary"><BriefcaseBusiness className="size-5" /></span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">Recommended</Badge>
                {role?.role_level && <Badge variant="outline">{role.role_level}</Badge>}
              </div>
              <h2 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-[#292631]">{match.role_name}</h2>
              <p className="mt-1 text-xs font-medium text-muted-foreground">{role?.role_category || 'Career recommendation'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-[#F5F3FF] px-4 py-3 sm:text-right">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#77709B]">Total match</p>
              <p className="text-2xl font-bold text-[#3D2DC2]">{Math.round(match.total_match_score)}%</p>
            </div>
            <TrendingUp className="size-6 text-[#8E82EA]" />
          </div>
        </div>

        <div className="py-5">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">Mengapa role ini cocok</p>
          <p className="mt-2 text-sm leading-7 text-[#625E6C]">{match.match_reason}</p>
          {role?.description && <p className="mt-3 rounded-xl bg-[#FAF9FC] p-3 text-xs leading-6 text-muted-foreground">{role.description}</p>}
        </div>

        {score && <ScoreBreakdown score={score} />}

        <div className="mt-5 flex flex-col gap-3 border-t border-[#EFEDF5] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground"><span className="font-bold text-[#3E3A47]">{gaps.length} skill gap</span> teridentifikasi untuk role ini.</p>
          <Link href={`/job-seeker/learning-paths?match=${encodeURIComponent(match.match_id)}`} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white transition hover:bg-primary/85">
            <Waypoints className="size-4" /> Buat learning path <ArrowRight className="size-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

function ScoreBreakdown({ score }: { score: CareerMatchScore }) {
  const items = [
    ['Skill', score.skill_match_score],
    ['Experience', score.experience_project_score],
    ['Education', score.education_score],
    ['RIASEC', score.riasec_fit_score],
    ['Workstyle', score.ocean_workstyle_score],
    ['Preference', score.preference_score],
  ] as const

  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">Breakdown kecocokan</p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-[#EEECF3] p-3">
            <div className="flex items-center justify-between gap-2 text-xs"><span className="text-muted-foreground">{label}</span><strong>{Math.round(value)}%</strong></div>
            <Progress value={value} className="mt-2 h-1.5" />
          </div>
        ))}
      </div>
    </div>
  )
}

function SkillGapSection({ gaps }: { gaps: CareerSkillGap[] }) {
  const ordered = [...gaps].sort((left, right) => priorityRank(left.priority) - priorityRank(right.priority))
  return (
    <Card className="rounded-3xl bg-white shadow-[0_8px_30px_rgba(38,30,92,0.05)] ring-[#E9E7F2]">
      <CardHeader className="border-b border-[#EFEDF5] px-5 pb-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div><CardTitle className="text-lg font-bold">Skill gap prioritas</CardTitle><CardDescription className="mt-1">Fokus pengembangan untuk role yang sedang dipilih.</CardDescription></div>
          <Badge variant="secondary">{gaps.length} skills</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 px-5 pb-1 sm:grid-cols-2 sm:px-6">
        {ordered.length ? ordered.map((gap) => <SkillGapCard key={gap.gap_id} gap={gap} />) : (
          <div className="col-span-full flex min-h-28 items-center justify-center rounded-2xl bg-emerald-50 px-4 text-center text-sm font-medium text-emerald-700">
            <CheckCircle2 className="mr-2 size-5" /> Tidak ada skill gap yang teridentifikasi untuk role ini.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SkillGapCard({ gap }: { gap: CareerSkillGap }) {
  const high = gap.priority.toLowerCase() === 'high'
  return (
    <article className="rounded-2xl border border-[#ECE9F2] p-4 transition hover:border-[#D8D1F7] hover:bg-[#FCFBFF]">
      <div className="flex items-start justify-between gap-3">
        <div><h3 className="font-bold text-[#312E38]">{gap.skill_name}</h3><p className="mt-1 text-xs text-muted-foreground">{gap.current_level} <ArrowRight className="mx-1 inline size-3" /> {gap.required_level}</p></div>
        <span className={cn('rounded-full px-2.5 py-1 text-[10px] font-bold uppercase', high ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700')}>{gap.priority}</span>
      </div>
      <p className="mt-3 line-clamp-3 text-xs leading-5 text-[#77727F]">{gap.reason}</p>
    </article>
  )
}

function VacancySection({ jobs }: { jobs: JobMatcherResult['active_job_postings'] }) {
  return (
    <Card className="rounded-3xl bg-white shadow-[0_8px_30px_rgba(38,30,92,0.05)] ring-[#E9E7F2]">
      <CardHeader className="border-b border-[#EFEDF5] px-5 pb-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><CardTitle className="flex items-center gap-2 text-lg font-bold"><BriefcaseBusiness className="size-5 text-primary" />Lowongan aktif</CardTitle><CardDescription className="mt-1">Peluang yang dapat kamu eksplorasi sekarang.</CardDescription></div>
          <Badge variant="secondary">{jobs.length} ditemukan</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 px-4 pb-0">
        {jobs.map((job) => (
          <a key={job.url} href={job.url} target="_blank" rel="noreferrer" className="group rounded-2xl border border-[#ECE9F2] p-4 transition hover:-translate-y-0.5 hover:border-[#CFC7F5] hover:shadow-[0_10px_24px_rgba(56,36,175,0.08)]">
            <div className="flex items-start justify-between gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#F0EDFF] text-primary"><Building2 className="size-4.5" /></span>
              <ExternalLink className="size-4 text-[#AAA5B4] transition group-hover:text-primary" />
            </div>
            <h3 className="mt-4 font-bold text-[#302D37]">{job.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{job.company}</p>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="size-3.5" />{job.location}</p>
          </a>
        ))}
      </CardContent>
    </Card>
  )
}

function PipelineNotice({ tone, title, description }: { tone: 'loading' | 'error'; title: string; description: string }) {
  return (
    <div className={cn('flex items-start gap-3 rounded-2xl border p-4', tone === 'loading' ? 'border-sky-100 bg-sky-50 text-sky-900' : 'border-rose-100 bg-rose-50 text-rose-900')}>
      <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl', tone === 'loading' ? 'bg-sky-100' : 'bg-rose-100')}>
        {tone === 'loading' ? <MathCurveLoader size={26} label="Memproses JobMatcher" /> : <AlertCircle className="size-4" />}
      </span>
      <div><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-5 opacity-75">{description}</p></div>
    </div>
  )
}

function OnboardingRequired() {
  return (
    <div className="min-h-full bg-[#F7F7FB] p-5 sm:p-7">
      <Card className="mx-auto max-w-2xl rounded-3xl bg-white ring-[#E9E7F2]">
        <CardContent className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-[#EEEBFF] text-primary"><BriefcaseBusiness className="size-6" /></span>
          <h1 className="mt-4 text-xl font-bold">Selesaikan onboarding terlebih dahulu</h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">JobMatcher membutuhkan profil, assessment, dan preferensi yang lengkap agar rekomendasinya akurat.</p>
          <Link className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white" href="/job-seeker/onboarding">Lanjutkan onboarding <ArrowRight className="size-4" /></Link>
        </CardContent>
      </Card>
    </div>
  )
}

function priorityRank(priority: string): number {
  return ({ high: 0, medium: 1, low: 2 } as Record<string, number>)[priority.toLowerCase()] ?? 3
}
