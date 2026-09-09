'use client'

import {
  AlertCircle,
  ArrowRight,
  ArrowDown,
  Bell,
  Binoculars,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Map,
  Paperclip,
  Play,
  PlayCircle,
  RotateCw,
  Search,
  Send,
  Signal,
  Video,
  Waypoints,
  Filter,
  Zap,
  Notebook,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import {
  DashboardError,
  DashboardLoading,
} from '@/components/dashboard/dashboard-status'
import { AITurnTrail } from '@/components/career-pipeline/ai-turn-trail'
import { MathCurveLoader } from '@/components/ui/math-curve-loader'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCareerPipeline } from '@/features/career-pipeline/use-career-pipeline'
import { useDashboard } from '@/features/dashboard/use-dashboard'
import { useDashboardView } from '@/components/dashboard/dashboard-view'
import { cn } from '@/lib/utils'
import type {
  CareerCandidateRole,
  CareerMatchResult,
  CareerMatchScore,
  CareerSkillGap,
  JobMatcherResult,
  TalentForgerResult,
  CareerJobPosting,
} from '@/types/career-pipeline.types'

const mockRankedMatches: CareerMatchResult[] = [
  {
    match_id: 'm1',
    user_id: 'u1',
    role_id: 'r1',
    role_name: 'Lead Technical Architect: Core Banking & FDS',
    total_match_score: 95,
    match_reason: 'Pengalamanmu dalam memimpin tim dan merancang sistem Core Banking dan FDS sangat relevan dengan kebutuhan peran ini.',
    created_at: new Date().toISOString()
  },
  {
    match_id: 'm2',
    user_id: 'u1',
    role_id: 'r2',
    role_name: 'Senior Backend Engineer',
    total_match_score: 88,
    match_reason: 'Kemampuanmu dalam arsitektur microservices dan integrasi API sangat cocok untuk meningkatkan performa sistem backend kami.',
    created_at: new Date().toISOString()
  },
  {
    match_id: 'm3',
    user_id: 'u1',
    role_id: 'r3',
    role_name: 'System Analyst',
    total_match_score: 82,
    match_reason: 'Pemahamanmu mengenai proses perbankan dan analisa kebutuhan sistem dapat membantu dalam menyusun spesifikasi teknis yang tepat.',
    created_at: new Date().toISOString()
  },
  {
    match_id: 'm4',
    user_id: 'u1',
    role_id: 'r4',
    role_name: 'DevOps Engineer',
    total_match_score: 75,
    match_reason: 'Keterampilanmu dalam CI/CD dan pengelolaan infrastruktur Cloud sangat sesuai dengan operasional modern.',
    created_at: new Date().toISOString()
  },
  {
    match_id: 'm5',
    user_id: 'u1',
    role_id: 'r5',
    role_name: 'Full Stack Developer',
    total_match_score: 70,
    match_reason: 'Kombinasi pengalaman frontend dan backend kamu menjadikanmu kandidat yang fleksibel.',
    created_at: new Date().toISOString()
  }
]

const mockJobs: CareerJobPosting[] = [
  {
    title: 'Lead Technical Architect: Core Banking & FDS',
    company: 'MateCareer',
    location: 'Hybrid',
    url: '#job1'
  },
  {
    title: 'Senior Backend Engineer',
    company: 'TechCorp',
    location: 'Remote',
    url: '#job2'
  },
  {
    title: 'System Analyst',
    company: 'Bank ABC',
    location: 'Jakarta',
    url: '#job3'
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudNesia',
    location: 'Bandung',
    url: '#job4'
  },
  {
    title: 'Full Stack Developer',
    company: 'Startup XYZ',
    location: 'Surabaya',
    url: '#job5'
  }
]

