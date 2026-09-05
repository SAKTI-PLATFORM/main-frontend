'use client'

import {
  ArrowUpRight,
  BarChart2,
  Binoculars,
  Bot,
  Brain,
  Briefcase,
  BriefcaseBusiness,
  ChartNoAxesColumn,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleUser,
  FileDown,
  Library,
  Play,
  Repeat2,
  ShieldCheck,
  Target,
  TriangleAlert,
  Users,
  Waypoints,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  DashboardError,
  DashboardLoading,
} from '@/components/dashboard/dashboard-status'
import { useDashboardView } from '@/components/dashboard/dashboard-view'
import { useDashboard } from '@/features/dashboard/use-dashboard'
import { cn } from '@/lib/utils'
import type {
  AssessmentResultResponse,
  DoubleDiamondResultResponse,
  OnboardingSessionResponse,
} from '@/types/career-onboarding.types'
import type {
  JobMatcherResult,
  PipelineRun,
  TalentForgerResult,
} from '@/types/career-pipeline.types'
import type { DashboardResponse } from '@/types/seeker.types'

type Profile = DashboardResponse['profile']
type Ocean = NonNullable<AssessmentResultResponse['ocean']>
type Riasec = NonNullable<AssessmentResultResponse['riasec']>
type JobMatcherRun = PipelineRun<JobMatcherResult> | null
type LearningPathRun = PipelineRun<TalentForgerResult> | null

const ONBOARDING_STEPS = [
  {
    title: 'Profil',
    description:
      'Unggah CV dan periksa kembali identitas, pengalaman, pendidikan, skill, serta proyekmu.',
  },
  {
    title: 'Psikometri',
    description:
      'Kenali kepribadian dan minat kariermu melalui asesmen OCEAN dan RIASEC.',
  },
  {
    title: 'Eksplorasi Karier',
    description:
      'Temukan bidang dan role yang paling sesuai melalui proses Double Diamond.',
  },
  {
    title: 'Preferensi & Selesai',
    description:
      'Tentukan preferensi kerja akhir dan siapkan profilmu untuk proses matching.',
  },
] as const

const OCEAN_BARS = [
  { key: 'openness', label: 'Open' },
  { key: 'conscientiousness', label: 'Consc' },
  { key: 'extraversion', label: 'Extra' },
  { key: 'agreeableness', label: 'Agree' },
  { key: 'neuroticism', label: 'Neuro' },
] as const

const RIASEC_BARS = [
  { key: 'realistic', label: 'Real' },
  { key: 'investigative', label: 'Inv' },
  { key: 'artistic', label: 'Art' },
  { key: 'social', label: 'Soc' },
  { key: 'enterprising', label: 'Ent' },
  { key: 'conventional', label: 'Con' },
] as const

export default function JobSeekerHomePage() {
  const state = useDashboard()
  const { view } = useDashboardView()

  if (state.status === 'loading') return <DashboardLoading />
  if (state.status === 'error') return <DashboardError />

  const { data, assessment, career, session, jobMatcher, learningPath } = state
  const psikometri = view === 'psikometri'

  return (
    <div className="px-5 py-6 sm:px-8">
      <div
        className={cn(
          'mx-auto grid max-w-[1400px] items-start gap-6',
          psikometri
            ? 'xl:grid-cols-[minmax(0,1fr)_minmax(340px,1fr)]'
            : 'xl:grid-cols-[minmax(0,1.12fr)_minmax(340px,0.88fr)]',
        )}
      >
        <div className="min-w-0 space-y-5">
          <GreetingBlock profile={data.profile} />

          {psikometri ? (
            <>
              <FeatureLinks />
              <PsychometricAccordion assessment={assessment} career={career} />
            </>
          ) : (
            <section className="overflow-hidden rounded-lg ring-1 ring-[#ECECF2]">
              <WeeklyLearningCard learningPath={learningPath} />
              <SkillGapCard jobMatcher={jobMatcher} />
            </section>
          )}
        </div>

        {psikometri ? (
          <SaktiInsightsPanel
            assessment={assessment}
            career={career}
            targetRole={data.profile.targetRole}
          />
        ) : (
          <aside className="rounded-lg bg-white ring-1 ring-[#ECECF2]">
            <CareerForecastsSection career={career} jobMatcher={jobMatcher} />
            <div className="mx-5 border-t border-[#EFEFF4]" />
            <ProfileCompletionSection session={session} />
          </aside>
        )}
      </div>
    </div>
  )
}

