'use client'

import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CirclePlay,
  ExternalLink,
  FileText,
  LibraryBig,
  LockKeyhole,
  UserRoundCheck,
  Waypoints,
  Workflow,
} from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState, useSyncExternalStore } from 'react'
import {
  DashboardError,
  DashboardLoading,
} from '@/components/dashboard/dashboard-status'
import { AITurnTrail } from '@/components/career-pipeline/ai-turn-trail'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MathCurveLoader } from '@/components/ui/math-curve-loader'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useCareerPipeline } from '@/features/career-pipeline/use-career-pipeline'
import { useDashboard } from '@/features/dashboard/use-dashboard'
import { cn } from '@/lib/utils'
import type {
  JobMatcherResult,
  LearningPathStepResult,
  LearningResourceResult,
  TalentForgerResult,
} from '@/types/career-pipeline.types'

export default function LearningPathsPage() {
  const dashboard = useDashboard()
  const sessionId =
    dashboard.status === 'ready' && dashboard.session?.status === 'COMPLETED'
      ? dashboard.session.onboarding_session_id
      : null
  const matches = useCareerPipeline<JobMatcherResult>(sessionId, 'job-matcher')
  const requestedMatch = useSyncExternalStore(subscribeToLocation, readRequestedMatch, () => null)
  const [selection, setSelection] = useState('')

  const availableMatches = matches.run?.status === 'COMPLETED'
    ? [...(matches.run.result?.career_match_results ?? [])].sort(
        (left, right) => right.total_match_score - left.total_match_score,
      )
    : []
  const topMatchId = availableMatches[0]?.match_id ?? ''
  const selectedMatchId =
    selection ||
    (requestedMatch && availableMatches.some((match) => match.match_id === requestedMatch)
      ? requestedMatch
      : availableMatches[0]?.match_id) ||
    ''
  const selectedMatch = availableMatches.find((match) => match.match_id === selectedMatchId)
  // Reads the run saved for this exact role, so a roadmap generated earlier
  // comes straight back from the backend instead of being regenerated. Only the
  // top match is queued automatically, so only that one is worth waiting on.
  const learning = useCareerPipeline<TalentForgerResult>(sessionId, 'talent-forger', {
    matchId: selectedMatchId,
    pollWhenMissing: Boolean(selectedMatchId) && selectedMatchId === topMatchId,
  })

  if (dashboard.status === 'loading' || matches.loading || learning.loading) return <DashboardLoading />
  if (dashboard.status === 'error') return <DashboardError />
  if (!sessionId) return <OnboardingRequired />

  const busy =
    learning.generating ||
    learning.run?.status === 'PENDING' ||
    learning.run?.status === 'RUNNING'
  const result = learning.run?.status === 'COMPLETED' ? learning.run.result : null
  const awaitingAutoRun =
    !learning.run && Boolean(selectedMatchId) && selectedMatchId === topMatchId
  const needsManualGeneration = Boolean(
    selectedMatchId &&
      !busy &&
      (learning.run?.status === 'FAILED' || (!learning.run && !awaitingAutoRun)),
  )

  return (
    <div className="min-h-full bg-[#F7F7FB] px-4 py-5 sm:px-6 sm:py-7">
      <div className="mx-auto max-w-[1480px] space-y-5">
        <LearningRoleControl
          availableMatches={availableMatches}
          selectedMatchId={selectedMatchId}
          selectedRole={selectedMatch?.role_name}
          busy={busy}
          needsManualGeneration={needsManualGeneration}
          onSelect={setSelection}
          onGenerate={() => void learning.generate(selectedMatchId)}
        />

        {!availableMatches.length && <JobMatchesRequired />}
        {busy && (
          <>
            <PipelineNotice
              tone="loading"
              title="Roadmap-mu sedang disusun"
              description="TalentForger sedang memilih urutan skill, durasi, dan resource belajar yang paling relevan. Halaman ini akan diperbarui otomatis."
            />
            <AITurnTrail turns={learning.run?.turns} inFlight />
          </>
        )}
        {learning.run?.status === 'FAILED' && (
          <PipelineNotice
            tone="error"
            title="Learning path belum berhasil dibuat"
            description={learning.run.errorMessage || 'TalentForger gagal setelah tiga percobaan otomatis.'}
          />
        )}
        {availableMatches.length > 0 && awaitingAutoRun && (
          <PipelineNotice
            tone="loading"
            title="Learning path utama sedang disiapkan"
            description="Role dengan match tertinggi diproses otomatis. Kamu tetap dapat memilih role lain dan membuat roadmapnya setelah proses utama selesai."
          />
        )}
        {availableMatches.length > 0 && !learning.run && !awaitingAutoRun && (
          <PipelineNotice
            tone="idle"
            title="Roadmap untuk role ini belum dibuat"
            description="Role ini belum punya learning path tersimpan. Klik 'Buat learning path' untuk menyusunnya sekali — setelah itu hasilnya langsung dimuat dari data tersimpan."
          />
        )}
        {result && <LearningPathContent result={result} />}
      </div>
    </div>
  )
}

