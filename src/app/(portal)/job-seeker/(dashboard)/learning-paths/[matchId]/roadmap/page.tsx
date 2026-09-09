'use client'

import {
  Bell,
  Map,
  Search,
  Play,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CirclePlay,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  TrendingUp,
  LayoutGrid,
  BriefcaseBusiness
} from 'lucide-react'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { mockRoadmapOptions, mockTimelineSteps } from '../../mock-data'

export default function RoadmapDetailPage({ params }: { params: { matchId: string } }) {
  const currentRole = "The Backend Developer Path"
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>(
    mockTimelineSteps.reduce((acc: Record<string, boolean>, step: any) => ({ ...acc, [step.id]: step.isExpanded || false }), {})
  )
  const [showScrollDown, setShowScrollDown] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const toggleStep = (id: string) => {
    setExpandedSteps(prev => ({ ...prev, [id]: !prev[id] }))
  }

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
    <div className="flex flex-col bg-[#F7F7FB] min-h-[calc(100vh-76px)] xl:h-[calc(100vh-76px)]">
      <div className="flex flex-col xl:h-full mx-auto max-w-[1480px] w-full px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex-1 xl:min-h-0 grid items-stretch gap-6 grid-cols-1 xl:grid-cols-[6fr_4fr]">
          {/* Main Left Content */}
          <div className="flex flex-col xl:h-full xl:min-h-0 relative">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-[#FDFEFF] to-[#F5FAFF] rounded-t-2xl border-x border-t border-[#E1D3FF] p-6 sm:px-8 sm:py-6 relative overflow-hidden shrink-0">
              <div className="mb-6">
                <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 text-sm font-medium text-[#0D62F9] hover:underline">
                  <ArrowLeft className="size-4" /> Kembali ke Overview
                </button>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-[#4A4A4A] font-['Instrument_Sans']">
                {currentRole}
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#7C8493] max-w-3xl">
                The comprehensive path to becoming a backend developer. Focused on in-demand skills from the JavaScript ecosystem, including Node, Express, and TypeScript, this path also explores databases, cybersecurity, DevOps, APIs, algorithms, and more.
              </p>

              <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-[#777777]" />
                    <span className="text-sm text-[#777777]">36.2 hrs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="size-4 text-[#777777]" />
                    <span className="text-sm text-[#777777]">30 Video</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BriefcaseBusiness className="size-4 text-[#777777]" />
                    <span className="text-sm text-[#777777]">Intermediate</span>
                  </div>
                </div>
                <Button className="h-11 w-full sm:w-auto rounded-lg bg-[#045DEF] px-6 text-base font-medium font-['Instrument_Sans'] hover:bg-[#034abf] border border-[#609CFF]">
                  Lanjut Belajar
                </Button>
              </div>
            </div>

            {/* Timeline Section */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="bg-white rounded-b-2xl border-x border-b border-[#E1D3FF] p-6 sm:px-8 flex-1 xl:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <div className="space-y-0 relative">
                {mockTimelineSteps.map((step: any, index: number) => (
                  <div key={step.id} className="relative">
                    {/* Main vertical line for parent */}
                    {index !== mockTimelineSteps.length - 1 && (
                      <div className="absolute left-[13px] top-8 bottom-[-24px] w-0.5 bg-[#CFE0FE]" />
                    )}

                    {/* Parent Step */}
                    <div className="relative flex items-start gap-4 py-4">
                      {step.subSteps && step.subSteps.length > 0 ? (
                        <button onClick={() => toggleStep(step.id)} className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#0D62F9] text-white ring-4 ring-white">
                          {expandedSteps[step.id] ? <ChevronUp className="size-4" strokeWidth={3} /> : <ChevronDown className="size-4" strokeWidth={3} />}
                        </button>
                      ) : (
                        <div className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#0D62F9] ring-4 ring-white">
                          <div className="size-2.5 rounded-full bg-white" />
                        </div>
                      )}
                      <div className="flex-1 pt-0.5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 cursor-pointer" onClick={() => step.subSteps?.length ? toggleStep(step.id) : undefined}>
                          <span className="text-lg font-medium text-[#292631] hover:text-[#0D62F9] transition-colors">
                            {step.title}
                          </span>
                          <div className="flex items-center gap-3 shrink-0">
                            {step.durationInfo && (
                              <span className="text-sm text-[#8E8E8E] px-2 py-1">{step.durationInfo}</span>
                            )}
                            <span className="text-sm font-medium text-[#4A4A4A] bg-gray-100 px-3 py-1 rounded-[6px]">{step.timeInfo}</span>
                          </div>
                        </div>
                        {expandedSteps[step.id] && step.description && (
                          <p className="mt-2 text-sm leading-relaxed text-[#7C8493] max-w-2xl">
                            {step.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Sub Steps */}
                    {expandedSteps[step.id] && step.subSteps.length > 0 && (
                      <div className="ml-7 relative space-y-0 pb-4">
                        {/* Vertical line for sub steps only if last parent */}
                        {index === mockTimelineSteps.length - 1 && (
                          <div className="absolute left-[-15px] top-[-16px] bottom-6 w-0.5 bg-[#CFE0FE]" />
                        )}

                        {step.subSteps.map((sub: any) => (
                          <div key={sub.id} className="relative flex items-start gap-4 py-3 pl-4">
                            {/* Curved branch to the right */}
                            <div className="absolute left-[-15px] top-[-12px] w-[27px] h-[36px] border-l-2 border-b-2 border-[#CFE0FE] rounded-bl-xl" />

                            <div className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full bg-white border-2 border-[#0D62F9] text-[#0D62F9] ring-2 ring-white mt-0.5">
                              {sub.subSteps && sub.subSteps.length > 0 ? (
                                <ChevronDown className="size-3" strokeWidth={3} />
                              ) : (
                                <div className="size-2 rounded-full bg-[#0D62F9]" />
                              )}
                            </div>
                            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer hover:opacity-80">
                              <span className="text-base font-medium text-[#4A4A4A]">
                                {sub.title}
                              </span>
                              <div className="flex items-center gap-3 shrink-0">
                                {sub.durationInfo && (
                                  <span className="text-xs text-[#8E8E8E] px-2 py-1">{sub.durationInfo}</span>
                                )}
                                <span className="text-xs font-medium text-[#606060] bg-gray-100 px-3 py-1 rounded-[6px]">{sub.timeInfo}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Gradient Overlay & Scroll Down Button */}
            <div className={`hidden xl:flex absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none items-end justify-center pb-6 transition-opacity duration-300 rounded-b-2xl ${showScrollDown ? 'opacity-100' : 'opacity-0'}`}>
              <button
                onClick={scrollDown}
                className={`pointer-events-auto flex items-center gap-2 rounded-full bg-[#0D62F9] px-4 py-2.5 text-[12px] font-medium text-white shadow-lg transition hover:bg-[#0047A5] ${showScrollDown ? 'translate-y-0' : 'translate-y-4 opacity-0 cursor-default'}`}
              >
                Gulir ke bawah <ArrowDown className="size-4" />
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-6 xl:h-full xl:min-h-0">
            {/* Progress Keseluruhan */}
            <Card className="rounded-2xl border-[#E9E7F2] bg-white shrink-0">
              <CardHeader className="border-b border-[#EFEDF5] px-6">
                <CardTitle className="text-lg font-bold text-[#292631]">Progress Keseluruhan</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {/* Dummy segmented progress bars */}
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className={`h-8 w-4 rounded-sm ${i < 7 ? 'bg-emerald-500' : 'bg-gray-100'}`} />
                    ))}
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-emerald-600">71%</div>
                    <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-gray-500">
                      <TrendingUp className="size-3" /> Naik 14%
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-5 text-muted-foreground">
                  Roadmap belajar ini dibuat otomatis berdasarkan hasil JobMatcher untuk menutup skill gap.
                </p>
              </CardContent>
            </Card>

            {/* Pilihan Roadmap lain (Compact) */}
            <Card className="rounded-xl bg-white flex-1 flex flex-col overflow-hidden border-[#E9E7F2]">
              <CardHeader className="border-b border-[#EFEDF5] px-6 py-4 shrink-0">
                <CardTitle className="text-lg font-bold text-[#292631]">Pilihan Roadmap lain</CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 xl:overflow-y-auto flex flex-col">
                <div className="divide-y divide-[#EFEDF5] flex-1">
                  {[...mockRoadmapOptions, ...mockRoadmapOptions].slice(0, 5).map((roadmap: any, i: number) => (
                    <div key={`${roadmap.id}-${i}`} className="p-6 transition hover:bg-[#FAF9FC]">
                      <h3 className="text-sm font-bold text-[#302D37]">{roadmap.title}</h3>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-medium text-muted-foreground">
                        <span className="flex items-center gap-1.5"><TrendingUp className="size-3.5" /> ~{roadmap.duration.replace(' jam', ' jam total')}</span>
                        <span className="flex items-center gap-1.5"><LayoutGrid className="size-3.5" /> {parseInt(roadmap.videos) / 5} section</span>
                        <span className="flex items-center gap-1.5"><BriefcaseBusiness className="size-3.5" /> {roadmap.level.replace('Tingkat ', '')}</span>
                      </div>
                      <p className="mt-3 text-xs leading-5 text-muted-foreground">
                        Modul ini dirancang untuk memperkuat keterampilan Anda berdasarkan JobMatcher dan analisis gap.
                      </p>
                    </div>
                  ))}
                </div>
                <div className="p-6 pt-5 shrink-0 border-t border-[#EFEDF5] bg-gray-50/30">
                  <Link href="/job-seeker/learning-paths/explore" className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#0D62F9]/20 bg-white py-2.5 text-sm font-bold text-[#0D62F9] shadow-sm transition-colors hover:bg-blue-50/50">
                    Eksplor Roadmap Lainnya <ArrowRight className="size-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
