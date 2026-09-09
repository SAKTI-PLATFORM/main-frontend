'use client'

import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ExternalLink,
  FileText,
  Filter,
  Globe,
  Play,
  Search,
  Target,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { cn } from '@/lib/utils'
import { MathCurveLoader } from '@/components/ui/math-curve-loader'
import { useDashboard } from '@/features/dashboard/use-dashboard'
import { DashboardLoading, DashboardError } from '@/components/dashboard/dashboard-status'
import type { LearningResourceResult } from '@/types/career-pipeline.types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resourceTypeIcon(type: string): React.ReactNode {
  const lower = (type ?? '').toLowerCase()
  if (lower.includes('video')) return <Play className="size-4 shrink-0" />
  if (lower.includes('article') || lower.includes('blog')) return <FileText className="size-4 shrink-0" />
  return <Globe className="size-4 shrink-0" />
}

/** Collapse the many raw `resource_type` strings from the AI into a few buckets. */
function typeLabel(raw: string): string {
  const t = (raw ?? '').toLowerCase()
  if (t.includes('video')) return 'Video'
  if (t.includes('article') || t.includes('blog')) return 'Artikel'
  if (t.includes('course') || t.includes('bootcamp') || t.includes('specialization') || t.includes('certificate')) return 'Course'
  if (t.includes('interactive') || t.includes('practice') || t.includes('exercise')) return 'Interaktif'
  if (t.includes('book') || t.includes('doc')) return 'Dokumentasi'
  return raw ? titleCase(raw) : 'Lainnya'
}

function titleCase(s?: string | null): string {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

function durationLabel(hours: number): string {
  if (hours <= 0) return ''
  if (hours < 1) return `${Math.round(hours * 60)} menit`
  return `${hours % 1 === 0 ? hours : hours.toFixed(1)} jam`
}

/** Facet options ordered by frequency, then alphabetically. */
function sortedFacet(map: Map<string, number>): string[] {
  return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([k]) => k)
}

type CostFilter = 'all' | 'free' | 'paid'
type SortKey = 'relevan' | 'durasi-asc' | 'durasi-desc' | 'gratis'

// ─── Filter Section ───────────────────────────────────────────────────────────