export default function ExploreRoadmapPage() {
  const { jobMatchesDetailId, setJobMatchesDetailId, setJobMatchesDetailName } = useDashboardView()
  const selectedId = jobMatchesDetailId ?? ''
  const setSelectedId = (id: string) => setJobMatchesDetailId(id || undefined)

  const rankedMatches = mockRankedMatches.sort(
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

  // Mock data untuk detail
  const selectedScore = { match_id: selectedId, component_scores: {}, strengths: [], improvements: [] } as any
  const selectedGaps: CareerSkillGap[] = []
  const selectedCandidateRole = { role_id: selectedMatch?.role_id, description: '', requirements: [] } as any
  const learningResult = null

  return (
    <div className="flex h-[calc(100vh-76px)] flex-col bg-[#F7F7FB]">
      <div className="flex flex-col h-full max-w-[1500px] w-full mx-auto px-4 py-3 sm:px-6 sm:py-4">



        <div className="flex-1 min-h-0 grid gap-5 xl:grid-cols-[1fr_1fr]">
          {selectedMatch ? (
            <div className="xl:col-span-2 flex min-h-0 h-full rounded-lg border-[0.1px] border-[#FFD9C4] overflow-hidden bg-white">
              <div className="flex-1 min-w-0 overflow-y-auto custom-scrollbar">
                <DetailLeftColumn role={selectedMatch} score={selectedScore} gaps={selectedGaps} candidateRole={selectedCandidateRole} />
              </div>
              <div className="w-px bg-[#FFD9C4] shrink-0" />
              <div className="flex-1 min-w-0 overflow-y-auto custom-scrollbar">
                <DetailRightColumn jobs={mockJobs} learningResult={learningResult} />
              </div>
            </div>
          ) : (
            <div className="xl:col-span-2 flex min-h-0 h-full">
              <CareerForecastOverview onSelect={setSelectedId} />
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #E6E2EE; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #CFC7F5; }
      `}} />
    </div>
  )
}

const MOCK_EXPLORE_ROADMAPS = Array.from({ length: 50 }).map((_, i) => {
  const titles = [
    'Lead Technical Architect: Core Banking & FDS',
    'Applied AI Researcher',
    'Cloud Solutions Architect',
    'Lead Data Engineer',
    'Full-Stack Developer: Modern Web Apps',
    'UI/UX Design Lead',
    'Product Management for Tech',
    'Cybersecurity Operations Specialist',
    'Blockchain Smart Contract Engineer',
    'DevOps CI/CD Pipeline Expert'
  ]
  const title = titles[i % titles.length] + (i >= 10 ? ` Part ${Math.floor(i / 10) + 1}` : '')
  const authors = ['Budi Santoso', 'Siti Aminah', 'Rudi Heryanto', 'Dewi Lestari', 'Agus Setiawan']
  const categories = ['Web Development', 'Data Science', 'Cloud Computing', 'Security', 'Design']

  return {
    id: `explore-roadmap-${i}`,
    title,
    author: `Dibuat oleh ${authors[i % authors.length]}`,
    category: categories[i % categories.length],
    level: i % 3 === 0 ? 'Tingkat Menengah' : i % 2 === 0 ? 'Tingkat Lanjut' : 'Tingkat Dasar',
    match_reason: 'Cocok karena keahlian Python, SQL, dan pengalaman FastAPI + Next.js kamu match dengan roadmap ini.',
    pct: 75 + (i % 25),
    time: `Diposting ${i % 24 + 1} jam lalu`
  }
})

function FilterSection({
  title,
  items,
  hasSearch = false,
  searchPlaceholder = ""
}: {
  title: string;
  items: string[];
  hasSearch?: boolean;
  searchPlaceholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [query, setQuery] = useState('')

  const filteredItems = items.filter(item => item.toLowerCase().includes(query.toLowerCase()))
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
              <input type="text" placeholder={searchPlaceholder} value={query} onChange={e => setQuery(e.target.value)} className="w-full text-[13px] text-[#65564A] placeholder-[#AFA499] font-sans bg-transparent outline-none" />
            </div>
          )}
          <div className={`flex flex-col gap-2 ${isExpanded ? 'max-h-[200px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]' : ''}`}>
            {displayItems.map(cat => (
              <label key={cat} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
                <div className="relative size-[22px] shrink-0">
                  <div className="absolute inset-0 m-0.5 rounded border-[1.6px] border-[#A4A4A4] group-hover:border-[#0272FF] transition-colors" />
                </div>
                <span className="text-[14px] text-[#3B361E] font-sans">{cat}</span>
              </label>
            ))}
            {!isExpanded && filteredItems.length > 5 && (
              <button onClick={() => setIsExpanded(true)} className="text-[14px] text-[#777777] font-sans text-left mt-0.5 hover:text-[#0272FF]">
                {title.toLowerCase()} lainnya...
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function CareerForecastOverview({ onSelect }: { onSelect: (id: string) => void }) {
  const [query, setQuery] = useState('')
  const [showScrollDown, setShowScrollDown] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop > 50 || scrollTop + clientHeight >= scrollHeight - 10) {
        setShowScrollDown(false)
      } else {
        setShowScrollDown(true)
      }
    }
  }

  const scrollDown = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ top: 400, behavior: 'smooth' })
      setShowScrollDown(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_303px] min-h-0 h-full items-start w-full">
      {/* Left Content Area (Scrollable) */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex flex-col gap-6 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pr-2 relative"
      >
        {/* Top Banner */}
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-[#0463FE] to-[#0456DB] p-6 sm:p-8 text-white shadow-sm shrink-0">
          <div className="absolute -right-20 -top-20 size-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute right-20 -bottom-20 size-60 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-start gap-4 max-w-2xl">
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center justify-center rounded-lg bg-white/20 p-2.5 backdrop-blur-sm">
                <Search className="size-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-[26px] gap-2 leading-[32px] sm:text-[32px] sm:leading-[40px] font-bold font-heading tracking-tight">Cari Material Upgrade Skill</h1>
                <p className="text-sm sm:text-base text-white/90">Feed lowongan diperbarui otomatis dan diurutkan sesuai kecocokan profilmu.</p>
              </div>
            </div>
            <div className="mt-3 flex w-full items-center gap-3 rounded-xl bg-white/95 px-4 py-3.5 shadow-inner">
              <Search className="size-5 text-[#8E8E8E] shrink-0" />
              <input
                type="text"
                placeholder="Cari Posisi, Perusahaan atau skill (mis. Full-Stack Lead, GraphQL)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent flex-grow text-sm text-[#282510] placeholder-[#A4A4A4] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 shrink-0 pr-2">
          <div className="flex flex-wrap items-center gap-3">
            {['Lokasi', 'Gaji', 'Level Pengalaman', 'Skill Gap'].map(filter => (
              <button key={filter} className="inline-flex items-center gap-2 rounded-[40px] border border-[#C4DEFF] bg-[#EFF6FE] px-4 py-2 text-[13px] font-medium text-[#4A4A4A] transition hover:bg-[#D9EAFF] whitespace-nowrap">
                {filter} <ChevronDown className="size-4 text-[#8E8E8E]" />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 text-[13px] text-[#4A4A4A] shrink-0">
            <span className="whitespace-nowrap">Urut Berdasarkan:</span>
            <button className="inline-flex items-center gap-2 rounded-[40px] border border-[#C4DEFF] bg-[#EFF6FE] px-4 py-2 font-medium transition hover:bg-[#D9EAFF] text-[#0272FF] whitespace-nowrap">
              Skor Kecocokan <ChevronDown className="size-4" />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-24">
          {MOCK_EXPLORE_ROADMAPS.map(roadmap => (
            <div key={roadmap.id} className="relative rounded-[16px] border border-[#F3F2EE] bg-white overflow-hidden flex flex-col group transition-all hover:shadow-md hover:border-[#0272FF]/30">
              <div className="p-5 flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-[48px] shrink-0 items-center justify-center rounded-[8px] bg-[#EFF6FE] border border-[#C4DEFF]">
                    <Notebook className="size-6 text-[#0272FF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2 leading-tight font-semibold text-[#3B361E] font-sans truncate">{roadmap.title}</h3>
                    <p className="mt-1 text-[12px] text-[#A4A4A4] truncate font-sans">{roadmap.author} · {roadmap.category} · {roadmap.level}</p>
                  </div>
                </div>
                <div className="text-[13px] text-[#8E8E8E] leading-[1.5] font-sans line-clamp-3">
                  {roadmap.match_reason}
                </div>
              </div>

              <div className="px-5 py-4 flex items-center justify-between border-t border-[#F3F2EE] bg-white">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-[#0272FF]">{roadmap.pct}% Kecocokan</span>
                </div>
                <button onClick={() => onSelect(roadmap.id)} className="flex items-center justify-center gap-1.5 rounded-[8px] bg-[#0272FF] px-4 py-2 text-[12px] font-medium text-[#FAFFF5] font-sans transition hover:bg-[#005ED5]">
                  Mulai Belajar <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Gradient Overlay & Scroll Down Button */}
        <div className={`sticky bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F7F7FB] via-[#F7F7FB]/80 to-transparent pointer-events-none flex items-end justify-center pb-6 transition-opacity duration-300 ${showScrollDown ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={scrollDown}
            className={`pointer-events-auto flex items-center gap-2 rounded-full bg-[#005ED5] px-4 py-2.5 text-[12px] font-medium text-white shadow-lg transition hover:bg-[#0047A5] ${showScrollDown ? 'translate-y-0' : 'translate-y-4 opacity-0 cursor-default'}`}
          >
            Gulir ke bawah <ArrowDown className="size-4" />
          </button>
        </div>
      </div>

      {/* Right Sidebar Filters */}
      <div className="rounded-2xl border-[0.5px] border-[#C4DEFF] overflow-hidden flex flex-col bg-white shrink-0 sticky top-0 h-fit max-h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="bg-gradient-to-br from-[#EFF6FE] to-[#9FCAFF] p-6 relative overflow-hidden shrink-0">
          <div className="absolute -bottom-40 left-[48%] -translate-x-1/2 size-[840px] rounded-full bg-[radial-gradient(ellipse_at_center,_#0059FF_0%,_transparent_60%)] opacity-20 pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-[22px] items-center justify-center relative shrink-0">
                <Filter className="size-5 text-[#0272FF]" />
              </div>
              <h2 className="text-[22px] font-bold text-[#0272FF] font-heading">Filter</h2>
            </div>
            <button className="text-sm font-normal text-[#0272FF] font-sans hover:underline">Reset</button>
          </div>
          <p className="relative z-10 mt-2.5 text-[14px] leading-[21px] text-[#4A4A4A] font-sans">Tuliskan atau pilih aktivitas yang pernah kamu jalani.</p>
        </div>

        <div className="p-6 space-y-6">
          <FilterSection
            title="Kategori"
            items={['Organisasi Mahasiswa', 'Summer Course', 'Kompetisi', 'Asisten Dosen/Lab', 'Sains & ICT', 'Pengabdian Masyarakat', 'Kewirausahaan', 'Magang/Kerja Praktik', 'Sertifikasi']}
          />
          <FilterSection
            title="Softskills"
            hasSearch
            searchPlaceholder="Cari Softskills"
            items={['Adaptabilitas', 'Analytical Thinking', 'Consulting Mindset', 'Critical Thinking', 'Leadership', 'Problem Solving', 'Teamwork', 'Communication', 'Time Management', 'Creativity']}
          />
          <FilterSection
            title="Hardskills"
            hasSearch
            searchPlaceholder="Cari Hardskills"
            items={['Business Analysis', 'Data Analysis', 'Data Wrangling', 'Decision Theory', 'Event Management', 'Python', 'SQL', 'Machine Learning', 'React', 'Node.js']}
          />
        </div>
      </div>
    </div>
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
                    const required = levelToPercent(gap.required_level)
                    const current = levelToPercent(gap.current_level)
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
                          <p className="mt-1 text-[10.5px] leading-4 text-white/70">Level kamu <span className="font-semibold text-white">{gap.current_level}</span></p>
                          <p className="text-[10.5px] leading-4 text-white/70">Dibutuhkan <span className="font-semibold text-white">{gap.required_level}</span></p>
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

function levelToPercent(level: string): number {
  const map: Record<string, number> = {
    none: 0, beginner: 33, intermediate: 66, advanced: 80, expert: 100,
    'tidak ada': 0, 'pemula': 33, 'menengah': 66, 'mahir': 80, 'ahli': 100,
  }
  return map[level?.toLowerCase()] ?? 50
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
