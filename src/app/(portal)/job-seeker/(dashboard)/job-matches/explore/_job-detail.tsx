'use client'

import {
  ArrowLeft,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  FileText,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { MathCurveLoader } from '@/components/ui/math-curve-loader'
import { seekerApi } from '@/api/seeker.api'
import type { JobSalary, JobPostingDetail, RelatedJob } from '@/types/career-pipeline.types'

// ─── Field formatters ─────────────────────────────────────────────────────────

function salaryLabel(salary: JobSalary): string | null {
  if (!salary.disclosed || salary.min == null || salary.max == null) return null
  const jt = (n: number) => Math.round(n / 1_000_000)
  return `Rp ${jt(salary.min)}–${jt(salary.max)} jt/bln`
}

function workLabel(work: string | null): string | null {
  if (work === 'remote') return 'Remote'
  if (work === 'hybrid') return 'Hybrid'
  if (work === 'onsite') return 'On-site'
  return null
}

function employmentLabel(type: string | null): string {
  const map: Record<string, string> = {
    full_time: 'Full time',
    part_time: 'Part time',
    contract: 'Kontrak',
    internship: 'Magang',
    freelance: 'Freelance',
  }
  return type ? (map[type] ?? type) : '—'
}

function scopeLabel(scope: string | null): string {
  if (scope === 'domestic') return 'Lowongan dalam negeri'
  if (scope === 'international') return 'Lowongan luar negeri'
  return '—'
}

function genderLabel(gender: string | null): string {
  if (gender === 'male') return 'Laki-laki'
  if (gender === 'female') return 'Perempuan'
  return 'Laki-laki / Perempuan'
}

function metaLine(parts: (string | null | undefined)[]): string {
  return parts.filter(Boolean).join(' · ')
}

// ─── Accordion section ────────────────────────────────────────────────────────

function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border-t border-[#FFD9C4]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 py-4 text-left"
      >
        <h3 className="font-heading text-[17px] font-base text-[#20202A]">{title}</h3>
        {open ? (
          <ChevronDown className="size-5 shrink-0 text-[#FF6B00]" />
        ) : (
          <ChevronRight className="size-5 shrink-0 text-[#B9B9C6]" />
        )}
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  )
}

// ─── Related job row ──────────────────────────────────────────────────────────

