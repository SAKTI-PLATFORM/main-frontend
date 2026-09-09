'use client'

import {
  Bell,
  LayoutGrid,
  PersonStanding,
  BriefcaseBusiness,
  TrendingUp,
  Map,
  LockKeyhole,
  Search,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Cell, Tooltip } from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { mockLeaderboard, mockRoadmapOptions, mockSkillGaps } from './mock-data'

export default function LearningPathsOverviewPage() {
  const currentRole = "The Backend Developer Path"

  return (
    <div className="min-h-full bg-[#F7F7FB] px-4 py-5 sm:px-6 sm:py-7">
      <div className="mx-auto max-w-[1480px]">


        <div className="grid items-stretch gap-6 xl:grid-cols-[1fr_360px]">
          {/* Main Left Content */}
          <div className="flex flex-col gap-6 h-full">
            {/* Skill Gap Blue Card */}
            <Card className="overflow-hidden rounded-2xl border-none bg-[#0D62F9] text-white">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <p className="text-sm font-medium text-white/80">Analisis Skill Gap dan Roadmap</p>
                    <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{currentRole}</h1>
                  </div>
                  <div className="flex items-center gap-4 rounded-xl bg-white/10 p-2 pr-2.5 pl-4 backdrop-blur-md">
                    <div className="flex flex-col items-end text-white">
                      <span className="text-[11px] font-medium opacity-80 uppercase tracking-wider">Kemajuan</span>
                      <span className="text-lg font-bold leading-none">45%</span>
                    </div>
                    <Link
                      href="/job-seeker/learning-paths/1-full-stack/roadmap"
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-bold text-[#0D62F9] shadow-sm transition-transform hover:scale-105 active:scale-95"
                    >
                      Lanjutkan Belajar <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>

                <div className="mt-8 h-48 w-full sm:mt-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockSkillGaps} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <YAxis domain={[0, 100]} hide />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'white', fontSize: 13, fontWeight: 500 }}
                        dy={12}
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(255, 255, 255, 0.15)', radius: 8 }}
                        contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#ffffff', color: '#005ED5', fontWeight: 'bold' }}
                        itemStyle={{ color: '#005ED5' }}
                        formatter={(value) => [`${value}%`, 'Progress']}
                      />
                      <Bar
                        dataKey="value"
                        radius={[8, 8, 8, 8]}
                        barSize={120}
                        background={{ fill: 'rgba(255, 255, 255, 0.4)', radius: 8 }}
                      >
                        {mockSkillGaps.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Pilihan Roadmap lain */}
            <Card className="rounded-3xl border-0 border-[#E9E7F2] gap-0 bg-white overflow-hidden flex-1 flex flex-col">
              <CardHeader className="px-6 py-2">
                <CardTitle className="text-xl font-normal text-gray-400">Pilihan Roadmap lain</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col">
                  {mockRoadmapOptions.map((roadmap: any, index: number) => (
                    <div key={roadmap.id} className={cn(
                      "group relative flex flex-col justify-between gap-4 p-6 md:flex-row md:items-center transition-colors hover:bg-blue-50/40 cursor-pointer",
                      index !== mockRoadmapOptions.length - 1 && "border-b border-[#E9E7F2]"
                    )}>
                      {/* Make the entire row clickable to the roadmap detail */}
                      <Link href={`/job-seeker/learning-paths/${roadmap.id}/roadmap`} className="absolute inset-0 z-10">
                        <span className="sr-only">Lihat Detail {roadmap.title}</span>
                      </Link>

                      <div className="space-y-3 flex-1 relative z-20 pointer-events-none">
                        <div className="flex items-center gap-2 justify-start">
                          <h3 className="text-lg font-bold text-[#302D37] group-hover:text-[#0D62F9] transition-colors">{roadmap.title}</h3>
                          <Badge variant="outline" className="rounded-sm border-orange-200 bg-orange-50 text-orange-600 font-medium">
                            {roadmap.priority}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm text-muted-foreground">Keterampilan Target:</span>
                          {roadmap.skills.map((skill: string) => (
                            <Badge key={skill} variant="secondary" className="bg-gray-100 text-gray-600 font-medium">{skill}</Badge>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground pt-1">
                          <span className="flex items-center gap-1.5"><TrendingUp className="size-4" /> {roadmap.duration}</span>
                          <span className="flex items-center gap-1.5"><LayoutGrid className="size-4" /> {roadmap.videos}</span>
                          <span className="flex items-center gap-1.5"><BriefcaseBusiness className="size-4" /> {roadmap.level}</span>
                        </div>
                      </div>

                      <div className="relative flex min-w-[150px] flex-col items-end justify-center z-20 pointer-events-none">
                        {/* Default state: Progress bar */}
                        <div className="flex w-full flex-col items-end transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-2">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-emerald-600">{roadmap.progress}%</span>
                          </div>
                          <span className="text-sm font-medium text-muted-foreground">kemajuan</span>
                          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${roadmap.progress}%` }} />
                          </div>
                        </div>

                        {/* Hover state: CTA Button */}
                        <div className="absolute inset-0 flex items-center justify-end opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
                          <div className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0D62F9] px-5 text-sm font-medium text-white shadow-sm transition-colors group-hover:bg-[#0047A5]">
                            Lihat Detail <ArrowRight className="size-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-6 border-0 h-full">
            <Card className="rounded-3xl gap-0 border-0 border-[#E9E7F2] bg-white flex-1 flex flex-col">
              <CardHeader className="border-b border-[#EFEDF5] px-6 py-2 shrink-0">
                <CardTitle className="text-lg font-bold text-[#292631]">Papan Peringkat</CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 flex flex-col">
                {/* Top 3 podium dummy style */}
                <div className="flex items-end justify-center gap-4 border-1 border-[#EFEDF5] p-6 shrink-0">
                  {/* Rank 2 */}
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-light text-gray-300">02</div>
                    <div className="mt-2 text-xs font-medium text-gray-700">{mockLeaderboard[1].name}</div>
                    <div className="text-[10px] text-gray-400">{mockLeaderboard[1].daysStreak} Hari Berturut</div>
                    <div className="mt-1 font-bold text-[#0D62F9]">{mockLeaderboard[1].xp.toLocaleString()} XP</div>
                    <div className="mt-2 h-16 w-16 rounded-t-lg bg-[#538EFA]"></div>
                  </div>
                  {/* Rank 1 */}
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-light text-gray-300">01</div>
                    <div className="mt-2 text-xs font-medium text-gray-700">{mockLeaderboard[0].name}</div>
                    <div className="text-[10px] text-gray-400">{mockLeaderboard[0].daysStreak} Hari Berturut</div>
                    <div className="mt-1 font-bold text-[#0D62F9]">{mockLeaderboard[0].xp.toLocaleString()} XP</div>
                    <div className="mt-2 h-24 w-16 rounded-t-lg bg-[#0D62F9]"></div>
                  </div>
                  {/* Rank 3 */}
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-light text-gray-300">03</div>
                    <div className="mt-2 text-xs font-medium text-gray-700">{mockLeaderboard[2].name}</div>
                    <div className="text-[10px] text-gray-400">{mockLeaderboard[2].daysStreak} Hari Berturut</div>
                    <div className="mt-1 font-bold text-[#0D62F9]">{mockLeaderboard[2].xp.toLocaleString()} XP</div>
                    <div className="mt-2 h-12 w-16 rounded-t-lg bg-[#8FB5FB]"></div>
                  </div>
                </div>

                {/* Current User position */}
                <div className="bg-blue-50/50 px-6 py-4 shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500">Posisi Anda Saat Ini</span>
                    <span className="text-[10px] font-bold text-[#0D62F9]">Teruskan Perjuangan!</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-[#0D62F9] px-4 py-3 text-white shadow-md">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-light opacity-80">{mockLeaderboard[9].rank}</span>
                      <div>
                        <div className="text-sm font-bold">{mockLeaderboard[9].name}</div>
                        <div className="text-[10px] opacity-80">{mockLeaderboard[9].daysStreak} Hari Berturut-turut</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold">{mockLeaderboard[9].xp.toLocaleString()} XP</div>
                  </div>
                </div>

                {/* Rest of the list */}
                <div className="px-6 py-4 flex-1 flex flex-col">
                  <div className="space-y-4 flex-1">
                    {mockLeaderboard.slice(3, 10).map((user) => (
                      <div key={user.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-light text-gray-300">{user.rank < 10 ? `0${user.rank}` : user.rank}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-700">{user.name}</div>
                            <div className="text-[10px] text-gray-400">{user.daysStreak} Hari Berturut-turut</div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-gray-700">{user.xp.toLocaleString()} XP</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 shrink-0">
                    <Link
                      href="/job-seeker/learning-paths/leaderboard"
                      className="inline-flex h-8 items-center justify-center rounded-lg border border-[#0D62F9]/20 bg-background text-[#0D62F9] text-sm font-medium w-full transition-colors hover:bg-[#0D62F9]/5"
                    >
                      Lihat Papan Peringkat Lengkap
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
