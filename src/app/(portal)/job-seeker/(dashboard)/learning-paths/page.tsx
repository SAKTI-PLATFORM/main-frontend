'use client'

import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  SearchX,
  Trophy,
  Waypoints,
  Play,
  Binoculars,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { toSkillScore, skillScoreLabel } from '@/lib/skill-score'
import { seekerApi } from '@/api/seeker.api'
import { useDashboard } from '@/features/dashboard/use-dashboard'
import { DashboardLoading, DashboardError } from '@/components/dashboard/dashboard-status'
import type {
  CareerMatchResult,
  CareerSkillGap,
  LeaderboardEntry,
  LeaderboardResponse,
} from '@/types/career-pipeline.types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

interface HeroSkillGapItem {
  gap_id: string
  skill_name: string
  current_level: number
  required_level: number
}

// Shown in the hero card until JobMatcher produces real skill gaps.
const DUMMY_HERO_GAPS: HeroSkillGapItem[] = [
  { gap_id: 'd1', skill_name: 'Python', current_level: 62, required_level: 85 },
  { gap_id: 'd2', skill_name: 'Machine Learning', current_level: 34, required_level: 88 },
  { gap_id: 'd3', skill_name: 'Deep Learning', current_level: 38, required_level: 60 },
  { gap_id: 'd4', skill_name: 'MLOps', current_level: 8, required_level: 65 },
  { gap_id: 'd5', skill_name: 'Cloud', current_level: 30, required_level: 80 },
  { gap_id: 'd6', skill_name: 'Data Viz', current_level: 58, required_level: 55 },
]

