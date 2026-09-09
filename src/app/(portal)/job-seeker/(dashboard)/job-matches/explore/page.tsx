'use client'

import {
  ArrowDown,
  ArrowRight,
  Briefcase,
  Check,
  ChevronDown,
  ChevronRight,
  Filter,
  MapPin,
  Search,
  SearchX,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { cn } from '@/lib/utils'
import { MathCurveLoader } from '@/components/ui/math-curve-loader'
import { seekerApi } from '@/api/seeker.api'
import type { JobPosting } from '@/types/career-pipeline.types'
import { JobDetail } from './_job-detail'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Facet options ordered by frequency, then alphabetically. */
function sortedFacet(map: Map<string, number>): string[] {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([k]) => k)
}

type SortKey = 'relevan' | 'judul' | 'perusahaan'

// ─── Filter Section ───────────────────────────────────────────────────────────
// Same collapsible facet control as the learning-materials explore page,
// recoloured for the job-matches (orange) system.

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
            <div className="flex items-center gap-3 rounded-[10px] border-[0.75px] border-[#E4C9B4] px-3 py-2">
              <Search className="size-[13px] text-[#C9A98F]" strokeWidth={2.5} />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full text-[13px] text-[#65564A] placeholder-[#C9A98F] font-sans bg-transparent outline-none"
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
                          isChecked ? 'border-[#FF6B00] bg-[#FF6B00]' : 'border-[#A4A4A4] group-hover:border-[#FF6B00]',
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
                  className="mt-0.5 text-left text-[14px] text-[#777777] font-sans hover:text-[#FF6B00]"
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

// ─── Job Card ─────────────────────────────────────────────────────────────────

function JobCard({ job, onSelect }: { job: JobPosting; onSelect: (id: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(job.id)}
      className="group flex flex-col rounded-lg border border-[#F0F0F5] bg-white p-4 text-left transition hover:border-[#FF6B00]/30 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF5F0] text-[#FF6B00]">
          <Briefcase className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[14px] font-semibold leading-snug text-[#292631] transition-colors group-hover:text-[#FF6B00]">
            {job.title}
          </h3>
          <p className="mt-0.5 text-[12px] text-[#8A8A98]">{job.company || 'Perusahaan tidak disebutkan'}</p>
        </div>
        <ChevronRight className="size-4 shrink-0 text-[#CBD5E1] transition-colors group-hover:text-[#FF6B00]" />
      </div>

      <p className="mt-2.5 line-clamp-2 text-[12px] leading-5 text-[#7C8493]">
        Cocok karena keahlian kamu sejalan dengan kebutuhan posisi ini.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {job.location && (
          <span className="inline-flex items-center gap-1 rounded-md bg-[#F4F4F7] px-2 py-0.5 text-[11px] font-medium text-[#5C5C6A]">
            <MapPin className="size-3" /> {job.location}
          </span>
        )}
        <span className="rounded-md bg-[#FFF5F0] px-2 py-0.5 text-[11px] font-semibold text-[#FF6B00]">Hybrid</span>
      </div>
    </button>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ExploreJobsPage() {
  const [postings, setPostings] = useState<JobPosting[] | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const [locSel, setLocSel] = useState<Set<string>>(new Set())
  const [companySel, setCompanySel] = useState<Set<string>>(new Set())
  const [sort, setSort] = useState<SortKey>('relevan')

  const [showScrollDown, setShowScrollDown] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let alive = true
    seekerApi
      .getJobPostings({ limit: 200 })
      .then((res) => {
        if (!alive) return
        setPostings(res.data.data.postings)
        setStatus('ready')
      })
      .catch(() => {
        if (alive) setStatus('error')
      })
    return () => {
      alive = false
    }
  }, [])

  const list = useMemo<JobPosting[]>(() => postings ?? [], [postings])

  const facets = useMemo(() => {
    const loc = new Map<string, number>()
    const comp = new Map<string, number>()
    const bump = (m: Map<string, number>, k: string) => {
      if (k) m.set(k, (m.get(k) ?? 0) + 1)
    }
    for (const job of list) {
      bump(loc, job.location)
      bump(comp, job.company)
    }
    return {
      locations: sortedFacet(loc),
      locationCounts: loc,
      companies: sortedFacet(comp),
      companyCounts: comp,
    }
  }, [list])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let out = list.filter((job) => {
      if (q && !`${job.title} ${job.company} ${job.location}`.toLowerCase().includes(q)) return false
      if (locSel.size && !locSel.has(job.location)) return false
      if (companySel.size && !companySel.has(job.company)) return false
      return true
    })
    if (sort === 'judul') out = [...out].sort((a, b) => a.title.localeCompare(b.title))
    else if (sort === 'perusahaan') out = [...out].sort((a, b) => a.company.localeCompare(b.company))
    return out
  }, [list, query, locSel, companySel, sort])

  const activeFilterCount = locSel.size + companySel.size + (query.trim() ? 1 : 0)

  const toggle =
    (setter: Dispatch<SetStateAction<Set<string>>>) => (item: string) =>
      setter((prev) => {
        const next = new Set(prev)
        if (next.has(item)) next.delete(item)
        else next.add(item)
        return next
      })

  const resetFilters = () => {
    setQuery('')
    setLocSel(new Set())
    setCompanySel(new Set())
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

  const hasJobs = list.length > 0

  return (
    <div className="flex h-[calc(100vh-76px)] flex-col bg-[#F7F7FB]">
      <div className="mx-auto flex h-full w-full max-w-[1500px] flex-col px-4 py-3 sm:px-6 sm:py-4">
        {selectedId ? (
          <div className="min-h-0 flex-1">
            <JobDetail
              key={selectedId}
              jobId={selectedId}
              onBack={() => setSelectedId(null)}
              onSelect={setSelectedId}
            />
          </div>
        ) : (
        <div className="grid min-h-0 flex-1 items-start gap-6 xl:grid-cols-[1fr_320px]">
          {/* ── Left: job catalogue ──────────────────────────────────── */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="relative flex h-full flex-col gap-6 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {/* Hero */}
            <div className="relative shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-[#FF8C00] to-[#FF6B00] p-5 text-white sm:p-6">
              <Image
                src="/logo-dash.png"
                alt=""
                width={300}
                height={400}
                className="pointer-events-none absolute -right-6 top-0 w-4/7 max-w-none select-none opacity-80"
              />
              <div className="relative z-10 flex max-w-2xl flex-col items-start gap-3">
                <p className="text-xs font-medium text-white/70">Eksplorasi Lowongan</p>
                <h1 className="font-heading text-[20px] font-bold leading-[30px] tracking-[-0.01em] sm:text-[24px] sm:leading-[36px]">
                  Lowongan Kerja
                </h1>
                <p className="text-[13px] leading-relaxed text-white/80">
                  Semua lowongan yang dikumpulkan SAKTI AI dari proses pencocokan karier — dalam satu tempat.
                </p>
                <div className="mt-1 flex w-full max-w-lg items-center gap-3 rounded-lg bg-white/95 px-4 py-3 shadow-inner">
                  <Search className="size-4 shrink-0 text-[#8E8E8E]" />
                  <input
                    type="text"
                    placeholder="Cari posisi, perusahaan, atau lokasi (mis. Backend, Jakarta)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full flex-grow bg-transparent text-sm text-[#282510] placeholder-[#A4A4A4] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Results header */}
            {status === 'ready' && hasJobs && (
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
                <p className="text-[13px] text-[#4A4A4A]">
                  <span className="font-bold text-[#FF6B00]">{filtered.length}</span> lowongan
                  {facets.companies.length > 0 && <> · {facets.companies.length} perusahaan</>}
                </p>
                <div className="flex items-center gap-2 text-[13px] text-[#4A4A4A]">
                  <span className="whitespace-nowrap">Urutkan:</span>
                  <div className="relative">
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value as SortKey)}
                      className="cursor-pointer appearance-none rounded-lg border border-[#FFD9C4] bg-[#FFF5F0] py-2 pl-4 pr-9 font-medium text-[#FF6B00] outline-none"
                    >
                      <option value="relevan">Relevansi</option>
                      <option value="judul">Judul A–Z</option>
                      <option value="perusahaan">Perusahaan A–Z</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#FF6B00]" />
                  </div>
                </div>
              </div>
            )}

            {/* Body */}
            {status === 'loading' ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16">
                <MathCurveLoader size={40} label="Memuat lowongan…" />
                <p className="text-sm text-[#9CA3AF]">Mengambil daftar lowongan dari database.</p>
              </div>
            ) : status === 'error' ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <SearchX className="size-12 text-[#CBD5E1]" />
                <h3 className="text-base font-semibold text-[#4A4A4A]">Gagal memuat lowongan</h3>
                <p className="max-w-sm text-sm text-[#9CA3AF]">Coba muat ulang halaman ini sebentar lagi.</p>
              </div>
            ) : !hasJobs ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <Briefcase className="size-12 text-[#CBD5E1]" />
                <h3 className="text-base font-semibold text-[#4A4A4A]">Belum ada lowongan</h3>
                <p className="max-w-sm text-sm text-[#9CA3AF]">
                  Jalankan pencocokan karier (Job Matches) dulu supaya SAKTI AI mengumpulkan lowongan yang relevan ke database.
                </p>
                <Link
                  href="/job-seeker/job-matches"
                  className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#FF6B00] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E66000]"
                >
                  Ke Job Matches <ArrowRight className="size-4" />
                </Link>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <SearchX className="size-12 text-[#CBD5E1]" />
                <h3 className="text-base font-semibold text-[#4A4A4A]">Tidak ada lowongan cocok</h3>
                <p className="max-w-sm text-sm text-[#9CA3AF]">Coba longgarkan filter atau ganti kata kunci pencarian.</p>
                <button
                  onClick={resetFilters}
                  className="mt-2 inline-flex items-center gap-2 rounded-lg border border-[#FFD9C4] bg-[#FFF5F0] px-4 py-2 text-sm font-medium text-[#FF6B00] transition hover:bg-[#FFE5D5]"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 pb-24 md:grid-cols-2">
                {filtered.map((job) => (
                  <JobCard key={job.id} job={job} onSelect={setSelectedId} />
                ))}
              </div>
            )}

            {/* Scroll affordance */}
            <div
              className={cn(
                'pointer-events-none sticky bottom-0 left-0 right-0 flex h-32 items-end justify-center bg-gradient-to-t from-[#F7F7FB] via-[#F7F7FB]/80 to-transparent pb-6 transition-opacity duration-300',
                showScrollDown && status === 'ready' && filtered.length > 4 ? 'opacity-100' : 'opacity-0',
              )}
            >
              <button
                onClick={scrollDown}
                className="pointer-events-auto flex items-center gap-2 rounded-full bg-[#E66000] px-4 py-2.5 text-[12px] font-medium text-white shadow-lg transition hover:bg-[#CC5500]"
              >
                Gulir ke bawah <ArrowDown className="size-4" />
              </button>
            </div>
          </div>

          {/* ── Right: filters ───────────────────────────────────────── */}
          <div className="sticky top-0 flex h-fit max-h-full shrink-0 flex-col overflow-y-auto rounded-lg bg-white ring-1 ring-[#ECECF2] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-[#FFF3EB] to-[#FFC79A] p-5">
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Filter className="size-5 text-[#FF6B00]" />
                  <h2 className="font-heading text-[20px] font-bold leading-[27px] text-[#4A4A4A]">Filter</h2>
                  {activeFilterCount > 0 && (
                    <span className="rounded-full bg-[#FF6B00] px-2 py-0.5 text-[11px] font-bold text-white">{activeFilterCount}</span>
                  )}
                </div>
                <button
                  onClick={resetFilters}
                  disabled={activeFilterCount === 0}
                  className="text-sm font-normal text-[#FF6B00] font-sans hover:underline disabled:opacity-40 disabled:hover:no-underline"
                >
                  Reset
                </button>
              </div>
              <p className="relative z-10 mt-2 text-[13px] leading-[21px] text-[#8A8A98] font-sans">
                Saring lowongan berdasarkan lokasi dan perusahaan.
              </p>
            </div>

            <div className="space-y-6 p-6">
              {facets.locations.length > 0 && (
                <FilterSection
                  title="LOKASI"
                  items={facets.locations}
                  counts={facets.locationCounts}
                  selected={locSel}
                  onToggle={toggle(setLocSel)}
                  hasSearch
                  searchPlaceholder="Cari lokasi"
                />
              )}
              {facets.companies.length > 0 && (
                <FilterSection
                  title="PERUSAHAAN"
                  items={facets.companies}
                  counts={facets.companyCounts}
                  selected={companySel}
                  onToggle={toggle(setCompanySel)}
                  hasSearch
                  searchPlaceholder="Cari perusahaan"
                />
              )}

              {status === 'ready' && !hasJobs && (
                <p className="rounded-lg bg-[#FAFAFC] p-4 text-center text-[13px] leading-5 text-[#8A8A98]">
                  Filter akan muncul setelah ada lowongan di database.
                </p>
              )}
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}
