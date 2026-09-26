'use client'

import {
  Globe,
  Search,
  Loader2,
  Play,
  BookOpen,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Monitor,
  Briefcase,
  Megaphone,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { seekerApi } from '@/api/seeker.api'
import { useDashboard } from '@/features/dashboard/use-dashboard'
import { DashboardLoading, DashboardError } from '@/components/dashboard/dashboard-status'
import type { RoleCatalogCategory, RoleCatalogItem } from '@/types/career-pipeline.types'
import { handleApiError } from '@/utils/api-error'

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORIES: { key: RoleCatalogCategory | 'Semua'; label: string; Icon: React.ElementType }[] = [
  { key: 'Semua', label: 'Semua Role', Icon: Globe },
  { key: 'IT', label: 'Teknologi (IT)', Icon: Monitor },
  { key: 'Bisnis', label: 'Bisnis', Icon: Briefcase },
  { key: 'Marketing', label: 'Marketing', Icon: Megaphone },
]

function getCategoryIcon(category: RoleCatalogCategory | 'Semua', className?: string) {
  const IconComponent = CATEGORIES.find(c => c.key === category)?.Icon || Globe
  return <IconComponent className={className} strokeWidth={2} />
}

// ─── Role Card ────────────────────────────────────────────────────────────────

function RoleCard({
  role,
  onSelect,
  isSelected,
}: {
  role: RoleCatalogItem
  onSelect: (role: RoleCatalogItem) => void
  isSelected: boolean
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(role)}
      className={cn(
        'group w-full text-left rounded-lg ring-1 bg-white p-4 transition-all duration-150',
        isSelected
          ? 'ring-[#045DEF] shadow-md shadow-blue-100'
          : 'ring-[#ECECF2] hover:ring-[#045DEF]/40 hover:shadow-sm',
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0 text-[#045DEF] bg-[#EFF6FE] p-2 rounded-lg">
          {getCategoryIcon(role.category, "size-5")}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                'text-[11px] font-semibold rounded-md px-2 py-0.5',
                role.category === 'IT'
                  ? 'bg-blue-50 text-blue-700'
                  : role.category === 'Bisnis'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-purple-50 text-purple-700',
              )}
            >
              {role.category}
            </span>
            <span className="text-[11px] text-[#9A9AAB] bg-[#F7F7FB] px-2 py-0.5 rounded-md">
              {role.roleLevel}
            </span>
          </div>
          <p
            className={cn(
              'mt-1 text-[15px] font-bold leading-tight transition-colors',
              isSelected ? 'text-[#045DEF]' : 'text-[#26262F] group-hover:text-[#045DEF]',
            )}
          >
            {role.roleName}
          </p>
          {role.description && (
            <p className="mt-1 text-[12px] text-[#8A8A98] line-clamp-2">{role.description}</p>
          )}
          {role.keySkills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {role.keySkills.slice(0, 3).map((s) => (
                <span key={s} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                  {s}
                </span>
              ))}
              {role.keySkills.length > 3 && (
                <span className="text-[10px] text-gray-400">+{role.keySkills.length - 3}</span>
              )}
            </div>
          )}
        </div>
        <ChevronRight
          className={cn(
            'size-4 shrink-0 mt-1 transition-colors',
            isSelected ? 'text-[#045DEF]' : 'text-[#C7C7D2] group-hover:text-[#045DEF]',
          )}
        />
      </div>
    </button>
  )
}

// ─── Preview Panel ────────────────────────────────────────────────────────────