function LearningRoleControl({
  availableMatches,
  selectedMatchId,
  selectedRole,
  busy,
  needsManualGeneration,
  onSelect,
  onGenerate,
}: {
  availableMatches: JobMatcherResult['career_match_results']
  selectedMatchId: string
  selectedRole?: string
  busy: boolean
  needsManualGeneration: boolean
  onSelect: (value: string) => void
  onGenerate: () => void
}) {
  return (
    <section className="flex flex-col justify-between gap-4 border-b border-[#E7E4EE] pb-5 sm:flex-row sm:items-end">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">Learning path</p>
        <h1 className="mt-1 text-2xl font-bold tracking-[-0.02em] text-[#292631]">
          {selectedRole || 'Menyiapkan role terbaikmu'}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Role teratas dibuat otomatis. Pilih role lain jika ingin membuat roadmap tambahan.
        </p>
      </div>
      <div className="flex min-w-0 flex-col gap-2 sm:min-w-[430px] sm:flex-row">
        <label className="sr-only" htmlFor="learning-target-role">Target role</label>
            <select
              id="learning-target-role"
              value={selectedMatchId}
              onChange={(event) => onSelect(event.target.value)}
              disabled={!availableMatches.length || busy}
              className="h-11 min-w-0 flex-1 rounded-xl border border-[#DDD9E8] bg-white px-3 text-sm font-semibold text-[#302D37] outline-none focus:ring-2 focus:ring-primary/20"
            >
              {!availableMatches.length && <option value="">Job Matches belum tersedia</option>}
              {availableMatches.map((match) => (
                <option key={match.match_id} value={match.match_id}>
                  {match.role_name} · {Math.round(match.total_match_score)}%
                </option>
              ))}
            </select>
        {needsManualGeneration && (
          <Button
              size="lg"
              disabled={!selectedMatchId || busy}
              onClick={onGenerate}
              className="h-11 rounded-xl px-4 font-bold"
            >
              {busy ? <MathCurveLoader size={20} label="Menyusun roadmap" /> : <Workflow />}
              {busy ? 'Sedang diproses' : 'Buat learning path'}
            </Button>
        )}
      </div>
    </section>
  )
}

function LearningPathContent({ result }: { result: TalentForgerResult }) {
  const path = result.learning_paths[0]
  const steps = useMemo(
    () => [...result.learning_path_steps].sort((left, right) => left.step_order - right.step_order),
    [result.learning_path_steps],
  )
  const allResources = useMemo(
    () => dedupeResources([...result.learning_resources, ...result.free_materials]),
    [result.free_materials, result.learning_resources],
  )
  const [selectedStepId, setSelectedStepId] = useState('')
  const selectedStep = steps.find((step) => step.step_id === selectedStepId) ?? steps[0]
  const selectedResources = selectedStep
    ? resourcesForStep(selectedStep, result, allResources)
    : []
  if (!path) {
    return (
      <PipelineNotice
        tone="error"
        title="Roadmap kosong"
        description="Pipeline selesai tetapi belum menghasilkan learning path yang dapat ditampilkan."
      />
    )
  }

  return (
    <>
      <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <Card className="rounded-3xl bg-white shadow-[0_8px_30px_rgba(38,30,92,0.05)] ring-[#E9E7F2]">
          <CardHeader className="border-b border-[#EFEDF5] px-5 pb-4 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg font-bold"><Waypoints className="size-5 text-primary" />Roadmap belajar</CardTitle>
                <CardDescription className="mt-1">Ikuti tahap secara berurutan untuk hasil yang optimal.</CardDescription>
              </div>
              <Badge className="bg-[#EEEBFF] text-[#5142C7] hover:bg-[#EEEBFF]">{path.learning_path_type}</Badge>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-1 sm:px-6">
            {steps.length > 0 ? (
              <div className="relative">
                <div className="absolute bottom-8 left-[19px] top-8 w-px bg-[#DDD8F0]" />
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <TimelineStep
                      key={step.step_id}
                      step={step}
                      index={index}
                      active={step.step_id === selectedStep?.step_id}
                      onSelect={() => setSelectedStepId(step.step_id)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-[#FAF9FC] p-6 text-center text-sm text-muted-foreground">Belum ada tahap belajar.</div>
            )}
          </CardContent>
        </Card>

        <StepResourcePanel step={selectedStep} resources={selectedResources} />
      </section>

      <ResourceLibrary resources={allResources} />
    </>
  )
}

function TimelineStep({
  step,
  index,
  active,
  onSelect,
}: {
  step: LearningPathStepResult
  index: number
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'relative flex w-full items-start gap-4 rounded-2xl p-3 text-left transition sm:p-4',
        active ? 'bg-[#F1EEFF] ring-1 ring-[#D8D1FF]' : 'hover:bg-[#FAF9FC]',
      )}
    >
      <span className={cn('relative z-10 grid size-10 shrink-0 place-items-center rounded-full border-4 border-white text-xs font-bold shadow-sm', active ? 'bg-primary text-white' : 'bg-[#EAE6F5] text-[#766F84]')}>
        {index + 1}
      </span>
      <span className="min-w-0 flex-1 py-0.5">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary">Minggu {step.week}</span>
          <span className="size-1 rounded-full bg-[#BBB5C8]" />
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{step.related_skill_name}</span>
        </span>
        <span className="mt-1 block text-sm font-bold text-[#302D37] sm:text-base">{step.topic}</span>
        <span className="mt-1 block text-xs leading-5 text-muted-foreground">{step.objective}</span>
      </span>
      <ArrowRight className={cn('mt-3 size-4 shrink-0 transition', active ? 'text-primary' : 'text-[#B8B3C1]')} />
    </button>
  )
}