function FilterSection({
  title,
  items,
  counts,
  selected,
  onToggle,
  hasSearch = false,
  searchPlaceholder = '',
}: {
  title: string
  items: string[]
  counts?: Map<string, number>
  selected: Set<string>
  onToggle: (item: string) => void
  hasSearch?: boolean
  searchPlaceholder?: string
}) {
  const [isOpen, setIsOpen] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [query, setQuery] = useState('')

  const filteredItems = items.filter((item) => item.toLowerCase().includes(query.toLowerCase()))
  const displayItems = isExpanded ? filteredItems : filteredItems.slice(0, 5)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="font-bold text-[#8E8E8E] text-[14px] font-heading tracking-wide">{title}</h3>
        <div className="size-5 relative flex items-center justify-center">
          {isOpen ? (
            <div className="w-3.5 h-[2px] bg-[#8E8E8E]" />
          ) : (
            <div className="relative w-3.5 h-3.5">
              <div className="absolute top-1/2 left-0 w-3.5 h-[2px] -translate-y-1/2 bg-[#8E8E8E]" />
              <div className="absolute top-0 left-1/2 w-[2px] h-3.5 -translate-x-1/2 bg-[#8E8E8E]" />
            </div>
          )}
        </div>
      </div>
      {isOpen && (
        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {hasSearch && (
            <div className="flex items-center gap-3 rounded-[10px] border-[0.75px] border-[#BDB8A6] px-3 py-2">
              <Search className="size-[13px] text-[#AFA499]" strokeWidth={2.5} />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full text-[13px] text-[#65564A] placeholder-[#AFA499] font-sans bg-transparent outline-none"
              />
            </div>
          )}
          {filteredItems.length === 0 ? (
            <p className="text-[13px] text-[#B7B7C2]">Tidak ada pilihan.</p>
          ) : (
            <div
              className={cn(
                'flex flex-col gap-2',
                isExpanded && 'max-h-[200px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
              )}
            >
              {displayItems.map((item) => {
                const isChecked = selected.has(item)
                return (
                  <label key={item} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
                    <span className="relative size-[22px] shrink-0">
                      <span
                        className={cn(
                          'absolute inset-0 m-0.5 flex items-center justify-center rounded border-[1.6px] transition-colors',
                          isChecked ? 'border-[#045DEF] bg-[#045DEF]' : 'border-[#A4A4A4] group-hover:border-[#045DEF]',
                        )}
                      >
                        {isChecked && <Check className="size-3 text-white" strokeWidth={3.5} />}
                      </span>
                      <input type="checkbox" className="sr-only" checked={isChecked} onChange={() => onToggle(item)} />
                    </span>
                    <span className="flex-1 truncate text-[14px] text-[#3B361E] font-sans">{item}</span>
                    {counts?.get(item) != null && (
                      <span className="text-[12px] tabular-nums text-[#B7B7C2] font-sans">{counts.get(item)}</span>
                    )}
                  </label>
                )
              })}
              {!isExpanded && filteredItems.length > 5 && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="mt-0.5 text-left text-[14px] text-[#777777] font-sans hover:text-[#045DEF]"
                >
                  {title.toLowerCase()} lainnya…
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Material Card ────────────────────────────────────────────────────────────
// Mirrors the ResourceCard on the roadmap page — the whole card links out to
// `resource.url` in a new tab.

function MaterialCard({ resource }: { resource: LearningResourceResult }) {
  const duration = durationLabel(resource.estimated_duration_hours ?? 0)

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col rounded-lg border border-[#F0F0F5] bg-white p-4 transition hover:border-[#045DEF]/30 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FE] text-[#045DEF]">
          {resourceTypeIcon(resource.resource_type)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[14px] font-semibold leading-snug text-[#292631] transition-colors group-hover:text-[#045DEF]">
            {resource.resource_title}
          </h3>
          <p className="mt-0.5 text-[12px] text-[#8A8A98]">{resource.provider}</p>
        </div>
        <ExternalLink className="size-4 shrink-0 text-[#CBD5E1] transition-colors group-hover:text-[#045DEF]" />
      </div>

      {resource.summary && <p className="mt-2.5 line-clamp-3 text-[12px] leading-5 text-[#7C8493]">{resource.summary}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="rounded-md bg-[#F4F4F7] px-2 py-0.5 text-[11px] font-medium text-[#5C5C6A]">{typeLabel(resource.resource_type)}</span>
        {resource.difficulty_level && (
          <span className="rounded-md bg-[#F4F4F7] px-2 py-0.5 text-[11px] font-medium text-[#5C5C6A]">{titleCase(resource.difficulty_level)}</span>
        )}
        {duration && <span className="rounded-md bg-[#F4F4F7] px-2 py-0.5 text-[11px] font-medium text-[#5C5C6A]">{duration}</span>}
        {resource.is_free ? (
          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">Gratis</span>
        ) : (
          <span className="rounded-md bg-[#EFF6FE] px-2 py-0.5 text-[11px] font-semibold text-[#045DEF]">Berbayar</span>
        )}
      </div>

      {resource.skill_name && (
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#9CA3AF]">
          <Target className="size-3 shrink-0" />
          <span className="truncate">{resource.skill_name}</span>
        </div>
      )}
    </a>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ExploreMaterialsPage() {
  const dashboardState = useDashboard()

  const [query, setQuery] = useState('')
  const [typeSel, setTypeSel] = useState<Set<string>>(new Set())
  const [levelSel, setLevelSel] = useState<Set<string>>(new Set())
  const [providerSel, setProviderSel] = useState<Set<string>>(new Set())
  const [skillSel, setSkillSel] = useState<Set<string>>(new Set())
  const [costSel, setCostSel] = useState<CostFilter>('all')
  const [sort, setSort] = useState<SortKey>('relevan')

  const [showScrollDown, setShowScrollDown] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const ready = dashboardState.status === 'ready' ? dashboardState : null
  const learningPath = ready?.learningPath ?? null
  const lpResult = learningPath?.result ?? null
  const targetRole = lpResult?.learning_paths?.[0]?.target_role ?? null
  const lpProcessing = learningPath?.status === 'PENDING' || learningPath?.status === 'RUNNING'

  // Every resource from the latest roadmap — paid catalogue + free materials —
  // deduped by id (falling back to title+url).
  const materials = useMemo<LearningResourceResult[]>(() => {
    const all = [...(lpResult?.learning_resources ?? []), ...(lpResult?.free_materials ?? [])]
    const seen = new Set<string>()
    return all.filter((r) => {
      const key = r.resource_id || `${r.resource_title}|${r.url}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [lpResult])

  const facets = useMemo(() => {
    const types = new Map<string, number>()
    const levels = new Map<string, number>()
    const providers = new Map<string, number>()
    const skills = new Map<string, number>()
    const bump = (m: Map<string, number>, k: string) => {
      if (k) m.set(k, (m.get(k) ?? 0) + 1)
    }
    for (const r of materials) {
      bump(types, typeLabel(r.resource_type))
      bump(levels, titleCase(r.difficulty_level))
      bump(providers, r.provider)
      bump(skills, r.skill_name)
    }
    return {
      types: sortedFacet(types),
      typeCounts: types,
      levels: sortedFacet(levels),
      levelCounts: levels,
      providers: sortedFacet(providers),
      providerCounts: providers,
      skills: sortedFacet(skills),
      skillCounts: skills,
    }
  }, [materials])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = materials.filter((r) => {
      if (q) {
        const haystack = `${r.resource_title} ${r.provider} ${r.skill_name} ${r.summary ?? ''}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      if (typeSel.size && !typeSel.has(typeLabel(r.resource_type))) return false
      if (levelSel.size && !levelSel.has(titleCase(r.difficulty_level))) return false
      if (providerSel.size && !providerSel.has(r.provider)) return false
      if (skillSel.size && !skillSel.has(r.skill_name)) return false
      if (costSel === 'free' && !r.is_free) return false
      if (costSel === 'paid' && r.is_free) return false
      return true
    })
    const dur = (r: LearningResourceResult) => r.estimated_duration_hours ?? 0
    if (sort === 'durasi-asc') list = [...list].sort((a, b) => dur(a) - dur(b))
    else if (sort === 'durasi-desc') list = [...list].sort((a, b) => dur(b) - dur(a))
    else if (sort === 'gratis') list = [...list].sort((a, b) => Number(Boolean(b.is_free)) - Number(Boolean(a.is_free)))
    return list
  }, [materials, query, typeSel, levelSel, providerSel, skillSel, costSel, sort])

  const totalHours = filtered.reduce((acc, r) => acc + (r.estimated_duration_hours ?? 0), 0)
  const freeCount = filtered.filter((r) => r.is_free).length
  const activeFilterCount =
    typeSel.size + levelSel.size + providerSel.size + skillSel.size + (costSel !== 'all' ? 1 : 0) + (query.trim() ? 1 : 0)

  const toggle = (setter: Dispatch<SetStateAction<Set<string>>>) => (item: string) =>
    setter((prev) => {
      const next = new Set(prev)
      if (next.has(item)) next.delete(item)
      else next.add(item)
      return next
    })

  const resetFilters = () => {
    setQuery('')
    setTypeSel(new Set())
    setLevelSel(new Set())
    setProviderSel(new Set())
    setSkillSel(new Set())
    setCostSel('all')
    setSort('relevan')
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      setShowScrollDown(!(scrollTop > 50 || scrollTop + clientHeight >= scrollHeight - 10))
    }
  }
  const scrollDown = () => {
    scrollRef.current?.scrollBy({ top: 400, behavior: 'smooth' })
    setShowScrollDown(false)
  }

  if (dashboardState.status === 'loading') return <DashboardLoading />
  if (dashboardState.status === 'error') return <DashboardError />

  const hasMaterials = materials.length > 0

  return (
    <div className="flex h-[calc(100vh-76px)] flex-col bg-[#F7F7FB]">
      <div className="mx-auto flex h-full w-full max-w-[1500px] flex-col px-4 py-3 sm:px-6 sm:py-4">
        <div className="grid min-h-0 flex-1 items-start gap-6 xl:grid-cols-[1fr_320px]">
          {/* ── Left: material catalogue ─────────────────────────────── */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="relative flex h-full flex-col gap-6 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {/* Hero */}
            <div className="relative shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-[#045DEF] to-[#0047C8] p-5 text-white sm:p-6">
              <Image
                src="/logo-dash.png"
                alt=""
                width={300}
                height={400}
                className="pointer-events-none absolute -right-6 top-0 w-4/7 max-w-none select-none opacity-80"
              />
              <div className="relative z-10 flex max-w-2xl flex-col items-start gap-3">
                <p className="text-xs font-medium text-white/70">Eksplorasi Materi Belajar</p>
                <h1 className="font-heading text-[20px] font-bold leading-[30px] tracking-[-0.01em] sm:text-[24px] sm:leading-[36px]">
                  Materi &amp; Sumber Belajar
                </h1>
                <p className="text-[13px] leading-relaxed text-white/80">
                  {targetRole ? (
                    <>
                      Semua kursus, video, artikel, dan latihan dari roadmap <strong>{targetRole}</strong> untuk menutup skill gap kamu.
                    </>
                  ) : (
                    <>Kumpulan materi dari roadmap belajarmu — kursus, video, artikel, dan latihan.</>
                  )}
                </p>
                <div className="mt-1 flex w-full max-w-lg items-center gap-3 rounded-lg bg-white/95 px-4 py-3 shadow-inner">
                  <Search className="size-4 shrink-0 text-[#8E8E8E]" />
                  <input
                    type="text"
                    placeholder="Cari materi, provider, atau skill (mis. SQL, Coursera)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full flex-grow bg-transparent text-sm text-[#282510] placeholder-[#A4A4A4] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Results header */}
            {hasMaterials && !lpProcessing && (
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
                <p className="text-[13px] text-[#4A4A4A]">
                  <span className="font-bold text-[#045DEF]">{filtered.length}</span> materi
                  {totalHours > 0 && <> · ~{Math.round(totalHours)} jam</>}
                  {freeCount > 0 && <> · {freeCount} gratis</>}
                </p>
                <div className="flex items-center gap-2 text-[13px] text-[#4A4A4A]">
                  <span className="whitespace-nowrap">Urutkan:</span>
                  <div className="relative">
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value as SortKey)}
                      className="cursor-pointer appearance-none rounded-lg border border-[#CFE0FE] bg-[#EFF6FE] py-2 pl-4 pr-9 font-medium text-[#045DEF] outline-none"
                    >
                      <option value="relevan">Relevansi</option>
                      <option value="durasi-asc">Durasi Terpendek</option>
                      <option value="durasi-desc">Durasi Terpanjang</option>
                      <option value="gratis">Gratis Dulu</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#045DEF]" />
                  </div>
                </div>
              </div>
            )}

            {/* Body */}
            {lpProcessing ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16">
                <MathCurveLoader size={40} label="Menyiapkan materi belajar…" />
                <p className="text-sm text-[#9CA3AF]">Sakti AI sedang menyusun roadmap &amp; materinya. Biasanya 1–3 menit.</p>
              </div>
            ) : !hasMaterials ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <BookOpen className="size-12 text-[#CBD5E1]" />
                <h3 className="text-base font-semibold text-[#4A4A4A]">Belum ada materi</h3>
                <p className="max-w-sm text-sm text-[#9CA3AF]">
                  Buat roadmap belajar dulu untuk mendapatkan rekomendasi kursus, video, dan artikel yang sesuai skill gap kamu.
                </p>
                <Link
                  href="/job-seeker/learning-paths"
                  className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#045DEF] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0047C8]"
                >
                  Ke Roadmap Belajar <ArrowRight className="size-4" />
                </Link>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <Target className="size-12 text-[#CBD5E1]" />
                <h3 className="text-base font-semibold text-[#4A4A4A]">Tidak ada materi cocok</h3>
                <p className="max-w-sm text-sm text-[#9CA3AF]">Coba longgarkan filter atau ganti kata kunci pencarian.</p>
                <button
                  onClick={resetFilters}
                  className="mt-2 inline-flex items-center gap-2 rounded-lg border border-[#CFE0FE] bg-[#EFF6FE] px-4 py-2 text-sm font-medium text-[#045DEF] transition hover:bg-[#CFE0FE]"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 pb-24 md:grid-cols-2">
                {filtered.map((resource) => (
                  <MaterialCard key={resource.resource_id || resource.url} resource={resource} />
                ))}
              </div>
            )}

            {/* Scroll affordance */}
            <div
              className={cn(
                'pointer-events-none sticky bottom-0 left-0 right-0 flex h-32 items-end justify-center bg-gradient-to-t from-[#F7F7FB] via-[#F7F7FB]/80 to-transparent pb-6 transition-opacity duration-300',
                showScrollDown && !lpProcessing && filtered.length > 4 ? 'opacity-100' : 'opacity-0',
              )}
            >
              <button
                onClick={scrollDown}
                className="pointer-events-auto flex items-center gap-2 rounded-full bg-[#0047C8] px-4 py-2.5 text-[12px] font-medium text-white shadow-lg transition hover:bg-[#0047A5]"
              >
                Gulir ke bawah <ArrowDown className="size-4" />
              </button>
            </div>
          </div>

          {/* ── Right: filters ───────────────────────────────────────── */}
          <div className="sticky top-0 flex h-fit max-h-full shrink-0 flex-col overflow-y-auto rounded-lg bg-white ring-1 ring-[#ECECF2] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-[#EFF6FE] to-[#8FB5FB] p-5">
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Filter className="size-5 text-[#045DEF]" />
                  <h2 className="font-heading text-[20px] font-bold leading-[27px] text-[#4A4A4A]">Filter</h2>
                  {activeFilterCount > 0 && (
                    <span className="rounded-full bg-[#045DEF] px-2 py-0.5 text-[11px] font-bold text-white">{activeFilterCount}</span>
                  )}
                </div>
                <button
                  onClick={resetFilters}
                  disabled={activeFilterCount === 0}
                  className="text-sm font-normal text-[#045DEF] font-sans hover:underline disabled:opacity-40 disabled:hover:no-underline"
                >
                  Reset
                </button>
              </div>
              <p className="relative z-10 mt-2 text-[13px] leading-[21px] text-[#8A8A98] font-sans">
                Saring materi berdasarkan tipe, level, biaya, dan skill.
              </p>
            </div>

            <div className="space-y-6 p-6">
              {/* Biaya */}
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-[#8E8E8E] text-[14px] font-heading tracking-wide">BIAYA</h3>
                <div className="flex gap-1.5 rounded-lg bg-[#F4F4F7] p-1">
                  {(['all', 'free', 'paid'] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCostSel(c)}
                      className={cn(
                        'flex-1 rounded-md px-2 py-1.5 text-[12px] font-medium transition',
                        costSel === c ? 'bg-white text-[#045DEF] shadow-sm' : 'text-[#8A8A98] hover:text-[#4A4A4A]',
                      )}
                    >
                      {c === 'all' ? 'Semua' : c === 'free' ? 'Gratis' : 'Berbayar'}
                    </button>
                  ))}
                </div>
              </div>

              {facets.types.length > 0 && (
                <FilterSection title="TIPE" items={facets.types} counts={facets.typeCounts} selected={typeSel} onToggle={toggle(setTypeSel)} />
              )}
              {facets.levels.length > 0 && (
                <FilterSection title="LEVEL" items={facets.levels} counts={facets.levelCounts} selected={levelSel} onToggle={toggle(setLevelSel)} />
              )}
              {facets.skills.length > 0 && (
                <FilterSection
                  title="SKILL"
                  items={facets.skills}
                  counts={facets.skillCounts}
                  selected={skillSel}
                  onToggle={toggle(setSkillSel)}
                  hasSearch
                  searchPlaceholder="Cari skill"
                />
              )}
              {facets.providers.length > 0 && (
                <FilterSection
                  title="PROVIDER"
                  items={facets.providers}
                  counts={facets.providerCounts}
                  selected={providerSel}
                  onToggle={toggle(setProviderSel)}
                  hasSearch
                  searchPlaceholder="Cari provider"
                />
              )}

              {!hasMaterials && !lpProcessing && (
                <p className="rounded-lg bg-[#FAFAFC] p-4 text-center text-[13px] leading-5 text-[#8A8A98]">
                  Filter akan muncul setelah roadmap belajarmu dibuat.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