function RelatedRow({ job, onSelect }: { job: RelatedJob; onSelect: (id: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(job.id)}
      className="group block w-full border-b border-[#F1E7DE] px-5 py-4 text-left transition last:border-0 hover:bg-[#FFF1E7]"
    >
      <h4 className="line-clamp-1 text-[15px] font-bold text-[#26262F] transition-colors group-hover:text-[#FF6B00]">
        {job.title}
      </h4>
      <p className="mt-1 text-[12px] text-[#8A8A98]">
        {metaLine([job.company, salaryLabel(job.salary), workLabel(job.work_arrangement)])}
      </p>
      <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-[#8A8A98]">{job.blurb}</p>
    </button>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function JobDetail({
  jobId,
  onBack,
  onSelect,
}: {
  jobId: string
  onBack: () => void
  onSelect: (id: string) => void
}) {
  // The parent keys this component on the selected id, so it remounts (and all
  // of this state resets) whenever a different job is opened.
  const [detail, setDetail] = useState<JobPostingDetail | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [openSec, setOpenSec] = useState<'desc' | 'kualifikasi' | 'tambahan' | ''>('desc')
  const [descExpanded, setDescExpanded] = useState(false)

  useEffect(() => {
    let alive = true
    seekerApi
      .getJobPosting(jobId)
      .then((res) => {
        if (!alive) return
        setDetail(res.data.data)
        setStatus('ready')
      })
      .catch(() => {
        if (alive) setStatus('error')
      })
    return () => {
      alive = false
    }
  }, [jobId])

  if (status === 'loading') {
    return (
      <div className="flex h-full items-center justify-center">
        <MathCurveLoader size={40} label="Memuat detail lowongan…" />
      </div>
    )
  }

  if (status === 'error' || !detail) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm text-[#8A8A98]">Detail lowongan tidak bisa dimuat.</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#FFD9C4] bg-[#FFF5F0] px-4 py-2 text-sm font-medium text-[#FF6B00] transition hover:bg-[#FFE5D5]"
        >
          <ArrowLeft className="size-4" /> Kembali
        </button>
      </div>
    )
  }

  const salary = detail.salary.disclosed ? (salaryLabel(detail.salary) ?? 'Dirahasiakan') : 'Dirahasiakan'
  const descLong = (detail.description ?? '').length > 280

  return (
    <div className="grid h-full min-h-0 gap-6 xl:grid-cols-[1fr_390px]">
      {/* ── Left: the posting (no card chrome — sits on the page bg) ──── */}
      <div className="flex h-full min-h-0 flex-col overflow-y-auto pb-8 pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 self-start text-[13px] font-medium text-[#8A8A98] transition hover:text-[#FF6B00]"
        >
          <ArrowLeft className="size-4" /> Kembali
        </button>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-[22px] font-bold leading-[1.2] tracking-[-0.01em] text-[#20202A] sm:text-[26px]">
              {detail.title}
            </h1>

            <p className="mt-1.5 text-[13px] text-[#8A8A98]">
              {metaLine([detail.company, salary, workLabel(detail.work_arrangement)])}
            </p>

            {detail.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {detail.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-[#FFEBDF] px-2.5 py-1 text-[12px] font-semibold text-[#D54C00]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex shrink-0 flex-col items-end gap-3">
            {detail.match.score != null && (
              <div className="rounded-xl bg-[#FFE0CC] px-4 py-2.5 text-center min-w-[68px]">
                <p className="text-[18px] font-bold leading-none text-[#D54C00]">
                  {Math.round(detail.match.score)}%
                </p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/70">
                  <div
                    className="h-full rounded-full bg-[#10B981]"
                    style={{ width: `${Math.min(100, Math.max(0, detail.match.score))}%` }}
                  />
                </div>
              </div>
            )}
            <a
              href={detail.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#FF6B00] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#E66000]"
            >
              <ArrowUpRight className="size-4" /> Lamar Kerja
            </a>
          </div>
        </div>

        {/* Info grid */}
        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
          {(
            [
              ['Bidang pekerjaan', detail.job_field ?? '—'],
              ['Jenis pekerjaan', employmentLabel(detail.employment_type)],
              ['Tipe pekerjaan', scopeLabel(detail.posting_scope)],
              ['Jenis kelamin', genderLabel(detail.gender_requirement)],
              ['Rentang gaji', salary],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="pl-3">
              <p className="text-[12px] text-[#8A8A98]">{label}</p>
              <p className="mt-0.5 text-[14px] font-semibold text-[#20202A]">{value}</p>
            </div>
          ))}
        </div>

        {/* Accordion */}
        <div className="mt-6">
          <Section
            title="Deskripsi Posisi Pekerjaan"
            open={openSec === 'desc'}
            onToggle={() => setOpenSec(openSec === 'desc' ? '' : 'desc')}
          >
            {detail.description ? (
              <div className="relative">
                <p
                  className={cn(
                    'whitespace-pre-line text-justify text-[14px] leading-6 text-[#5C5C6A]',
                    !descExpanded && descLong && 'line-clamp-[6]',
                  )}
                >
                  {detail.description}
                </p>
                {descLong && (
                  <button
                    type="button"
                    onClick={() => setDescExpanded((v) => !v)}
                    className="mt-2 text-[13px] font-bold text-[#FF6B00] hover:underline"
                  >
                    {descExpanded ? 'Tutup' : 'Baca Selengkapnya'}
                  </button>
                )}
              </div>
            ) : (
              <p className="text-[14px] leading-6 text-[#8A8A98]">
                Deskripsi posisi belum tersedia untuk lowongan ini.
              </p>
            )}
          </Section>

          <Section
            title="Kualifikasi Pekerjaan"
            open={openSec === 'kualifikasi'}
            onToggle={() => setOpenSec(openSec === 'kualifikasi' ? '' : 'kualifikasi')}
          >
            {detail.qualifications.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {detail.qualifications.map((q, i) => (
                  <li key={i} className="flex gap-2.5 text-[14px] leading-6 text-[#5C5C6A]">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#FF6B00]" />
                    {q}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[14px] leading-6 text-[#8A8A98]">
                Belum ada rincian kualifikasi untuk lowongan ini.
              </p>
            )}
          </Section>

          <Section
            title="Informasi Tambahan"
            open={openSec === 'tambahan'}
            onToggle={() => setOpenSec(openSec === 'tambahan' ? '' : 'tambahan')}
          >
            <p className="whitespace-pre-line text-[14px] leading-6 text-[#8A8A98]">
              {detail.additional_info ?? 'Tidak ada informasi tambahan.'}
            </p>
          </Section>
        </div>
      </div>

      {/* ── Right: related jobs ───────────────────────────────────────── */}
      <aside className="flex h-full min-h-0 flex-col overflow-y-auto rounded-lg bg-[#FBFAF8] ring-1 ring-[#F1E7DE] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="border-b border-[#F1E7DE] px-5 py-4">
          <h2 className="font-heading text-[18px] font-bold text-[#20202A]">Pekerjaan yang Relevan</h2>
        </div>
        {detail.related.length > 0 ? (
          detail.related.map((job) => (
            <RelatedRow key={job.id} job={job} onSelect={onSelect} />
          ))
        ) : (
          <p className="px-5 pb-5 text-[13px] leading-5 text-[#8A8A98]">
            Belum ada lowongan lain untuk ditampilkan.
          </p>
        )}
      </aside>
    </div>
  )
}
