'use client'

import { Bell, LayoutGrid, Sparkles, Briefcase, Binoculars, Map, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useDashboardView } from './dashboard-view'

const SECTION_LABELS: Record<string, string> = {
  '/job-seeker': 'Dashboard',
  '/job-seeker/personality': 'Psikometri Hasil Sakti',
  '/job-seeker/job-matches': 'Career Forecast',
  '/job-seeker/job-matches/explore': 'Cari Lowongan',
  '/job-seeker/learning-paths': 'Roadmap Belajar',
}

export function DashboardTopBar() {
  const pathname = usePathname()
  const { view, setView, jobMatchesDetailName, setJobMatchesDetailId, setJobMatchesDetailName } = useDashboardView()
  const isHome = pathname === '/job-seeker'
  const isJobMatchesBase = pathname === '/job-seeker/job-matches'
  const isJobMatchesExplore = pathname === '/job-seeker/job-matches/explore'
  const isJobMatches = isJobMatchesBase || isJobMatchesExplore
  const isLearningPathsBase = pathname === '/job-seeker/learning-paths'
  const isExploreRoadmap = pathname === '/job-seeker/learning-paths/explore'
  const isRoadmapDetail = pathname.startsWith('/job-seeker/learning-paths/') && pathname.endsWith('/roadmap')
  const isLearningPaths = isLearningPathsBase || isRoadmapDetail
  
  const section = SECTION_LABELS[pathname] ?? (isExploreRoadmap ? 'Cari Materi' : isRoadmapDetail ? 'Detail Roadmap' : 'Dashboard')

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-[#ECECF2] bg-[#F7F7FA] px-5 sm:px-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
        <span className="text-[#9A9AAB]">Overview</span>
        <span className="text-[#C7C7D2]">/</span>
        
        {isRoadmapDetail ? (
          <>
            <Link 
              href="/job-seeker/learning-paths"
              className="text-[#9A9AAB] hover:text-[#26262F] font-semibold transition"
            >
              Roadmap Belajar
            </Link>
            <span className="text-[#C7C7D2]">/</span>
            <span className="font-semibold text-[#26262F]">Detail Roadmap</span>
          </>
        ) : isJobMatchesBase && jobMatchesDetailName ? (
          <>
            <button 
              type="button" 
              onClick={() => {
                setJobMatchesDetailId(undefined)
                setJobMatchesDetailName(undefined)
              }}
              className="text-[#9A9AAB] hover:text-[#26262F] font-semibold transition"
            >
              {section}
            </button>
            <span className="text-[#C7C7D2]">/</span>
            <span className="font-semibold text-[#26262F]">{jobMatchesDetailName}</span>
          </>
        ) : (
          <span className="font-semibold text-[#26262F]">{section}</span>
        )}
      </nav>

      <div className="flex items-center gap-3">
        {isHome && (
          <div className="flex items-center gap-1 rounded-lg bg-[#EFEEFF] p-1">
            <button
              type="button"
              onClick={() => setView('summary')}
              aria-pressed={view === 'summary'}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors',
                view === 'summary'
                  ? 'bg-white text-[#4138D8] shadow-sm'
                  : 'text-[#6E6E86] hover:text-[#4138D8]',
              )}
            >
              <LayoutGrid className="size-4" />
              Rangkuman
            </button>
            <button
              type="button"
              onClick={() => setView('psikometri')}
              aria-pressed={view === 'psikometri'}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors',
                view === 'psikometri'
                  ? 'bg-white text-[#4138D8] shadow-sm'
                  : 'text-[#6E6E86] hover:text-[#4138D8]',
              )}
            >
              <Sparkles className="size-4" />
              Psikometri
            </button>
          </div>
        )}

        {isJobMatches && (
          <div className="flex items-center gap-1 rounded-lg bg-[#EFEEFF] p-1">
            <Link
              href="/job-seeker/job-matches"
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] transition-colors',
                isJobMatchesBase
                  ? 'bg-white font-semibold text-[#FF6B00] shadow-sm'
                  : 'font-medium text-[#6E6E86] hover:text-[#302D37]',
              )}
            >
              <Briefcase className="size-4" />
              Potensi Karir
            </Link>
            <Link
              href="/job-seeker/job-matches/explore"
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] transition-colors',
                isJobMatchesExplore
                  ? 'bg-white font-semibold text-[#FF6B00] shadow-sm'
                  : 'font-medium text-[#6E6E86] hover:text-[#302D37]',
              )}
            >
              <Binoculars className="size-4" />
              Cari Lowongan
            </Link>
          </div>
        )}

        {(isLearningPaths || isExploreRoadmap) && (
          <div className="flex items-center gap-1 rounded-lg bg-[#EFEEFF] p-1">
            <Link
              href="/job-seeker/learning-paths"
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors',
                isLearningPaths
                  ? 'bg-white text-[#4138D8] shadow-sm'
                  : 'text-[#6E6E86] hover:text-[#4138D8]'
              )}
            >
              <Map className="size-4" />
              Roadmap Belajarmu
            </Link>
            <Link
              href="/job-seeker/learning-paths/explore"
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors',
                isExploreRoadmap
                  ? 'bg-white text-[#4138D8] shadow-sm'
                  : 'text-[#6E6E86] hover:text-[#4138D8]'
              )}
            >
              <Search className="size-4" />
              Cari Materi
            </Link>
          </div>
        )}

        <button
          type="button"
          aria-label="Notifikasi"
          title="Notifikasi"
          className="relative flex size-9 items-center justify-center rounded-lg border border-[#E4E3F0] bg-white text-[#6E6E86] transition-colors hover:border-[#CFC8FF] hover:text-[#4138D8]"
        >
          <Bell className="size-4" />
          <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-rose-500" />
        </button>
      </div>
    </header>
  )
}