// Skill-gap bars for the hero card — same model as the job-matches detail view
// (track height = level dibutuhkan, isian = level kamu), recoloured for the
// blue gradient background.
function HeroSkillGap({ gaps }: { gaps: HeroSkillGapItem[] }) {
  const rows = gaps.slice(0, 6)
  return (
    <div className="flex items-end gap-2">
      {rows.map((gap, index) => {
        const required = toSkillScore(gap.required_level)
        const current = toSkillScore(gap.current_level)
        const noGap = current >= required
        const fillFraction = required > 0 ? Math.min(current / required, 1) : 1
        const isFirst = index === 0
        const isLast = index === rows.length - 1
        return (
          <div
            key={gap.gap_id}
            className="group relative flex min-w-0 flex-1 flex-col items-center gap-1.5"
          >
            <div
              className={cn(
                'pointer-events-none absolute bottom-[calc(100%+8px)] z-20 w-max max-w-[170px] rounded-lg bg-[#20202A] px-2.5 py-2 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100',
                isFirst && 'left-0',
                isLast && 'right-0',
                !isFirst && !isLast && 'left-1/2 -translate-x-1/2',
              )}
            >
              <p className="text-[11px] font-semibold leading-4 text-white">{gap.skill_name}</p>
              <p className="mt-1 text-[10.5px] leading-4 text-white/70">
                Level kamu <span className="font-semibold text-white">{skillScoreLabel(current)} · {current}</span>
              </p>
              <p className="text-[10.5px] leading-4 text-white/70">
                Dibutuhkan <span className="font-semibold text-white">{skillScoreLabel(required)} · {required}</span>
              </p>
              <span
                className={cn(
                  'absolute top-full -mt-px size-1.5 rotate-45 bg-[#20202A]',
                  isFirst && 'left-6',
                  isLast && 'right-6',
                  !isFirst && !isLast && 'left-1/2 -translate-x-1/2',
                )}
              />
            </div>
            <div className="flex h-[100px] w-full items-end justify-center">
              <div
                className="relative w-full max-w-[80px] overflow-hidden rounded-[4px] bg-white/20 transition-colors group-hover:bg-white/30"
                style={{ height: `${Math.max(required, 14)}%` }}
              >
                <div
                  className="absolute inset-x-0 bottom-0 rounded-[4px] bg-white"
                  style={{ height: `${fillFraction * 100}%` }}
                />
              </div>
            </div>
            <div className="flex max-w-full items-center gap-1 text-[11px] font-medium text-white/75">
              {noGap && <CheckCircle2 className="size-3 shrink-0 text-emerald-300" />}
              <span className="truncate" title={gap.skill_name}>
                {gap.skill_name.length > 8 ? gap.skill_name.slice(0, 8) + '…' : gap.skill_name}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface RoadmapRowItem {
  matchId: string
  title: string
  matchReason: string
  score: number
  skills: string[]
}

function buildRoadmapRows(matches: CareerMatchResult[], gaps: CareerSkillGap[]): RoadmapRowItem[] {
  return matches
    .slice()
    .sort((a, b) => b.total_match_score - a.total_match_score)
    .map((match) => {
      const matchGaps = gaps
        .filter((g) => g.match_id === match.match_id)
        .slice(0, 3)
        .map((g) => g.skill_name)
      return {
        matchId: match.match_id,
        title: match.role_name,
        matchReason: match.match_reason,
        score: Math.round(match.total_match_score),
        skills: matchGaps,
      }
    })
}

// ─── Score Meter ──────────────────────────────────────────────────────────────

function BlueBarMeter({ value }: { value: number }) {
  const filled = Math.max(1, Math.round((value / 100) * 5))
  return (
    <div className="flex items-end gap-[3px]" aria-hidden>
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className={cn('h-4 w-[5px] rounded-sm', index < filled ? 'bg-[#0D62F9]' : 'bg-blue-100')}
        />
      ))}
    </div>
  )
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

const PODIUM_STYLE: Record<number, { bar: string; height: string; label: string }> = {
  1: { bar: 'bg-[#0D62F9]', height: 'h-24', label: 'text-3xl' },
  2: { bar: 'bg-[#538EFA]', height: 'h-16', label: 'text-2xl' },
  3: { bar: 'bg-[#8FB5FB]', height: 'h-12', label: 'text-2xl' },
}

function PodiumSpot({ rank, entry }: { rank: number; entry?: LeaderboardEntry }) {
  const style = PODIUM_STYLE[rank]
  return (
    <div className="flex w-full flex-col items-center text-center">
      <div className={cn('font-light text-gray-300', style.label)}>
        {String(rank).padStart(2, '0')}
      </div>
      <div className="mt-1.5 max-w-full truncate text-xs font-medium text-gray-700">
        {entry ? entry.name : '—'}
      </div>
      <div className="text-[10px] text-gray-400">
        {entry ? `${entry.days_streak} Hari` : 'Kosong'}
      </div>
      <div className="mt-1 text-xs font-bold text-[#0D62F9]">
        {entry ? `${entry.xp.toLocaleString()} XP` : '0 XP'}
      </div>
      <div
        className={cn(
          'mt-2 w-12 rounded-t-lg',
          style.height,
          entry ? style.bar : 'bg-gray-100',
        )}
      />
    </div>
  )
}

function LeaderRow({ entry }: { entry: LeaderboardEntry }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0',
        entry.is_current_user && 'rounded-lg border-transparent bg-blue-50/60 px-2 py-2',
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="w-5 shrink-0 text-base font-light text-gray-300">
          {String(entry.rank).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <div
            className={cn(
              'truncate text-sm font-medium',
              entry.is_current_user ? 'text-[#0D62F9]' : 'text-gray-700',
            )}
          >
            {entry.name}
          </div>
          <div className="text-[10px] text-gray-400">{entry.days_streak} Hari</div>
        </div>
      </div>
      <div className="shrink-0 text-sm font-bold text-gray-600">
        {entry.xp.toLocaleString()} XP
      </div>
    </div>
  )
}

function Leaderboard() {
  const [data, setData] = useState<LeaderboardResponse | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let alive = true
    seekerApi
      .getLeaderboard(10)
      .then((res) => {
        if (!alive) return
        setData(res.data.data)
        setStatus('ready')
      })
      .catch(() => {
        if (alive) setStatus('error')
      })
    return () => {
      alive = false
    }
  }, [])

  const entries = data?.entries ?? []
  const me = data?.me ?? null
  const podium = [2, 1, 3].map((rank) => ({
    rank,
    entry: entries.find((e) => e.rank === rank),
  }))
  const restList = entries.filter((e) => e.rank > 3)

  return (
    <section className="bg-white rounded-lg ring-1 ring-[#ECECF2] flex-1 flex flex-col overflow-hidden min-h-0">
      <div className="border-b border-[#ECECF2] px-5 py-3.5 shrink-0">
        <h2 className="font-heading text-[18px] leading-[27px] font-bold text-[#4A4A4A]">Papan Peringkat</h2>
      </div>

      {status === 'loading' ? (
        <div className="flex flex-1 items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-[#9293A2]" />
        </div>
      ) : status === 'error' ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
          <Trophy className="size-8 text-[#CBD5E1]" />
          <p className="text-sm text-[#9CA3AF]">Papan peringkat belum bisa dimuat.</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
          <Trophy className="size-8 text-[#CBD5E1]" />
          <p className="text-sm text-[#9CA3AF]">
            Belum ada peserta. Selesaikan topik di roadmap untuk mengumpulkan XP.
          </p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          <div className="flex items-end justify-center gap-4 p-5 border-b border-[#ECECF2] shrink-0">
            {podium.map(({ rank, entry }) => (
              <PodiumSpot key={rank} rank={rank} entry={entry} />
            ))}
          </div>

          {/* Current User */}
          {me && (
            <div className="bg-blue-50/50 px-5 py-3 border-b border-[#ECECF2] shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-500">Posisi Anda Saat Ini</span>
                <span className="text-[10px] font-bold text-[#0D62F9]">Teruskan!</span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg bg-[#0D62F9] px-4 py-2.5 text-white shadow-sm">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="text-xl font-light opacity-80">{me.rank}</span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold">{me.name}</div>
                    <div className="text-[10px] opacity-80">{me.days_streak} Hari Berturut-turut</div>
                  </div>
                </div>
                <div className="shrink-0 text-sm font-bold">{me.xp.toLocaleString()} XP</div>
              </div>
            </div>
          )}

          {/* List */}
          <div className="px-5 py-4 flex-1 flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden">
            <div className="space-y-3 flex-1">
              {restList.length > 0 ? (
                restList.map((entry) => <LeaderRow key={entry.user_id} entry={entry} />)
              ) : (
                <p className="rounded-lg bg-[#FAFAFC] p-4 text-center text-xs leading-5 text-[#8A8A98]">
                  Baru {entries.length} peserta di papan peringkat.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LearningPathsOverviewPage() {
  const dashboardState = useDashboard()

  if (dashboardState.status === 'loading') return <DashboardLoading />
  if (dashboardState.status === 'error') return <DashboardError />

  const { session, jobMatcher } = dashboardState
  const sessionId = session?.onboarding_session_id ?? null

  const allMatches: CareerMatchResult[] =
    jobMatcher?.status === 'COMPLETED'
      ? (jobMatcher.result?.career_match_results ?? []).slice().sort(
          (a, b) => b.total_match_score - a.total_match_score,
        )
      : []

  const allGaps: CareerSkillGap[] =
    jobMatcher?.status === 'COMPLETED' ? (jobMatcher.result?.skill_gap_results ?? []) : []

  const topMatch = allMatches[0] ?? null
  const topMatchGaps = topMatch ? allGaps.filter((g) => g.match_id === topMatch.match_id) : []

  const heroGaps: HeroSkillGapItem[] =
    topMatchGaps.length > 0 ? topMatchGaps.slice(0, 6) : DUMMY_HERO_GAPS

  const roadmapRows: RoadmapRowItem[] = buildRoadmapRows(allMatches, allGaps)
  const activeRole = topMatch?.role_name ?? 'Learning Path Anda'
  const isProcessing = jobMatcher?.status === 'PENDING' || jobMatcher?.status === 'RUNNING'

  return (
    <div className="flex h-[calc(100vh-76px)] flex-col bg-[#F7F7FB]">
      <div className="custom-scrollbar mx-auto flex h-full w-full max-w-[1500px] flex-col overflow-y-auto px-4 py-3 sm:px-6 sm:py-4">
        <div className="grid min-h-0 flex-1 gap-3 xl:grid-cols-[65fr_35fr]">

          {/* ── Left Column ───────────────────────────────────────────── */}
          <div className="flex min-h-0 min-w-0 flex-col gap-5">

            {/* Hero card — blue gradient + Sakti logo */}
            <section className="relative rounded-lg overflow-hidden bg-gradient-to-br from-[#045DEF] to-[#0047C8] p-5 sm:p-6 text-white shrink-0">
              {/* Logo — full card height, contained (never cropped) and pinned to the right edge */}
              <Image
                src="/logo-dash.png"
                alt=""
                width={360}
                height={440}
                className="pointer-events-none absolute right-0 top-0 h-full w-auto max-w-[340px] object-contain object-right select-none opacity-80"
              />
              <div className="relative z-10 max-w-[calc(100%-190px)] sm:max-w-none">
                <p className="text-xs font-medium text-white/70">Analisis Skill Gap dan Roadmap Belajar</p>
                <div className="mt-1 flex items-start justify-between gap-4">
                  <h1 className="font-heading text-[20px] leading-[30px] font-bold tracking-[-0.01em] sm:text-[24px] sm:leading-[36px]">
                    {activeRole}
                  </h1>
                  {topMatch && (
                    <div className="shrink-0 rounded-lg bg-white/15 px-3 py-2 text-center backdrop-blur">
                      <p className="text-lg font-bold leading-none">{Math.round(topMatch.total_match_score)}%</p>
                      <div className="mt-1.5 h-1 w-10 overflow-hidden rounded-full bg-white/25">
                        <div className="h-full rounded-full bg-[#10B981]" style={{ width: `${topMatch.total_match_score}%` }} />
                      </div>
                    </div>
                  )}
                  {isProcessing && (
                    <div className="shrink-0 rounded-lg bg-white/15 px-3 py-2 backdrop-blur flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      <span className="text-xs">Proses...</span>
                    </div>
                  )}
                </div>
                {topMatch && (
                  <p className="mt-1.5 text-[13px] leading-relaxed text-white/80 max-w-2xl line-clamp-2">
                    {topMatch.match_reason}
                  </p>
                )}

                {/* Skill gap — one bar per skill: track = level dibutuhkan, isian = level kamu */}
                <div className="mt-5 w-full max-w-3xl">
                  <HeroSkillGap gaps={heroGaps} />
                </div>

                {/* CTAs */}
                {topMatch && (
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <Link
                      href={`/job-seeker/learning-paths/${topMatch.match_id}/roadmap`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-[13px] font-semibold text-[#045DEF] transition hover:bg-white/90"
                    >
                      <Play className="size-3.5 fill-current" /> Lanjutkan Belajar
                    </Link>
                    <Link
                      href="/job-seeker/learning-paths/explore"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3.5 py-2 text-[13px] font-medium text-white ring-1 ring-inset ring-white/25 transition hover:bg-white/20"
                    >
                      <Waypoints className="size-4" /> Eksplorasi Roadmap
                    </Link>
                  </div>
                )}
              </div>
            </section>

            {/* Pilihan Roadmap */}
            <section className="bg-white rounded-lg ring-1 ring-[#ECECF2] flex flex-1 min-h-0 flex-col overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#ECECF2] shrink-0">
                <h2 className="font-heading text-[20px] leading-[27px] font-bold text-[#4A4A4A]">
                  Pilihan Roadmap Karir
                </h2>
                <div className="flex items-center gap-2">
                  {jobMatcher?.status === 'COMPLETED' && allMatches.length > 0 && (
                    <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-[12px] font-semibold text-[#045DEF]">
                      {allMatches.length} match
                    </span>
                  )}
                  {isProcessing && (
                    <div className="flex items-center gap-1.5 text-[13px] text-[#045DEF]">
                      <Loader2 className="size-3.5 animate-spin" />
                      <span className="text-xs">Memproses...</span>
                    </div>
                  )}
                  <Binoculars className="size-5 text-[#9293A2]" />
                </div>
              </div>

              {roadmapRows.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center py-16 px-6 text-center gap-3">
                  {isProcessing ? (
                    <>
                      <Loader2 className="size-10 animate-spin text-[#045DEF]/40" />
                      <p className="text-sm text-[#9CA3AF]">JobMatcher sedang menganalisis profil Anda...</p>
                    </>
                  ) : (
                    <>
                      <SearchX className="size-10 text-[#9CA3AF]" />
                      <p className="text-sm text-[#9CA3AF]">
                        Belum ada hasil career match. Selesaikan onboarding terlebih dahulu.
                      </p>
                      {sessionId && (
                        <Link
                          href="/job-seeker/onboarding"
                          className="mt-2 inline-flex h-9 items-center gap-2 rounded-lg bg-[#045DEF] px-4 text-sm font-medium text-white hover:bg-[#0047C8] transition"
                        >
                          Lanjutkan Onboarding <ArrowRight className="size-4" />
                        </Link>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <>
                  <div className="custom-scrollbar flex-1 min-h-0 overflow-y-auto">
                  {/* Top match */}
                  {roadmapRows[0] && (
                    <div className="relative group px-5 py-4 border-b border-[#ECECF2] flex items-center justify-between gap-4 hover:bg-blue-50/30 transition cursor-pointer">
                      <Link href={`/job-seeker/learning-paths/${roadmapRows[0].matchId}/roadmap`} className="absolute inset-0 z-10">
                        <span className="sr-only">Lihat {roadmapRows[0].title}</span>
                      </Link>
                      <div className="min-w-0 flex-1 relative z-20 pointer-events-none">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="rounded-lg bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-[#045DEF]">
                            Top Match
                          </span>
                        </div>
                        <p className="font-heading text-[17px] font-bold text-[#26262F] group-hover:text-[#045DEF] transition-colors truncate">
                          {roadmapRows[0].title}
                        </p>
                        <p className="mt-0.5 text-xs text-[#8A8A98] line-clamp-1">{roadmapRows[0].matchReason}</p>
                        {roadmapRows[0].skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {roadmapRows[0].skills.map((s) => (
                              <span key={s} className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600 font-medium">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-3 relative z-20 pointer-events-none">
                        <BlueBarMeter value={roadmapRows[0].score} />
                        <span className="w-[46px] text-right leading-tight">
                          <span className="block text-xs font-bold text-emerald-600">{roadmapRows[0].score}%</span>
                          <span className="block text-[10px] font-medium text-emerald-600/80">cocok</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Other matches */}
                  <div className="flex flex-col divide-y divide-[#F0F0F5]">
                    {roadmapRows.slice(1).map((row) => (
                      <div
                        key={row.matchId}
                        className="relative group flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-[#FAFAFC] transition cursor-pointer"
                      >
                        <Link href={`/job-seeker/learning-paths/${row.matchId}/roadmap`} className="absolute inset-0 z-10">
                          <span className="sr-only">Lihat {row.title}</span>
                        </Link>
                        <div className="min-w-0 relative z-20 pointer-events-none">
                          <p className="truncate text-[15px] text-[#26262F] group-hover:text-[#045DEF] transition-colors font-medium">
                            {row.title}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-[#8A8A98] line-clamp-1">{row.matchReason}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2 relative z-20 pointer-events-none">
                          <BlueBarMeter value={row.score} />
                          <span className="w-[46px] text-right leading-tight">
                            <span className="block text-xs font-bold text-emerald-600">{row.score}%</span>
                            <span className="block text-[10px] font-medium text-emerald-600/80">cocok</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  </div>
                </>
              )}
            </section>
          </div>

          {/* ── Right: Leaderboard ─────────────────────────────────────── */}
          <div className="flex min-h-0 min-w-0 flex-col">
            <Leaderboard />
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #E6E2EE; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #CFC7F5; }
      `}} />
    </div>
  )
}
