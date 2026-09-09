'use client'

import {
  AlertCircle,
  ArrowRight,
  Binoculars,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Paperclip,
  Play,
  PlayCircle,
  RotateCw,
  Send,
  Waypoints,
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  DashboardError,
  DashboardLoading,
} from '@/components/dashboard/dashboard-status'
import { AITurnTrail } from '@/components/career-pipeline/ai-turn-trail'
import { MathCurveLoader } from '@/components/ui/math-curve-loader'
import { Card } from '@/components/ui/card'
import { useCareerPipeline } from '@/features/career-pipeline/use-career-pipeline'
import { useDashboard } from '@/features/dashboard/use-dashboard'
import { useDashboardView } from '@/components/dashboard/dashboard-view'
import { cn } from '@/lib/utils'
import { toSkillScore, skillScoreLabel } from '@/lib/skill-score'
import type {
  CareerCandidateRole,
  CareerMatchResult,
  CareerMatchScore,
  CareerSkillGap,
  JobMatcherResult,
  TalentForgerResult,
} from '@/types/career-pipeline.types'

export default function JobMatchesPage() {
  const dashboard = useDashboard()
  const sessionId =
    dashboard.status === 'ready' && dashboard.session?.status === 'COMPLETED'
      ? dashboard.session.onboarding_session_id
      : null
  const pipeline = useCareerPipeline<JobMatcherResult>(sessionId, 'job-matcher')
  const { jobMatchesDetailId, setJobMatchesDetailId, setJobMatchesDetailName } = useDashboardView()
  const selectedId = jobMatchesDetailId ?? ''
  const setSelectedId = (id: string) => setJobMatchesDetailId(id || undefined)

  const learning = useCareerPipeline<TalentForgerResult>(sessionId, 'talent-forger', {
    matchId: selectedId || undefined,
  })

  const result = pipeline.run?.status === 'COMPLETED' ? pipeline.run.result : null
  const rankedMatches = [...(result?.career_match_results ?? [])].sort(
    (left, right) => right.total_match_score - left.total_match_score,
  )
  const selectedMatch = rankedMatches.find((match) => match.match_id === selectedId)

  useEffect(() => {
    if (selectedMatch) {
      setJobMatchesDetailName(selectedMatch.role_name)
    } else {
      setJobMatchesDetailName(undefined)
    }
  }, [selectedMatch, setJobMatchesDetailName])

  if (dashboard.status === 'loading' || pipeline.loading) return <DashboardLoading />
  if (dashboard.status === 'error') return <DashboardError />
  if (!sessionId) return <OnboardingRequired />

  const busy =
    pipeline.generating ||
    pipeline.run?.status === 'PENDING' ||
    pipeline.run?.status === 'RUNNING'
  
  const bestMatch = rankedMatches[0]
  const otherMatches = rankedMatches.slice(1)

  const selectedScore = result?.career_match_score_details.find(
    (score) => score.match_id === selectedMatch?.match_id,
  )
  const selectedGaps = result?.skill_gap_results.filter(
    (gap) => gap.match_id === selectedMatch?.match_id,
  ) ?? []
  
  const selectedCandidateRole = result?.candidate_roles.find(
    (r) => r.role_id === selectedMatch?.role_id
  )
  
  const learningResult = learning.run?.status === 'COMPLETED' ? learning.run.result : null

  return (
    <div className="flex h-[calc(100vh-76px)] flex-col bg-[#F7F7FB]">
      <div className="flex flex-col h-full max-w-[1500px] w-full mx-auto px-4 py-3 sm:px-6 sm:py-4">
        
        {pipeline.run?.status === 'FAILED' && !pipeline.generating && (
          <div className="mb-5 space-y-3 shrink-0">
            <PipelineNotice tone="error" title="Analisis belum berhasil" description={pipeline.run.errorMessage || 'JobMatcher gagal diproses setelah tiga percobaan otomatis.'} />
            <button type="button" onClick={() => void pipeline.generate()} className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white transition hover:bg-primary/85">
              <RotateCw className="size-4" /> Coba lagi
            </button>
          </div>
        )}
        
        {busy && (
          <div className="mb-5 shrink-0">
            <PipelineNotice tone="loading" title="SAKTI AI sedang mencocokkan profilmu" description={`Kami membandingkan skill, pengalaman, psikometri, dan preferensimu. Percobaan ${pipeline.run?.attempt || 1} dari 3.`} />
            <div className="mt-3"><AITurnTrail turns={pipeline.run?.turns} inFlight /></div>
          </div>
        )}
        
        {!pipeline.run && (
          <div className="mb-5 shrink-0">
             <PipelineNotice tone="loading" title="Job Matches sedang disiapkan" description="Analisis otomatis dimulai setelah onboarding selesai. Hasil akan muncul di halaman ini tanpa perlu dijalankan manual." />
          </div>
        )}

        {result && rankedMatches.length > 0 && !busy && (
          <div className="flex-1 min-h-0 grid gap-5 xl:grid-cols-[1fr_1fr]">
            {selectedMatch ? (
              <div className="xl:col-span-2 flex min-h-0 h-full rounded-lg border-[0.1px] border-[#FFD9C4] overflow-hidden bg-white">
                <div className="flex-1 min-w-0 overflow-y-auto custom-scrollbar">
                  <DetailLeftColumn role={selectedMatch} score={selectedScore} gaps={selectedGaps} candidateRole={selectedCandidateRole} />
                </div>
                <div className="w-px bg-[#FFD9C4] shrink-0" />
                <div className="flex-1 min-w-0 overflow-y-auto custom-scrollbar">
                  <DetailRightColumn jobs={result.active_job_postings} learningResult={learningResult} />
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-y-auto pr-2 pb-6 custom-scrollbar flex flex-col gap-5">
                  <OverviewLeftColumn bestRole={bestMatch} otherRoles={otherMatches} onSelect={setSelectedId} />
                </div>
                <div className="overflow-y-auto pl-2 pb-6 custom-scrollbar flex flex-col">
                  <OverviewRightColumn jobs={result.active_job_postings} />
                </div>
              </>
            )}
          </div>
        )}
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

function OverviewLeftColumn({ bestRole, otherRoles, onSelect }: { bestRole: CareerMatchResult; otherRoles: CareerMatchResult[]; onSelect: (id: string) => void }) {
  return (
    <>
      <section className="relative rounded-lg overflow-hidden bg-gradient-to-br from-[#FF8C00] to-[#FF6B00] p-4 text-white sm:p-5 shrink-0">
        <Image src="/logo-dash.png" alt="" width={300} height={400} className="pointer-events-none absolute -right-6 top-0 w-4/7 max-w-none select-none" />
        <div className="relative">
          <p className="text-xs font-medium text-white/70">Rekomendasi Terbaik Untukmu</p>
          <div className="mt-1 flex items-start justify-between gap-4">
            <h2 className="font-heading text-[20px] leading-[30px] font-bold tracking-[-0.01em] sm:text-[24px] sm:leading-[36px]">
              {bestRole.role_name}
            </h2>
            <div className="shrink-0 rounded-lg bg-white/15 px-3 py-2 text-center backdrop-blur">
              <p className="text-lg font-bold leading-none">{Math.round(bestRole.total_match_score)}%</p>
              <div className="mt-1.5 h-1 w-12 overflow-hidden rounded-full bg-white/25">
                <div className="h-full rounded-full bg-[#10B981]" style={{ width: `${bestRole.total_match_score}%` }} />
              </div>
            </div>
          </div>
          <p className="mt-2 text-[13px] text-justify leading-relaxed text-white/80 max-w-xl line-clamp-3">{bestRole.match_reason}</p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            <button onClick={() => onSelect(bestRole.match_id)} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-[13px] font-semibold text-[#FF6B00] transition hover:bg-white/90">
              <Play className="size-3.5 fill-current" /> Lihat Detail
            </button>
            <Link href={`/job-seeker/learning-paths?match=${bestRole.match_id}`} className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3.5 py-2 text-[13px] font-medium text-white ring-1 ring-inset ring-white/25 transition hover:bg-white/20">
              <Waypoints className="size-4" /> Lihat Roadmap penuh
            </Link>
          </div>
        </div>
      </section>
      <section className="flex flex-1 flex-col bg-white rounded-lg ring-1 ring-[#ECECF2] p-4 min-h-0">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-[20px] leading-[27px] font-bold text-[#4A4A4A]">Kandidat Career Forecasts</h2>
          <Binoculars className="size-5 text-[#9293A2]" />
        </div>

        {otherRoles.length > 0 ? (
          <div className="mt-3 space-y-3">
            {otherRoles.slice(0, 5).map(role => {
              const pct = role.total_match_score
              return (
                <div key={role.match_id} className="flex items-center justify-between gap-3 cursor-pointer" onClick={() => onSelect(role.match_id)}>
                  <div className="min-w-0">
                    <p className="truncate text-[17px] text-[#26262F]">{role.role_name}</p>
                    <p className="mt-0.5 truncate text-xs text-[#8A8A98] line-clamp-1">{role.match_reason}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <OrangeBarMeter value={pct} />
                    <span className="w-[46px] text-right leading-tight">
                      <span className="block text-xs font-bold text-emerald-600">{Math.round(pct)}%</span>
                      <span className="block text-[10px] font-medium text-emerald-600/80">cocok</span>
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="mt-3 rounded-lg bg-[#FAFAFC] p-4 text-center text-xs leading-5 text-[#8A8A98]">Tidak ada role lain untuk ditampilkan.</p>
        )}

        <button onClick={() => onSelect(otherRoles[0]?.match_id ?? '')} className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF6B00] px-4 py-3 text-[13px] font-semibold text-white transition hover:bg-[#E66000]">
          <BriefcaseBusiness className="size-4" />
          Lihat Selengkapnya
        </button>
      </section>
    </>
  )
}

function OrangeBarMeter({ value }: { value: number }) {
  const filled = Math.max(1, Math.round((value / 100) * 5))
  return (
    <div className="flex items-end gap-[3px]" aria-hidden>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={cn('h-4 w-[5px] rounded-sm', index < filled ? 'bg-emerald-500' : 'bg-emerald-100')} />
      ))}
    </div>
  )
}

function OverviewRightColumn({ jobs }: { jobs: JobMatcherResult['active_job_postings'] }) {
  const [query, setQuery] = useState('')
  const filtered = jobs.filter(j =>
    !query || j.title.toLowerCase().includes(query.toLowerCase()) || j.company.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <section className="bg-white rounded-lg ring-1 ring-[#ECECF2] p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 className="font-heading text-[20px] leading-[27px] font-bold text-[#4A4A4A]">Cari Pekerjaan</h2>
        <Binoculars className="size-5 text-[#9293A2]" />
      </div>

      <div className="relative mb-4 shrink-0">
        <Paperclip className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#9A9AAB]" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Cari Kerja"
          className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-[#E4E3F0] focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition text-sm placeholder:text-[#9A9AAB]"
        />
        <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#FF6B00] text-white p-1.5 rounded-lg hover:bg-[#E66000] transition">
          <Send className="size-3.5" />
        </button>
      </div>

      <div className="flex flex-col divide-y divide-[#EFEFF4] flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        {filtered.length > 0 ? filtered.map(job => (
          <a key={job.url} href={job.url} target="_blank" rel="noreferrer" className="py-4 block hover:bg-[#FAFAFC] px-2 -mx-2 rounded-lg transition group">
            <h4 className="font-semibold text-[#26262F] text-[15px] group-hover:text-[#FF6B00] transition-colors leading-snug">{job.title}</h4>
            <p className="mt-0.5 text-xs text-[#8A8A98]">{job.company} · {job.location} · Hybrid</p>
            <p className="mt-1.5 text-[13px] text-[#5C5C6A] leading-5 line-clamp-2">Cocok karena keahlian kamu match dengan requirement posisi ini.</p>
          </a>
        )) : (
          <div className="py-8 text-center text-sm text-[#9A9AAB]">Tidak ada lowongan yang cocok.</div>
        )}
      </div>
    </section>
  )
}

function DetailLeftColumn({ role, score, gaps, candidateRole }: { role: CareerMatchResult; score?: CareerMatchScore; gaps: CareerSkillGap[]; candidateRole?: CareerCandidateRole }) {
  const [openSec, setOpenSec] = useState<string>('breakdown')
  const pct = Math.round(role.total_match_score)

  return (
    <section className="bg-[#FFF8F5] flex flex-col h-full">
      <div className="p-4 border-b border-[#EFEFF4] shrink-0">
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0">
            <h2 className="font-heading text-[22px] leading-[30px] font-bold text-[#20202A] truncate">{role.role_name}</h2>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="rounded-lg bg-[#FFEBDF] px-2.5 py-1 text-[12px] font-semibold text-[#D54C00]">Recommended</span>
              {candidateRole?.role_level && (
                <span className="rounded-lg bg-[#FFEBDF] px-2.5 py-1 text-[12px] font-semibold text-[#D54C00]">{candidateRole.role_level}</span>
              )}
              {candidateRole?.role_category && (
                <span className="rounded-lg bg-[#FFEBDF] px-2.5 py-1 text-[12px] font-semibold text-[#D54C00]">{candidateRole.role_category}</span>
              )}
            </div>
          </div>
          <div className="shrink-0 rounded-xl bg-[#FF6B00] px-4 py-2.5 text-center min-w-[72px]">
            <p className="text-[22px] font-bold leading-none text-white">{pct}%</p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/30">
              <div className="h-full rounded-full bg-[#10B981]" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar divide-y divide-[#EFEFF4]">

        <div className={openSec === 'desc' ? '' : ''}>
          <button type="button" onClick={() => setOpenSec(openSec === 'desc' ? '' : 'desc')} aria-expanded={openSec === 'desc'} className="flex w-full items-center justify-between gap-3 p-4 text-left">
            <div>
              <h3 className="font-heading text-[16px] leading-[27px] font-semibold text-[#20202A]">Deskripsi Karir</h3>
            </div>
            {openSec === 'desc' ? <ChevronDown className="size-5 shrink-0 text-[#FF6B00]" /> : <ChevronRight className="size-5 shrink-0 text-[#B9B9C6]" />}
          </button>
          {openSec === 'desc' && (
            <div className="px-4 pb-4">
              <p className="text-sm leading-6 text-[#5C5C6A] text-justify">{role.match_reason}</p>
            </div>
          )}
        </div>

        {/* Breakdown Kecocokan */}
        <div className={openSec === 'breakdown' ? '' : ''}>
          <button type="button" onClick={() => setOpenSec(openSec === 'breakdown' ? '' : 'breakdown')} aria-expanded={openSec === 'breakdown'} className="flex w-full items-center justify-between gap-3 p-4 text-left">
            <div>
              <h3 className="font-heading text-[16px] leading-[27px] font-semibold text-[#20202A]">Breakdown Kecocokan</h3>
              {score && <p className="mt-0.5 text-sm text-[#8A8A98]">Skor detail per kategori kompetensi</p>}
            </div>
            {openSec === 'breakdown' ? <ChevronDown className="size-5 shrink-0 text-[#FF6B00]" /> : <ChevronRight className="size-5 shrink-0 text-[#B9B9C6]" />}
          </button>
          {openSec === 'breakdown' && (
            <div className="px-4 pb-4">
              {score
                ? <OrangeBarChart score={score} />
                : <p className="rounded-lg bg-[#FAFAFC] p-4 text-center text-sm leading-6 text-[#8A8A98]">Skor detail tidak tersedia.</p>
              }
            </div>
          )}
        </div>

        {/* Skill Gap */}
        <div className={openSec === 'gap' ? '' : ''}>
          <button type="button" onClick={() => setOpenSec(openSec === 'gap' ? '' : 'gap')} aria-expanded={openSec === 'gap'} className="flex w-full items-center justify-between gap-3 p-4 text-left">
            <div>
              <h3 className="font-heading text-[18px] leading-[27px] font-bold flex items-center gap-2" style={{ background: 'linear-gradient(to right, #FF5C02, #BC030C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Skill Gap <Zap className="size-4 text-[#FF5C02]" fill="currentColor" />
              </h3>
              <p className="mt-0.5 text-sm text-[#8A8A98]">{gaps.length} gap teridentifikasi</p>
            </div>
            {openSec === 'gap' ? <ChevronDown className="size-5 shrink-0 text-[#FF6B00]" /> : <ChevronRight className="size-5 shrink-0 text-[#B9B9C6]" />}
          </button>
          {openSec === 'gap' && (
            <div className="px-4 pb-4">
              {gaps.length > 0 ? (
                <div className="flex items-end gap-1.5">
                  {gaps.slice(0, 6).map((gap, index) => {
                    const required = toSkillScore(gap.required_level)
                    const current = toSkillScore(gap.current_level)
                    const noGap = current >= required
                    const darkFraction = required > 0 ? Math.min(current / required, 1) : 1
                    const isFirst = index === 0
                    const isLast = index === Math.min(gaps.length, 6) - 1
                    return (
                      <div key={gap.gap_id} className="group relative flex min-w-0 flex-1 flex-col items-center gap-1.5">
                        <div className={cn(
                          'pointer-events-none absolute bottom-[calc(100%+8px)] z-10 w-max max-w-[170px] rounded-lg bg-[#20202A] px-2.5 py-2 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100',
                          isFirst && 'left-0', isLast && 'right-0', !isFirst && !isLast && 'left-1/2 -translate-x-1/2'
                        )}>
                          <p className="text-[11px] font-semibold leading-4 text-white">{gap.skill_name}</p>
                          <p className="mt-1 text-[10.5px] leading-4 text-white/70">Level kamu <span className="font-semibold text-white">{skillScoreLabel(current)} · {current}</span></p>
                          <p className="text-[10.5px] leading-4 text-white/70">Dibutuhkan <span className="font-semibold text-white">{skillScoreLabel(required)} · {required}</span></p>
                          <span className={cn('absolute top-full -mt-px size-1.5 rotate-45 bg-[#20202A]', isFirst && 'left-6', isLast && 'right-6', !isFirst && !isLast && 'left-1/2 -translate-x-1/2')} />
                        </div>
                        <div className="flex h-[90px] w-full items-end justify-center">
                          <div className="relative w-full max-w-[88px] overflow-hidden rounded-sm bg-[#FFE5D5] transition-colors group-hover:bg-[#FFD5BB]" style={{ height: `${Math.max(required, 14)}%` }}>
                            <div className="absolute inset-x-0 bottom-0 rounded-sm bg-[#FF6B00]" style={{ height: `${darkFraction * 100}%` }} />
                          </div>
                        </div>
                        <div className="flex max-w-full items-center gap-1 text-[11px] font-medium text-[#7C7C8C]">
                          {noGap && <CheckCircle2 className="size-3 shrink-0 text-emerald-500" />}
                          <span className="truncate" title={gap.skill_name}>{gap.skill_name.length > 8 ? gap.skill_name.slice(0, 8) + '…' : gap.skill_name}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="rounded-lg bg-emerald-50 p-4 text-center text-sm leading-6 text-emerald-700">Tidak ada skill gap teridentifikasi.</p>
              )}
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-heading text-[18px] leading-[27px] font-bold flex items-center gap-2" style={{ background: 'linear-gradient(to right, #FF5C02, #BC030C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Peta Kemajuan <span className="h-px flex-1 w-36 bg-[#FFE5D5] inline-block" /></p>
          </div>
          <div className="flex items-end gap-3">
            <div className="flex gap-1.5 flex-1 h-10">
              {Array.from({ length: 22 }).map((_, i) => {
                const filled = i < Math.round((pct / 100) * 22)
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-[2px] transition-colors"
                    style={filled ? {
                      background: `#FF5C02`,
                    } : { background: '#FFE5D5' }}
                  />
                )
              })}
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span className="text-2xl font-bold leading-none" style={{ background: 'linear-gradient(to right, #FF5C02, #BC030C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{pct}%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


function OrangeBarChart({ score }: { score: CareerMatchScore }) {
  const bars = [
    { label: 'Skill', key: 'Skill Match', value: score.skill_match_score },
    { label: 'Experience', key: 'Pengalaman & Proyek', value: score.experience_project_score },
    { label: 'Education', key: 'Pendidikan', value: score.education_score },
    { label: 'RIASEC', key: 'RIASEC Fit', value: score.riasec_fit_score },
    { label: 'Workstyle', key: 'Workstyle (OCEAN)', value: score.ocean_workstyle_score },
    { label: 'Preference', key: 'Preferensi Kerja', value: score.preference_score },
  ]
  const maxValue = Math.max(...bars.map(b => b.value), 1)

  return (
    <div className="mt-2">
      <div className="flex items-end gap-2 h-[130px]">
        {bars.map((bar, i) => {
          const heightPct = Math.max((bar.value / maxValue) * 100, 8)
          return (
            <div key={i} className="group relative flex-1 h-full flex items-end">
              {/* Hover tooltip */}
              <div className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 z-20 w-max max-w-[140px] rounded-lg bg-[#20202A] px-2.5 py-2 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                <p className="text-[11px] font-semibold text-white">{bar.key}</p>
                <p className="text-[10px] text-white/70 mt-0.5">Skor: <span className="font-bold text-white">{Math.round(bar.value)}</span></p>
                <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px size-1.5 rotate-45 bg-[#20202A]" />
              </div>
              {/* Background track */}
              <div className="absolute inset-0 rounded-xl bg-[#FFD9C4]" />
              {/* Filled bar from bottom */}
              <div
                className="relative w-full rounded-xl transition-all duration-700 ease-out bg-[#FF5C02]"
                style={{
                  height: `${heightPct}%`,
                }}
              />
            </div>
          )
        })}
      </div>
      {/* Labels */}
      <div className="flex gap-2 mt-2.5">
        {bars.map((bar, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            <CheckCircle2 className="size-3 text-[#FF6B00]" />
            <span className="text-[10px] font-bold text-[#FF6B00] truncate w-full text-center" title={bar.label}>{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DetailRightColumn({ jobs, learningResult }: { jobs: JobMatcherResult['active_job_postings']; learningResult?: TalentForgerResult | null }) {
  const totalHours = learningResult?.learning_resources?.reduce((acc, res) => acc + (res.estimated_duration_hours || 0), 0) || 0
  const videoCount = learningResult?.learning_resources?.filter(res => res.resource_type?.toLowerCase().includes('video')).length || 0
  const levels = learningResult?.learning_resources?.map(r => r.difficulty_level).filter(Boolean) || []
  const primaryLevel = levels.length > 0 ? (levels[0].charAt(0).toUpperCase() + levels[0].slice(1)) : 'Intermediate'

  return (
    <div className="flex flex-col h-full">
      <section className="bg-white flex-1 min-h-0 flex flex-col p-4">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-[#FFF5F0] p-1.5 rounded-lg">
              <BriefcaseBusiness className="size-4 text-[#FF6B00]" />
            </div>
            <h2 className="font-heading text-[18px] leading-[27px] font-bold text-[#4A4A4A]">Posisi Relevan</h2>
          </div>
        </div>
        <div className="flex flex-col divide-y divide-[#EFEFF4] overflow-y-auto custom-scrollbar flex-1 min-h-0">
          {jobs.length > 0 ? jobs.map(job => (
            <a key={job.url} href={job.url} target="_blank" rel="noreferrer" className="py-4 block hover:bg-[#FAFAFC] px-2 -mx-2 rounded-lg transition group">
              <h4 className="font-semibold text-[#26262F] text-[15px] group-hover:text-[#FF6B00] transition-colors leading-snug">{job.title}</h4>
              <p className="mt-0.5 text-xs text-[#8A8A98]">{job.company} · {job.location} · Hybrid</p>
              <p className="mt-1.5 text-[13px] text-[#5C5C6A] leading-5 line-clamp-2">Cocok karena keahlian kamu match dengan requirement posisi ini.</p>
            </a>
          )) : (
            <div className="py-8 text-center text-sm text-[#9A9AAB]">Belum ada lowongan relevan.</div>
          )}
        </div>
      </section>

      <section className="bg-white border-t border-[0.1px] border-[#FFD9C4] p-4 shrink-0">
        <Link href="/job-seeker/learning-paths" className="w-full bg-[#FF6B00] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#E66000] transition text-[14px] shadow-[0_4px_16px_rgba(255,107,0,0.3)]">
          <PlayCircle className="size-5" /> Lanjut Belajar
        </Link>
      </section>
    </div>
  )
}

function PipelineNotice({ tone, title, description }: { tone: 'loading' | 'error'; title: string; description: string }) {
  return (
    <div className={cn('flex items-start gap-3 rounded-2xl border p-4', tone === 'loading' ? 'border-[#FFDCC8] bg-[#FFF9F5] text-[#FF6B00]' : 'border-rose-100 bg-rose-50 text-rose-900')}>
      <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl', tone === 'loading' ? 'bg-[#FFF5F0]' : 'bg-rose-100')}>
        {tone === 'loading' ? <MathCurveLoader size={26} label="Memproses JobMatcher" /> : <AlertCircle className="size-4" />}
      </span>
      <div><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-5 opacity-80 text-[#8A8A98]">{description}</p></div>
    </div>
  )
}

function OnboardingRequired() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F7F7FB] p-5 sm:p-7 flex items-center justify-center">
      <Card className="max-w-2xl w-full rounded-3xl bg-white ring-[#E9E7F2] shadow-sm">
        <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center py-10">
          <span className="grid size-16 place-items-center rounded-3xl bg-[#FFF5F0] text-[#FF6B00] mb-2"><BriefcaseBusiness className="size-7" /></span>
          <h1 className="mt-4 text-2xl font-bold text-[#302D37]">Selesaikan onboarding terlebih dahulu</h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#8A8A98]">JobMatcher membutuhkan profil, assessment, dan preferensi yang lengkap agar rekomendasinya akurat.</p>
          <Link className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-[#FF6B00] px-6 text-sm font-bold text-white hover:bg-[#E66000] shadow-md transition" href="/job-seeker/onboarding">Lanjutkan onboarding <ArrowRight className="size-4" /></Link>
        </div>
      </Card>
    </div>
  )
}