function StepResourcePanel({
  step,
  resources,
}: {
  step?: LearningPathStepResult
  resources: LearningResourceResult[]
}) {
  return (
    <Card className="rounded-3xl bg-white shadow-[0_8px_30px_rgba(38,30,92,0.05)] ring-[#E9E7F2] xl:sticky xl:top-5">
      <CardHeader className="border-b border-[#EFEDF5] px-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">Resource tahap aktif</p>
            <CardTitle className="mt-1 text-lg font-bold">{step?.topic || 'Pilih tahap'}</CardTitle>
            <CardDescription className="mt-1">{step ? `Minggu ${step.week} · ${step.related_skill_name}` : 'Pilih salah satu tahap di roadmap.'}</CardDescription>
          </div>
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#EEEBFF] text-primary"><LibraryBig className="size-5" /></span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-0">
        {resources.length > 0 ? resources.map((resource) => (
          <ResourceCard key={`${resource.resource_id}-${resource.url}`} resource={resource} compact />
        )) : (
          <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl bg-[#FAF9FC] px-5 text-center">
            <BookOpen className="size-6 text-[#A39DAF]" />
            <p className="mt-2 text-sm font-semibold">Belum ada resource tertaut</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">Lihat library di bawah untuk materi lain dengan skill yang sama.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ResourceLibrary({ resources }: { resources: LearningResourceResult[] }) {
  const [filter, setFilter] = useState<'all' | 'free'>('all')
  const visible = filter === 'free' ? resources.filter((resource) => resource.is_free) : resources

  return (
    <Card className="rounded-3xl bg-white shadow-[0_8px_30px_rgba(38,30,92,0.05)] ring-[#E9E7F2]">
      <CardHeader className="border-b border-[#EFEDF5] px-5 pb-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><CardTitle className="flex items-center gap-2 text-lg font-bold"><BookOpen className="size-5 text-emerald-600" />Learning resource library</CardTitle><CardDescription className="mt-1">Kursus, sertifikasi, video, dan materi gratis untuk roadmap ini.</CardDescription></div>
          <div className="flex rounded-xl bg-[#F3F1F8] p-1">
            <button type="button" onClick={() => setFilter('all')} className={cn('rounded-lg px-3 py-1.5 text-xs font-semibold', filter === 'all' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground')}>Semua ({resources.length})</button>
            <button type="button" onClick={() => setFilter('free')} className={cn('rounded-lg px-3 py-1.5 text-xs font-semibold', filter === 'free' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground')}>Gratis ({resources.filter((item) => item.is_free).length})</button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 px-5 pb-1 md:grid-cols-2 xl:grid-cols-3 sm:px-6">
        {visible.map((resource) => <ResourceCard key={`${resource.resource_id}-${resource.url}`} resource={resource} />)}
      </CardContent>
    </Card>
  )
}

function ResourceCard({ resource, compact = false }: { resource: LearningResourceResult; compact?: boolean }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className={cn(
        'group block rounded-2xl border border-[#ECE9F2] transition hover:-translate-y-0.5 hover:border-[#CFC7F5] hover:shadow-[0_10px_24px_rgba(56,36,175,0.08)]',
        compact ? 'p-3.5' : 'p-4',
      )}
    >
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#F0EDFF] text-primary"><ResourceTypeIcon type={resource.resource_type} /></span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-sm font-bold leading-5 text-[#302D37]">{resource.resource_title}</h3>
            <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-[#AAA5B4] transition group-hover:text-primary" />
          </div>
          <p className="mt-1 truncate text-xs text-muted-foreground">{resource.provider}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Badge variant="secondary" className="text-[10px]">{resource.resource_type}</Badge>
        <Badge variant="outline" className="text-[10px]">{resource.estimated_duration_hours} jam</Badge>
        {resource.is_free && <Badge className="bg-emerald-50 text-[10px] text-emerald-700 hover:bg-emerald-50">Gratis</Badge>}
      </div>
      {!compact && <p className="mt-3 text-xs font-medium text-[#736D7E]">{resource.skill_name} · {resource.difficulty_level}</p>}
    </a>
  )
}

function JobMatchesRequired() {
  return (
    <Card className="rounded-3xl bg-white ring-[#E9E7F2]">
      <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 py-6 text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-amber-50 text-amber-600"><LockKeyhole className="size-6" /></span>
        <h2 className="mt-4 text-xl font-bold">Job Matches diperlukan</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">Learning path dibuat dari skill gap sebuah role. JobMatcher akan berjalan otomatis setelah onboarding selesai.</p>
        <Link href="/job-seeker/job-matches" className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white">Buka Job Matches <ArrowRight className="size-4" /></Link>
      </CardContent>
    </Card>
  )
}

function PipelineNotice({ tone, title, description }: { tone: 'loading' | 'idle' | 'error'; title: string; description: string }) {
  const palette = {
    loading: ['border-violet-100 bg-violet-50 text-violet-900', 'bg-violet-100'],
    idle: ['border-[#E7E4EE] bg-[#F8F7FB] text-[#3E3A47]', 'bg-[#EEEBFF] text-primary'],
    error: ['border-rose-100 bg-rose-50 text-rose-900', 'bg-rose-100'],
  }[tone]
  return (
    <div className={cn('flex items-start gap-3 rounded-2xl border p-4', palette[0])}>
      <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl', palette[1])}>
        {tone === 'loading' ? <MathCurveLoader size={26} label="Memproses learning path" /> : tone === 'idle' ? <Workflow className="size-4" /> : <AlertCircle className="size-4" />}
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
          <span className="grid size-14 place-items-center rounded-2xl bg-[#EEEBFF] text-primary"><UserRoundCheck className="size-6" /></span>
          <h1 className="mt-4 text-xl font-bold">Selesaikan onboarding terlebih dahulu</h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">Profil yang lengkap diperlukan untuk menyusun learning path yang personal dan relevan.</p>
          <Link className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white" href="/job-seeker/onboarding">Lanjutkan onboarding <ArrowRight className="size-4" /></Link>
        </CardContent>
      </Card>
    </div>
  )
}

function resourcesForStep(
  step: LearningPathStepResult,
  result: TalentForgerResult,
  resources: LearningResourceResult[],
): LearningResourceResult[] {
  const ids = result.resource_recommendations
    .filter((recommendation) => recommendation.step_id === step.step_id)
    .sort((left, right) => left.priority_order - right.priority_order)
    .map((recommendation) => recommendation.resource_id)
  const matched = ids
    .map((id) =>
      resources.find(
        (resource) =>
          resource.resource_id === id &&
          resource.skill_name.toLowerCase() === step.related_skill_name.toLowerCase(),
      ) ?? resources.find((resource) => resource.resource_id === id),
    )
    .filter((resource): resource is LearningResourceResult => Boolean(resource))
  if (matched.length > 0) return dedupeResources(matched)
  return resources
    .filter((resource) => resource.skill_name.toLowerCase() === step.related_skill_name.toLowerCase())
    .slice(0, 4)
}

function dedupeResources(resources: LearningResourceResult[]): LearningResourceResult[] {
  const seen = new Set<string>()
  return resources.filter((resource) => {
    const key = `${resource.skill_name}|${resource.resource_title}|${resource.url}`.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function ResourceTypeIcon({ type }: { type: string }) {
  const normalized = type.toLowerCase()
  if (normalized.includes('video')) return <CirclePlay className="size-4" />
  if (normalized.includes('cert')) return <BadgeCheck className="size-4" />
  if (normalized.includes('article') || normalized.includes('document')) return <FileText className="size-4" />
  return <BookOpen className="size-4" />
}

function subscribeToLocation(): () => void {
  return () => undefined
}

function readRequestedMatch(): string | null {
  return new URLSearchParams(window.location.search).get('match')
}