function GreetingBlock({ profile }: { profile: Profile }) {
  const summary =
    profile.profileSummary?.trim() ||
    'Lengkapi profil dan onboarding agar SAKTI AI dapat menyusun ringkasan karier yang lebih akurat.'
  const shortSummary =
    summary.length > 220 ? `${summary.slice(0, 220).trimEnd()}…` : summary

  return (
    <section>
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-heading text-[26px] leading-[39px] font-bold tracking-[-0.01em] text-[#1F1F27] sm:text-[28px] sm:leading-[42px]">
          <span className="font-medium text-[#5C5C6A]">Hai,</span>{' '}
          {profile.fullName}!
        </h1>
        <div className="flex shrink-0 items-center divide-x divide-[#E4E3F0] overflow-hidden rounded-md border border-[#E4E3F0]">
          <IconSquare label="Buka profil" href="/job-seeker/onboarding">
            <ArrowUpRight className="size-4" />
          </IconSquare>
          <IconSquare label="Unduh ringkasan" disabled>
            <FileDown className="size-4" />
          </IconSquare>
          {profile.linkedinUrl ? (
            <IconSquare label="LinkedIn" href={profile.linkedinUrl} external>
              <LinkedinBadge className="size-4" />
            </IconSquare>
          ) : (
            <IconSquare label="LinkedIn" disabled>
              <LinkedinBadge className="size-4" />
            </IconSquare>
          )}
        </div>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6C6C7A]">
        {shortSummary}{' '}
        <Link
          href="/job-seeker/onboarding"
          className="font-semibold text-[#4138D8] hover:underline"
        >
          Lihat Profil →
        </Link>
      </p>
    </section>
  )
}

function IconSquare({
  children,
  label,
  href,
  external,
  disabled,
}: {
  children: React.ReactNode
  label: string
  href?: string
  external?: boolean
  disabled?: boolean
}) {
  const classes =
    'flex size-9 items-center justify-center bg-white text-[#5B5B6E] transition-colors hover:bg-[#F4F3FB] hover:text-[#4138D8] disabled:pointer-events-none disabled:opacity-40'

  if (href && !disabled) {
    return (
      <Link
        href={href}
        aria-label={label}
        title={label}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  )
}

// Rounded-square "in" badge (background follows currentColor, so it tracks
// the same gray → purple hover as the other two icons in the group).
function LinkedinBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="currentColor" />
      <circle cx="7.9" cy="8.3" r="1.6" fill="#fff" />
      <path
        fill="#fff"
        d="M6.7 10.4h2.4V18H6.7v-7.6Zm4.15 0h2.3v1.04h.03c.32-.6 1.1-1.24 2.27-1.24 2.43 0 2.88 1.6 2.88 3.68V18h-2.4v-3.65c0-.87-.02-1.99-1.21-1.99-1.22 0-1.4.95-1.4 1.93V18h-2.4v-7.6Z"
      />
    </svg>
  )
}

function FeatureLinks() {
  const { view, setView } = useDashboardView()

  return (
    <div className="grid grid-cols-3 divide-x divide-[#EEEEF4]">
      <FeatureAction
        icon={Brain}
        active={view === 'psikometri'}
        onClick={() => setView('psikometri')}
      >
        Psikometri Hasil Sakti
      </FeatureAction>
      <FeatureAction icon={Library} href="/job-seeker/learning-paths">
        Roadmap Belajar
      </FeatureAction>
      <FeatureAction icon={Bot}>Chatbot Sakti</FeatureAction>
    </div>
  )
}

function FeatureAction({
  children,
  href,
  onClick,
  icon: Icon,
  active,
}: {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  icon: typeof Brain
  active?: boolean
}) {
  const inner = (
    <>
      <Icon
        className={cn(
          'size-4 transition-colors',
          active ? 'text-[#4138D8]' : 'text-[#9293A2] group-hover:text-[#4138D8]',
        )}
      />
      <span
        className={cn(
          'text-[11px] font-medium leading-4',
          active ? 'text-[#4138D8]' : 'text-[#5C5C6A]',
        )}
      >
        {children}
      </span>
    </>
  )
  const classes =
    'group flex flex-col items-start gap-1.5 px-3 text-left first:pl-0 last:pr-0'

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    )
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {inner}
      </button>
    )
  }
  return (
    <button type="button" className={classes} title="Segera hadir">
      {inner}
    </button>
  )
}

/**
 * Weekly roadmap nudge, driven entirely by the latest TalentForger run
 * (`useDashboard().learningPath`). No completed roadmap -> CTA / status only.
 * The backend has no per-module completion tracking yet, so "progress" is the
 * position of the active week within the plan's own week count.
 */
