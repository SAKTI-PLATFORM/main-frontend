'use client'

import { BenchmarkBarChart } from '@/components/charts/benchmark-bar-chart'
import { AiInsight } from '@/components/dashboard/ai-insight'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import {
  DashboardError,
  DashboardLoading,
} from '@/components/dashboard/dashboard-status'
import { IncompleteOnboardingBanner } from '@/components/dashboard/incomplete-onboarding-banner'
import { JobRecommendations } from '@/components/dashboard/job-recommendations'
import { ProfileCard } from '@/components/dashboard/profile-card'
import { SkillGapList } from '@/components/dashboard/skill-gap-list'
import { StatHighlight } from '@/components/dashboard/stat-highlight'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  MOCK_BENCHMARK,
  MOCK_EMPLOYABILITY,
  MOCK_INSIGHT,
  MOCK_JOBS,
  MOCK_SKILL_GAPS,
} from '@/features/dashboard/data-analyst-mock'
import { useDashboard } from '@/features/dashboard/use-dashboard'

export default function SkillsDashboardPage() {
  const state = useDashboard()

  if (state.status === 'loading') return <DashboardLoading />
  if (state.status === 'error') return <DashboardError />

  const { data } = state

  // Career data lives in the microservices DB; if it's unreachable the target
  // role is set but benchmark comes back null → fall back to demo data so the
  // dashboard still renders fully.
  const usingDemo = Boolean(data.profile.targetRole) && data.marketBenchmark === null
  const benchmark = data.marketBenchmark ?? (usingDemo ? MOCK_BENCHMARK : null)
  const skillGaps = data.skillGaps ?? (usingDemo ? MOCK_SKILL_GAPS : null)
  const jobs =
    data.jobRecommendations.length > 0
      ? data.jobRecommendations
      : usingDemo
        ? MOCK_JOBS
        : []
  const employability = usingDemo
    ? MOCK_EMPLOYABILITY
    : data.employabilityScore
  const insight = data.aiInsight ?? (usingDemo ? MOCK_INSIGHT : null)

  return (
    <div className="space-y-6 p-6">
      <DashboardHeader name={data.profile.fullName} />

      <IncompleteOnboardingBanner completeness={data.profileCompleteness} />

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <ProfileCard profile={data.profile} />

        <div className="space-y-4 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatHighlight
              tone="employability"
              label="Employability Score"
              value={
                employability != null ? `${Math.round(employability)}%` : '—'
              }
              caption="Komposit skill, profil & match"
            />
            <StatHighlight
              tone="potential"
              label="Potential Skill"
              value={benchmark?.potentialSkill?.score.toFixed(2) ?? '—'}
              caption={
                benchmark?.potentialSkill
                  ? `${benchmark.potentialSkill.skill} — sesuai demand`
                  : 'Set target role'
              }
            />
            <StatHighlight
              tone="development"
              label="Development Area"
              value={benchmark?.developmentArea?.score.toFixed(2) ?? '—'}
              caption={
                benchmark?.developmentArea
                  ? `${benchmark.developmentArea.skill} — di bawah demand`
                  : 'Set target role'
              }
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Market Benchmark & Skill Demand</CardTitle>
              <CardDescription>
                {benchmark
                  ? `Market Demand vs skor kamu — untuk ${benchmark.role}${usingDemo ? ' · data contoh' : ''}`
                  : 'Tersedia setelah target role di-set'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {benchmark ? (
                <BenchmarkBarChart bars={benchmark.bars} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Lengkapi langkah Vision di onboarding untuk melihat benchmark.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {insight && <AiInsight insight={insight} />}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skill Gap Prioritas</CardTitle>
            <CardDescription>
              {skillGaps
                ? `Target: ${skillGaps.role} · total ${skillGaps.totalGapHours} jam`
                : 'TalentForge'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SkillGapList gaps={skillGaps?.gaps ?? []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Job Recommendation</CardTitle>
            <CardDescription>By SAKTI AI Analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <JobRecommendations jobs={jobs} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