function RolePreviewPanel({
  role,
  sessionId,
}: {
  role: RoleCatalogItem | null
  sessionId: string | null
}) {
  if (!role) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 gap-4 text-center">
        <Globe className="size-12 text-[#C7C7D2]" />
        <p className="text-[#9A9AAB] text-sm max-w-[220px]">
          Pilih role dari daftar untuk melihat detail dan generate roadmap belajar
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto [&::-webkit-scrollbar]:hidden">
      {/* Header */}
      <div className="relative rounded-t-lg overflow-hidden bg-gradient-to-br from-[#045DEF] to-[#0047C8] p-5 text-white shrink-0">
        <Image
          src="/logo-dash.png"
          alt=""
          width={160}
          height={200}
          className="pointer-events-none absolute right-0 top-0 h-full w-auto max-w-[180px] object-contain object-right select-none opacity-60"
        />
        <div className="relative z-10 max-w-[calc(100%-120px)]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold bg-white/20 rounded-md px-2 py-0.5">
              {role.category}
            </span>
            <span className="text-[11px] bg-white/10 rounded-md px-2 py-0.5 text-white/80">
              {role.roleLevel}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="text-white/90 bg-white/10 p-2.5 rounded-xl shrink-0">
              {getCategoryIcon(role.category, "size-7")}
            </div>
            <h2 className="font-heading text-[20px] font-bold leading-tight">{role.roleName}</h2>
          </div>
          {role.description && (
            <p className="mt-2 text-[13px] text-white/80 line-clamp-3">{role.description}</p>
          )}
        </div>
      </div>

      {/* Key Skills */}
      <div className="bg-white px-5 py-4 border-b border-[#ECECF2]">
        <h3 className="text-[13px] font-bold text-[#4A4A4A] mb-3">Skill Kunci</h3>
        <div className="flex flex-wrap gap-2">
          {role.keySkills.map((skill) => (
            <span
              key={skill}
              className="rounded-lg bg-blue-50 px-2.5 py-1 text-[12px] font-medium text-[#045DEF]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      {sessionId ? (
        <div className="bg-white px-5 py-5 flex flex-col gap-3">
          <Link
            href={`/job-seeker/learning-paths/catalog/${encodeURIComponent(role.roleSlug)}/roadmap`}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#045DEF] px-4 py-3 text-[14px] font-semibold text-white transition hover:bg-[#0047C8]"
          >
            <Play className="size-4 fill-white" /> Generate Roadmap Belajar
          </Link>
          <p className="text-center text-[11px] text-[#9A9AAB]">
            Sakti AI akan membuat roadmap personal berdasarkan profil Anda
          </p>
        </div>
      ) : (
        <div className="bg-white px-5 py-5">
          <p className="text-sm text-[#9A9AAB] text-center">
            Selesaikan onboarding untuk generate roadmap
          </p>
        </div>
      )}

      {/* Learning areas preview */}
      <div className="bg-white px-5 pb-5 flex-1">
        <h3 className="text-[13px] font-bold text-[#4A4A4A] mb-3 flex items-center gap-2">
          <BookOpen className="size-4 text-[#045DEF]" /> Yang Akan Dipelajari
        </h3>
        <div className="space-y-2">
          {[
            'Dasar-dasar dan konsep fundamental',
            'Skill teknis dan tools utama',
            'Project & portfolio building',
            'Soft skills dan cara kerja profesional',
            'Persiapan karir dan interview',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="size-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-[#045DEF]">{i + 1}</span>
              </div>
              <span className="text-[13px] text-[#4A4A4A]">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CatalogPage() {
  const dashboardState = useDashboard()

  const [roles, setRoles] = useState<RoleCatalogItem[]>([])
  const [loadingRoles, setLoadingRoles] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<RoleCatalogCategory | 'Semua'>('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState<RoleCatalogItem | null>(null)

  const sessionId =
    dashboardState.status === 'ready' ? (dashboardState.session?.onboarding_session_id ?? null) : null

  const fetchRoles = useCallback(async () => {
    setLoadingRoles(true)
    try {
      const res = await seekerApi.getRoleCatalog(
        selectedCategory === 'Semua' ? undefined : selectedCategory,
      )
      setRoles(res.data.data)
    } catch (err) {
      handleApiError(err)
    } finally {
      setLoadingRoles(false)
    }
  }, [selectedCategory])

  useEffect(() => {
    void fetchRoles()
    setSelectedRole(null)
  }, [fetchRoles])

  if (dashboardState.status === 'loading') return <DashboardLoading />
  if (dashboardState.status === 'error') return <DashboardError />

  const filteredRoles = searchQuery.trim()
    ? roles.filter(
        (r) =>
          r.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.keySkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : roles

  const groupedByCategory = CATEGORIES.slice(1).reduce<Record<string, RoleCatalogItem[]>>(
    (acc, cat) => {
      acc[cat.key] = filteredRoles.filter((r) => r.category === cat.key)
      return acc
    },
    {},
  )

  return (
    <div className="flex h-[calc(100vh-76px)] flex-col bg-[#F7F7FB]">
      <div className="mx-auto flex h-full w-full max-w-[1500px] flex-col px-4 py-3 sm:px-6 sm:py-4">
        <div className="grid min-h-0 flex-1 items-start gap-6 xl:grid-cols-[1fr_320px]">
          {/* ── Left: Role list ─────────────────────────────────────────────── */}
          <div className="relative flex h-full flex-col gap-5 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Hero banner */}
            <section className="relative shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-[#045DEF] to-[#0047C8] p-5 text-white sm:p-6">
              <Image
                src="/logo-dash.png"
                alt=""
                width={200}
                height={260}
                className="pointer-events-none absolute right-0 top-0 h-full w-auto max-w-[220px] object-contain object-right select-none opacity-70"
              />
              <div className="relative z-10 max-w-lg">
                <p className="text-xs font-medium text-white/70">Katalog Role & Roadmap Belajar</p>
                <h1 className="mt-1 font-heading text-[22px] sm:text-[26px] font-bold leading-tight">
                  Jelajahi Semua Role Karir
                </h1>
                <p className="mt-1.5 text-[13px] text-white/80 max-w-md">
                  Temukan role yang menarik minatmu — IT, Bisnis, atau Marketing — dan biarkan Sakti AI membuatkan roadmap belajar personal untukmu, bahkan untuk role yang bukan match-mu.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <Sparkles className="size-4 text-yellow-300" />
                  <span className="text-[13px] font-medium text-white/90">
                    {roles.length} role tersedia
                  </span>
                </div>
              </div>
            </section>

            {/* Search + Category filters */}
            <div className="shrink-0 bg-white rounded-lg ring-1 ring-[#ECECF2] p-4 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#9A9AAB]" />
                <input
                  type="text"
                  placeholder="Cari role, skill, atau deskripsi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-[#ECECF2] bg-[#F7F7FB] pl-9 pr-3 py-2 text-[13px] text-[#26262F] placeholder:text-[#9A9AAB] focus:outline-none focus:ring-2 focus:ring-[#045DEF]/30 focus:border-[#045DEF]/50"
                />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setSelectedCategory(cat.key)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-medium transition-all',
                      selectedCategory === cat.key
                        ? 'bg-[#045DEF] text-white shadow-sm'
                        : 'bg-[#F7F7FB] text-[#6E6E86] hover:bg-blue-50 hover:text-[#045DEF]',
                    )}
                  >
                    <cat.Icon className="size-4" /> <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Role grid */}
            {loadingRoles ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="size-8 animate-spin text-[#045DEF]/40" />
              </div>
            ) : filteredRoles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Globe className="size-10 text-[#C7C7D2]" />
                <p className="text-sm text-[#9A9AAB]">Tidak ada role yang cocok dengan pencarianmu</p>
              </div>
            ) : selectedCategory === 'Semua' ? (
              // Grouped view
              <div className="flex flex-col gap-6 pb-12">
                {CATEGORIES.slice(1).map((cat) => {
                  const catRoles = groupedByCategory[cat.key] ?? []
                  if (catRoles.length === 0) return null
                  return (
                    <div key={cat.key}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="text-[#045DEF] bg-[#EFF6FE] p-1.5 rounded-md">
                          <cat.Icon className="size-5" />
                        </div>
                        <h2 className="font-heading text-[17px] font-bold text-[#26262F]">{cat.label}</h2>
                        <span className="text-[12px] text-[#9A9AAB] bg-[#F7F7FB] rounded-md px-2 py-0.5 font-medium">
                          {catRoles.length} role
                        </span>
                      </div>
                      <div className="grid gap-2.5 sm:grid-cols-2">
                        {catRoles.map((role) => (
                          <RoleCard
                            key={role.roleSlug}
                            role={role}
                            onSelect={setSelectedRole}
                            isSelected={selectedRole?.roleSlug === role.roleSlug}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              // Flat grid for single category
              <div className="grid gap-2.5 sm:grid-cols-2 pb-12">
                {filteredRoles.map((role) => (
                  <RoleCard
                    key={role.roleSlug}
                    role={role}
                    onSelect={setSelectedRole}
                    isSelected={selectedRole?.roleSlug === role.roleSlug}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Preview panel ─────────────────────────────────────────── */}
          <div className="sticky top-0 flex h-fit max-h-full shrink-0 flex-col overflow-y-auto rounded-lg bg-white ring-1 ring-[#ECECF2] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {selectedRole ? (
              <RolePreviewPanel role={selectedRole} sessionId={sessionId} />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-6 gap-4 text-center">
                <div className="size-16 rounded-full bg-blue-50 flex items-center justify-center">
                  <Globe className="size-8 text-[#045DEF]/50" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-[#4A4A4A]">Pilih sebuah role</p>
                  <p className="mt-1 text-[13px] text-[#9A9AAB]">
                    Klik salah satu role di sebelah kiri untuk melihat detail dan generate roadmap belajarnya
                  </p>
                </div>
                <ArrowRight className="size-5 text-[#C7C7D2] rotate-180 xl:rotate-0" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