function WeeklyLearningCard({ learningPath }: { learningPath: LearningPathRun }) {
  const result =
    learningPath?.status === 'COMPLETED' ? learningPath.result : null
  const busy =
    learningPath?.status === 'PENDING' || learningPath?.status === 'RUNNING'
  const path = result?.learning_paths[0] ?? null
  const steps = result
    ? [...result.learning_path_steps].sort(
        (left, right) => left.step_order - right.step_order,
      )
    : []
  const activeStep = steps[0] ?? null

  if (!result || !path || !activeStep) {
    return (
      <section className="relative rounded-lg overflow-hidden bg-gradient-to-br from-[#5003FF] to-[#4714BC] p-5 text-white sm:p-6">
        <Image
          src="/logo-dash.png"
          alt=""
          width={265}
          height={276}
          className="pointer-events-none absolute -right-6 -top-10 w-1/2 max-w-none select-none"
        />
        <div className="relative">
          <p className="text-xs font-medium text-white/70">
            Tingkatkan Kemampuanmu
          </p>
          <h2 className="font-heading mt-1 text-[20px] leading-[30px] font-bold tracking-[-0.01em] sm:text-[24px] sm:leading-[36px]">
            {busy
              ? 'Roadmap belajarmu sedang disusun'
              : 'Roadmap belajarmu belum dibuat'}
          </h2>
          <p className="mt-2.5 max-w-xl text-[13px] leading-6 text-white/80">
            {busy
              ? 'TalentForger sedang menyiapkan urutan skill, durasi, dan materi belajar. Halaman ini akan diperbarui otomatis.'
              : 'Buat roadmap dari skill gap role incaranmu untuk memantau progres belajar mingguanmu di sini.'}
          </p>
          <Link
            href="/job-seeker/learning-paths"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-[13px] font-semibold text-[#3F27B8] transition hover:bg-white/90"
          >
            <Waypoints className="size-4" />
            {busy ? 'Lihat progres' : 'Buat Roadmap'}
          </Link>
        </div>
      </section>
    )
  }

  const totalWeeks =
    path.estimated_duration_weeks ||
    Math.max(...steps.map((step) => step.week), 1)
  const currentWeek = activeStep.week || 1
  const progress = Math.min(100, Math.round((currentWeek / totalWeeks) * 100))

  const stepResourceIds = new Set(
    result.resource_recommendations
      .filter((rec) => rec.step_id === activeStep.step_id)
      .map((rec) => rec.resource_id),
  )
  const stepResources = [
    ...result.learning_resources,
    ...result.free_materials,
  ].filter((resource) => stepResourceIds.has(resource.resource_id))
  const moduleCount = stepResources.length
  const hours = Math.round(
    stepResources.reduce(
      (sum, resource) => sum + (resource.estimated_duration_hours || 0),
      0,
    ),
  )

  return (
    <section className="relative rounded-lg overflow-hidden bg-gradient-to-br from-[#5003FF] to-[#4714BC] p-5 text-white sm:p-6">
      <Image
        src="/logo-dash.png"
        alt=""
        width={265}
        height={276}
        className="pointer-events-none absolute -right-6 -top-10 w-1/2 max-w-none select-none"
      />

      <div className="relative">
        <p className="text-xs font-medium text-white/70">Tingkatkan Kemampuanmu</p>
        <div className="mt-1 flex items-start justify-between gap-4">
          <h2 className="font-heading text-[20px] leading-[30px] font-bold tracking-[-0.01em] sm:text-[24px] sm:leading-[36px]">
            Minggu {currentWeek}: {activeStep.topic}
          </h2>
          <div className="shrink-0 rounded-lg bg-white/15 px-3 py-2 text-center backdrop-blur">
            <p className="text-lg font-bold leading-none">{progress}%</p>
            <div className="mt-1.5 h-1 w-12 overflow-hidden rounded-full bg-white/25">
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
        <p className="mt-2.5 max-w-xl text-[13px] leading-6 text-white/80">
          Untuk role{' '}
          <span className="font-semibold text-white">{path.target_role}</span>,
          fokus minggu ini pada{' '}
          <span className="font-semibold text-white">
            {activeStep.related_skill_name}
          </span>
          . {activeStep.objective}
        </p>

        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-white/75">
          <span>
            Minggu {currentWeek} dari {totalWeeks} ·{' '}
            {activeStep.related_skill_name}
          </span>
          {(moduleCount > 0 || hours > 0) && (
            <span className="font-semibold text-white">
              {moduleCount > 0 && `${moduleCount} modul`}
              {moduleCount > 0 && hours > 0 && ' · '}
              {hours > 0 && `± ${hours} jam`}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <Link
            href="/job-seeker/learning-paths"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-[13px] font-semibold text-[#3F27B8] transition hover:bg-white/90"
          >
            <Play className="size-3.5 fill-current" />
            Lanjutkan Belajar
          </Link>
          <Link
            href="/job-seeker/learning-paths"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3.5 py-2 text-[13px] font-medium text-white ring-1 ring-inset ring-white/25 transition hover:bg-white/20"
          >
            <Repeat2 className="size-4" />
            Lihat Roadmap penuh
          </Link>
        </div>
      </div>
    </section>
  )
}

function SkillGapCard({ jobMatcher }: { jobMatcher: JobMatcherRun }) {
  const gaps = topMatchSkillGaps(jobMatcher)
  const sortedGaps = [...gaps].sort(
    (left, right) => priorityRank(left.priority) - priorityRank(right.priority),
  )
  const busy =
    jobMatcher?.status === 'PENDING' || jobMatcher?.status === 'RUNNING'
  const roleName = topMatchRoleName(jobMatcher)

  return (
    <section className="bg-white p-5 sm:p-6">
      <h2 className="font-heading text-[18px] leading-[27px] font-bold text-[#20202A]">Analisis Skill Gap</h2>

      {gaps.length > 0 ? (
        <>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
            <p className="text-xs leading-5 text-[#9A9AAB]">
              Level skill di profilmu vs kebutuhan role{' '}
              <span className="font-medium text-[#6C6C7A]">{roleName}</span>
            </p>
            <div className="flex shrink-0 items-center gap-3 text-[11px] font-medium text-[#8A8A98]">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#5B3FE4]" />
                Level kamu
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#E7E2FA] ring-1 ring-inset ring-[#C9BEF3]" />
                Dibutuhkan role
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-end gap-3 sm:gap-4">
            {sortedGaps.slice(0, 6).map((gap, index) => {
              const required = levelToPercent(gap.required_level)
              const current = levelToPercent(gap.current_level)
              const noGap = current >= required
              const darkFraction =
                required > 0 ? Math.min(current / required, 1) : 1
              return (
                <div
                  key={`${gap.gap_id}-${index}`}
                  className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
                >
                  <div className="flex h-[150px] w-full items-end justify-center">
                    <div
                      className="relative w-full max-w-[46px] overflow-hidden rounded-md bg-[#E7E2FA]"
                      style={{ height: `${Math.max(required, 14)}%` }}
                    >
                      <div
                        className="absolute inset-x-0 bottom-0 rounded-md bg-[#5B3FE4]"
                        style={{ height: `${darkFraction * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex max-w-full items-center gap-1 text-[11px] font-medium text-[#7C7C8C]">
                    {noGap && (
                      <CheckCircle2 className="size-3 shrink-0 text-emerald-500" />
                    )}
                    <span className="truncate" title={gap.skill_name}>
                      {shortSkill(gap.skill_name)}
                    </span>
                  </div>
                  <span
                    className="truncate text-[10px] leading-none text-[#B4B4C2]"
                    title={`Levelmu: ${levelLabel(gap.current_level)} · Dibutuhkan: ${levelLabel(gap.required_level)}`}
                  >
                    {levelLabel(gap.current_level)} → {levelLabel(gap.required_level)}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#F0F0F5] pt-4">
            <div className="min-w-0">
              <p className="flex items-center gap-1 text-sm font-semibold text-[#2F2F3A]">
                Fokus ke {sortedGaps[0].skill_name} lebih dulu
                <ArrowUpRight className="size-3.5 shrink-0 text-emerald-500" />
              </p>
              <p className="mt-1 text-xs text-[#9A9AAB]">
                {gaps.length} skill gap teridentifikasi untuk {roleName}.
              </p>
            </div>
            <Link
              href="/job-seeker/job-matches"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#E4E3F0] px-3 py-2 text-xs font-semibold text-[#4138D8] transition hover:border-[#CFC8FF] hover:bg-[#F6F5FF]"
            >
              Lihat Analisis
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </>
      ) : (
        <div className="mt-6 flex flex-col items-center justify-center rounded-lg bg-[#FAFAFC] px-6 py-10 text-center">
          <span className="flex size-11 items-center justify-center rounded-lg bg-[#EFEEFF] text-[#4138D8]">
            <ChartNoAxesColumn className="size-5" />
          </span>
          <p className="mt-3 text-sm font-semibold text-[#2F2F3A]">
            {busy
              ? 'Analisis skill gap sedang diproses'
              : 'Belum ada analisis skill gap'}
          </p>
          <p className="mt-1 max-w-sm text-xs leading-5 text-[#9A9AAB]">
            {busy
              ? 'JobMatcher sedang membandingkan skill-mu dengan kebutuhan role. Hasil muncul otomatis.'
              : 'Jalankan Job Matches untuk melihat gap skill terhadap role rekomendasimu.'}
          </p>
          <Link
            href="/job-seeker/job-matches"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#3E1DD1] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#3315B8]"
          >
            Buka Job Matches
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      )}
    </section>
  )
}

function PsychometricAccordion({
  assessment,
  career,
}: {
  assessment: AssessmentResultResponse | null
  career: DoubleDiamondResultResponse | null
}) {
  // A true accordion: opening one section closes the other instead of
  // letting both sit open (or both closed) independently.
  const [openSection, setOpenSection] = useState<'ocean' | 'riasec' | null>(
    'ocean',
  )
  const confidence =
    career != null ? normalizeConfidence(career.confidence_score) : null

  return (
    <div className="overflow-hidden rounded-lg bg-white ring-1 ring-[#ECECF2]">
      <AccordionRow
        open={openSection === 'ocean'}
        onToggle={() =>
          setOpenSection((current) => (current === 'ocean' ? null : 'ocean'))
        }
        title="OCEAN Personality"
        titleClassName="text-[#4A3FD0]"
        subtitle={
          confidence != null
            ? `Big Five · Confidence ${Math.round(confidence)}%`
            : 'Big Five'
        }
        subtitleClassName="text-[#7A72C8]"
        tinted
      >
        {assessment?.ocean ? (
          <>
            <BarChartSvg
              bars={OCEAN_BARS.map((bar) => ({
                key: bar.key,
                label: bar.label,
                value: assessment.ocean[bar.key],
              }))}
            />
            <p className="mt-4 text-sm leading-6 text-[#5C5C6A]">
              {assessment.career_profile_summary}
            </p>
          </>
        ) : (
          <EmptyText>
            Selesaikan asesmen OCEAN &amp; RIASEC untuk melihat profil ini.
          </EmptyText>
        )}
      </AccordionRow>

      <div className="border-t border-[#EFEFF4]" />

      <AccordionRow
        open={openSection === 'riasec'}
        onToggle={() =>
          setOpenSection((current) => (current === 'riasec' ? null : 'riasec'))
        }
        title="RIASEC Alignment"
        subtitle="Holland code dari 3 tipe tertinggi"
      >
        {assessment?.riasec ? (
          <RiasecContent riasec={assessment.riasec} />
        ) : (
          <EmptyText>
            Selesaikan asesmen RIASEC untuk melihat Holland code-mu.
          </EmptyText>
        )}
      </AccordionRow>
    </div>
  )
}

function AccordionRow({
  open,
  onToggle,
  title,
  subtitle,
  titleClassName,
  subtitleClassName,
  tinted,
  children,
}: {
  open: boolean
  onToggle: () => void
  title: string
  subtitle: string
  titleClassName?: string
  subtitleClassName?: string
  tinted?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={cn(open && tinted && 'bg-[#F7F6FD]')}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 p-5 text-left"
      >
        <div>
          <h2
            className={cn(
              'font-heading text-[18px] leading-[27px] font-bold text-[#20202A]',
              titleClassName,
            )}
          >
            {title}
          </h2>
          <p className={cn('mt-0.5 text-sm text-[#8A8A98]', subtitleClassName)}>
            {subtitle}
          </p>
        </div>
        {open ? (
          <ChevronDown className="size-5 shrink-0 text-[#8A82D8]" />
        ) : (
          <ChevronRight className="size-5 shrink-0 text-[#B9B9C6]" />
        )}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  )
}

function RiasecContent({ riasec }: { riasec: Riasec }) {
  return (
    <>
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-[#9A9AAB]">Holland code</span>
        <span className="rounded-lg bg-[#EFEEFF] px-2.5 py-1 text-sm font-bold tracking-[0.15em] text-[#4138D8]">
          {riasec.dominant_code}
        </span>
      </div>
      <div className="mt-4">
        <BarChartSvg
          bars={RIASEC_BARS.map((bar) => ({
            key: bar.key,
            label: bar.label,
            value: riasec[bar.key],
          }))}
        />
      </div>
    </>
  )
}

function BarChartSvg({
  bars,
  accent = '#3D28C9',
  muted = '#C9BEF3',
}: {
  bars: Array<{ key: string; label: string; value: number }>
  accent?: string
  muted?: string
}) {
  const width = 560
  const height = 210
  const padTop = 24
  const padBottom = 26
  const areaHeight = height - padTop - padBottom
  const slot = width / bars.length
  const barWidth = Math.min(54, slot * 0.52)
  const maxValue = Math.max(...bars.map((bar) => bar.value), 1)

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Grafik skor"
      className="w-full overflow-visible"
    >
      {[0.25, 0.5, 0.75, 1].map((fraction) => {
        const y = padTop + areaHeight * (1 - fraction)
        return (
          <line
            key={fraction}
            x1={0}
            x2={width}
            y1={y}
            y2={y}
            stroke="#E4DEF7"
            strokeDasharray="3 5"
          />
        )
      })}
      {bars.map((bar, index) => {
        const barHeight = Math.max((bar.value / maxValue) * areaHeight, 3)
        const x = index * slot + (slot - barWidth) / 2
        const y = padTop + areaHeight - barHeight
        const isMax = bar.value === maxValue
        return (
          <g key={bar.key}>
            <text
              x={x + barWidth / 2}
              y={y - 8}
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fill="#3A3A48"
            >
              {Math.round(bar.value)}
            </text>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx="8"
              fill={isMax ? accent : muted}
            />
            <text
              x={x + barWidth / 2}
              y={height - 6}
              textAnchor="middle"
              fontSize="12"
              fill="#7C7C8C"
            >
              {bar.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function SaktiInsightsPanel({
  assessment,
  career,
  targetRole,
}: {
  assessment: AssessmentResultResponse | null
  career: DoubleDiamondResultResponse | null
  targetRole: string | null
}) {
  const narrative =
    career?.career_summary?.trim() ||
    assessment?.career_profile_summary?.trim() ||
    null

  if (!assessment && !career) {
    return (
      <section className="rounded-lg bg-white p-6 ring-1 ring-[#ECECF2]">
        <div className="flex items-center gap-2">
          <Image src="/logo-mark.png" alt="" width={24} height={24} className="size-6" />
          <h2 className="font-heading text-[18px] leading-[27px] font-bold text-[#3B2FB5]">Sakti Insights</h2>
        </div>
        <p className="mt-4 rounded-lg bg-[#FAFAFC] p-5 text-center text-sm leading-6 text-[#8A8A98]">
          Insight tersedia setelah kamu menyelesaikan asesmen psikometri dan
          eksplorasi karier.
        </p>
      </section>
    )
  }

  const peakRole = targetRole || career?.recommended_roles?.[0]?.label || null
  const competency = assessment?.ocean
    ? competencyScores(assessment.ocean, assessment.riasec)
    : null
  const strengths = (career?.strengths ?? []).slice(0, 4)
  const barriers = (career?.barriers ?? []).slice(0, 4)
  const strengthLead =
    firstSentence(career?.work_style_summary) ||
    'Aspek yang paling menonjol dari profil kariermu.'
  const developmentLead =
    firstSentence(career?.readiness_summary) ||
    'Area yang paling berdampak untuk kamu kuatkan berikutnya.'

  return (
    <section className="space-y-5 rounded-lg bg-white p-5 ring-1 ring-[#ECECF2] sm:p-6">
      <div className="flex items-center gap-2">
        <Image src="/logo-mark.png" alt="" width={24} height={24} className="size-6" />
        <h2 className="font-heading text-[18px] leading-[27px] font-bold text-[#3B2FB5]">Sakti Insights</h2>
      </div>

      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-[#5003FF] to-[#4714BC] p-4 text-white">
        <Image
          src="/logo-dash.png"
          alt=""
          width={265}
          height={276}
          className="pointer-events-none absolute -right-4 -top-6 w-1/2 max-w-none select-none"
        />
        <p className="relative text-[11px] font-medium text-white/70">
          Potensi puncak Karir
        </p>
        <p className="relative mt-0.5 text-xl font-bold">
          {peakRole || 'Menunggu hasil eksplorasi karier'}
        </p>
      </div>

      {narrative ? (
        <div className="space-y-3 text-sm leading-6 text-[#5C5C6A]">
          <p>{narrative}</p>
          {career?.work_style_summary &&
            career.work_style_summary.trim() !== narrative && (
              <p>{career.work_style_summary}</p>
            )}
        </div>
      ) : (
        <EmptyText>
          Ringkasan naratif tersedia setelah eksplorasi karier selesai.
        </EmptyText>
      )}

      {competency && (
        <div>
          <p className="text-xs font-medium text-[#9A9AAB]">
            Ringkasan tentang dirimu
          </p>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            <ScoreTile
              tone="violet"
              icon={Target}
              value={competency.task}
              label="Task-related"
              description="Problem solving, analytical thinking, dan perencanaan teknis"
            />
            <ScoreTile
              tone="amber"
              icon={Users}
              value={competency.people}
              label="People-related"
              description="Komunikasi, kolaborasi, dan pengaruh sosial"
            />
            <ScoreTile
              tone="emerald"
              icon={ShieldCheck}
              value={competency.self}
              label="Self-related"
              description="Ketahanan stres, adaptabilitas, dan disiplin kerja"
            />
          </div>
        </div>
      )}

      {strengths.length > 0 || barriers.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-bold text-[#20202A]">
              <BarChart2 className="size-4 text-emerald-600" />
              Kekuatan
            </p>
            <p className="mt-1.5 text-xs leading-5 text-[#6C6C7A]">
              {strengthLead}
            </p>
            <ul className="mt-2 space-y-1.5">
              {strengths.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-xs leading-5 text-[#4B4B5C]"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:border-l sm:border-[#EFEFF4] sm:pl-5">
            <p className="flex items-center gap-1.5 text-sm font-bold text-[#20202A]">
              <Users className="size-4 text-amber-600" />
              Area Pengembangan
            </p>
            <p className="mt-1.5 text-justify text-xs leading-5 text-[#6C6C7A]">
              {developmentLead}
            </p>
            <ul className="mt-2 space-y-1.5">
              {barriers.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-xs leading-5 text-[#4B4B5C]"
                >
                  <CircleAlert className="mt-0.5 size-4 shrink-0 text-amber-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <EmptyText>
          Kekuatan dan area pengembangan muncul setelah proses Double Diamond
          selesai.
        </EmptyText>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/job-seeker/learning-paths"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3E1DD1] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#3315B8]"
        >
          <Briefcase className="size-4" />
          Jelajahi Roadmapmu →
        </Link>
        <Link
          href="/job-seeker/job-matches"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E4E3F0] px-4 py-2.5 text-[13px] font-semibold text-[#4138D8] transition hover:border-[#CFC8FF] hover:bg-[#F6F5FF]"
        >
          <Briefcase className="size-4" />
          Cari Pekerjaan
        </Link>
      </div>
    </section>
  )
}

function ScoreTile({
  value,
  label,
  description,
  tone,
  icon: Icon,
}: {
  value: number
  label: string
  description: string
  tone: 'violet' | 'amber' | 'emerald'
  icon: typeof Target
}) {
  const tones = {
    violet: 'bg-[#F4F2FE] text-[#4A3FD0]',
    amber: 'bg-[#FFF7ED] text-[#C2410C]',
    emerald: 'bg-[#F0FDF4] text-[#15803D]',
  }[tone]

  return (
    <div className={cn('rounded-lg p-4', tones)}>
      <p className="text-2xl font-bold leading-none">
        {value}
        <span className="ml-1 text-xs font-medium opacity-70">pts</span>
      </p>
      <p className="mt-2 flex items-center gap-1 text-[13px] font-semibold">
        <Icon className="size-3.5" />
        {label}
      </p>
      <p className="mt-1.5 text-[11px] leading-4 opacity-70">{description}</p>
    </div>
  )
}

function EmptyText({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg bg-[#FAFAFC] p-4 text-center text-sm leading-6 text-[#8A8A98]">
      {children}
    </p>
  )
}

function CareerForecastsSection({
  career,
  jobMatcher,
}: {
  career: DoubleDiamondResultResponse | null
  jobMatcher: JobMatcherRun
}) {
  const roles = career?.recommended_roles?.slice(0, 3) ?? []
  const companies = topCompanies(jobMatcher, 3)
  const remaining = Math.max((career?.recommended_roles?.length ?? 0) - 3, 0)

  return (
    <section className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-[20px] leading-[27px] font-bold text-[#20202A]">Career Forecasts</h2>
        <Binoculars className="size-5 text-[#9293A2]" />
      </div>

      {roles.length > 0 ? (
        <div className="mt-4 space-y-4">
          {roles.map((role) => {
            const pct = ratioToPercent(role.score)
            return (
              <div
                key={role.code}
                className="flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-[17px] text-[#26262F]">
                    {role.label}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[#8A8A98]">
                    {companies.length > 0 ? companies.join(' · ') : role.reason}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <BarMeter value={pct} />
                  <span className="w-[46px] text-right leading-tight">
                    <span className="block text-xs font-bold text-emerald-600">
                      {Math.round(pct)}%
                    </span>
                    <span className="block text-[10px] font-medium text-emerald-600/80">
                      cocok
                    </span>
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="mt-4 rounded-lg bg-[#FAFAFC] p-4 text-center text-xs leading-5 text-[#8A8A98]">
          Rekomendasi role muncul setelah rangkaian onboarding selesai.
        </p>
      )}

      <Link
        href="/job-seeker/job-matches"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#3E1DD1] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#3315B8]"
      >
        <BriefcaseBusiness className="size-4" />
        Lihat {remaining > 0 ? remaining : Math.max(roles.length, 3)} Posisi
        lainnya →
      </Link>
    </section>
  )
}

function BarMeter({ value }: { value: number }) {
  const filled = Math.max(1, Math.round((value / 100) * 5))
  return (
    <div className="flex items-end gap-[3px]" aria-hidden>
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className={cn(
            'h-4 w-[5px] rounded-sm',
            index < filled ? 'bg-emerald-500' : 'bg-emerald-100',
          )}
        />
      ))}
    </div>
  )
}

function ProfileCompletionSection({
  session,
}: {
  session: OnboardingSessionResponse | null
}) {
  const completed = session?.status === 'COMPLETED'
  const stageIndex = onboardingStage(session)
  const activeStep = completed ? null : (ONBOARDING_STEPS[stageIndex] ?? null)

  return (
    <section className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-[18px] leading-[27px] font-bold text-[#20202A]">Kelengkapan Profil</h2>
        <CircleUser className="size-5 text-[#9293A2]" />
      </div>

      <div className="mt-4 flex items-center">
        {ONBOARDING_STEPS.map((step, index) => {
          const isDone = completed || stageIndex > index
          const isActive = !completed && stageIndex === index
          return (
            <div
              key={step.title}
              className="flex items-center last:flex-none"
              style={{
                flex: index < ONBOARDING_STEPS.length - 1 ? '1 1 0%' : '0 0 auto',
              }}
            >
              {isActive ? (
                <span className="flex items-center gap-1.5 rounded-lg bg-[#EFEEFF] px-2.5 py-1.5 text-xs font-semibold text-[#4138D8]">
                  <span className="flex size-4 items-center justify-center rounded-full bg-[#4138D8] text-[10px] font-bold text-white">
                    {index + 1}
                  </span>
                  {step.title}
                </span>
              ) : (
                <span
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
                    isDone
                      ? 'bg-[#4138D8] text-white'
                      : 'bg-[#EEEEF3] text-[#9A9AAB]',
                  )}
                  title={step.title}
                >
                  {isDone ? <Check className="size-3.5" /> : index + 1}
                </span>
              )}
              {index < ONBOARDING_STEPS.length - 1 && (
                <span
                  className={cn(
                    'mx-1.5 h-px flex-1',
                    isDone ? 'bg-[#4138D8]/40' : 'bg-[#E4E4EC]',
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {!completed && activeStep && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
          <span>
            Kamu masih belum menyelesaikan{' '}
            <span className="font-semibold">{activeStep.title}</span>
          </span>
        </div>
      )}

      <p className="mt-3 text-sm leading-6 text-[#6C6C7A]">
        {completed
          ? 'Semua tahap onboarding sudah selesai. Profilmu siap untuk proses matching.'
          : activeStep?.description}
        {!completed && (
          <Link
            href="/job-seeker/onboarding"
            className="ml-1 font-semibold text-[#4138D8] hover:underline"
          >
            Selesaikan →
          </Link>
        )}
      </p>

      <p className="mt-4 text-xs font-medium text-[#9A9AAB]">
        atau jelajahi fitur lainnya
      </p>
      <div className="mt-2">
        <FeatureLinks />
      </div>
    </section>
  )
}

function topMatchSkillGaps(jobMatcher: JobMatcherRun) {
  if (jobMatcher?.status !== 'COMPLETED' || !jobMatcher.result) return []
  const ranked = [...jobMatcher.result.career_match_results].sort(
    (left, right) => right.total_match_score - left.total_match_score,
  )
  const topMatchId = ranked[0]?.match_id
  if (!topMatchId) return []
  return jobMatcher.result.skill_gap_results.filter(
    (gap) => gap.match_id === topMatchId,
  )
}

function topMatchRoleName(jobMatcher: JobMatcherRun): string {
  if (jobMatcher?.status !== 'COMPLETED' || !jobMatcher.result) return 'role terbaikmu'
  const ranked = [...jobMatcher.result.career_match_results].sort(
    (left, right) => right.total_match_score - left.total_match_score,
  )
  return ranked[0]?.role_name ?? 'role terbaikmu'
}

function topCompanies(jobMatcher: JobMatcherRun, limit: number): string[] {
  if (jobMatcher?.status !== 'COMPLETED' || !jobMatcher.result) return []
  const seen = new Set<string>()
  const out: string[] = []
  for (const job of jobMatcher.result.active_job_postings) {
    const company = job.company?.trim()
    if (!company || seen.has(company)) continue
    seen.add(company)
    out.push(company)
    if (out.length >= limit) break
  }
  return out
}

function onboardingStage(session: OnboardingSessionResponse | null): number {
  if (session?.status === 'COMPLETED' || session?.current_step === 'COMPLETE') {
    return ONBOARDING_STEPS.length
  }
  if (!session) return 0
  if (session.current_step === 'CV_UPLOAD' || session.current_step === 'IDENTITY') {
    return 0
  }
  if (session.current_step === 'OCEAN' || session.current_step === 'RIASEC') {
    return 1
  }
  if (
    session.current_step === 'DIVERGE_1' ||
    session.current_step === 'CONVERGE_1' ||
    session.current_step === 'DIVERGE_2' ||
    session.current_step === 'CONVERGE_2'
  ) {
    return 2
  }
  return 3
}

// Frontend-only rollup of the backend OCEAN/RIASEC dimensions (all 0-100) into
// the three broad competency families shown in Sakti Insights.
function competencyScores(ocean: Ocean, riasec: Riasec) {
  const clamp = (value: number) => Math.min(100, Math.max(0, Math.round(value)))
  return {
    task: clamp(
      (ocean.conscientiousness + riasec.investigative + riasec.conventional) / 3,
    ),
    people: clamp(
      (ocean.extraversion +
        ocean.agreeableness +
        riasec.social +
        riasec.enterprising) /
        4,
    ),
    self: clamp((100 - ocean.neuroticism + ocean.openness) / 2),
  }
}

function firstSentence(text: string | null | undefined): string | null {
  if (!text) return null
  const trimmed = text.trim()
  if (!trimmed) return null
  const match = trimmed.match(/^.*?[.!?](\s|$)/)
  return (match ? match[0] : trimmed).trim()
}

function normalizeConfidence(value: number): number {
  return Math.round((value <= 1 ? value * 100 : value) * 100) / 100
}

// JobMatcher's skill-gap output only ever uses these four discrete
// proficiency tiers (see SkillGapResult.current_level/required_level in the
// AI service) — there's no underlying numeric score, so the "unit" here is a
// competency tier, not a percentage. We map the tier straight to an even
// 0/33/67/100 split so equal tiers render as visually equal bars and
// different tiers are always visually distinct.
const SKILL_LEVEL_RANK: Record<string, number> = {
  none: 0,
  beginner: 1,
  intermediate: 2,
  advanced: 3,
}

function levelToPercent(level: string): number {
  const rank = SKILL_LEVEL_RANK[level.trim().toLowerCase()]
  return rank !== undefined ? (rank / 3) * 100 : 50
}

function levelLabel(level: string): string {
  const key = level.trim().toLowerCase()
  if (key === 'advanced') return 'Mahir'
  if (key === 'intermediate') return 'Menengah'
  if (key === 'beginner') return 'Pemula'
  if (key === 'none') return 'Belum ada'
  return level
}

function priorityRank(priority: string): number {
  return (
    ({ high: 0, medium: 1, low: 2 } as Record<string, number>)[
      priority.trim().toLowerCase()
    ] ?? 3
  )
}

function shortSkill(name: string): string {
  const words = name.trim().split(/\s+/)
  const head = words[0].length > 9 ? `${words[0].slice(0, 8)}…` : words[0]
  return words.length > 1 ? `${head} ${words[1][0].toUpperCase()}.` : head
}

function ratioToPercent(value: number): number {
  return clampScore(value <= 1 ? value * 100 : value)
}

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0))
}
