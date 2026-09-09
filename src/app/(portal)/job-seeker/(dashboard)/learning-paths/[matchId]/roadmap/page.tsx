'use client';

import { ChevronDown, ChevronUp, ArrowLeft, ArrowDown, TrendingUp, LayoutGrid, BriefcaseBusiness, Loader2, BookOpen, Check, Clock, ExternalLink, AlertCircle, Play, FileText, Globe, Waypoints, Binoculars } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef, use } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useDashboard } from '@/features/dashboard/use-dashboard';
import { useCareerPipeline } from '@/features/career-pipeline/use-career-pipeline';
import { useRoadmapProgress } from '@/features/career-pipeline/use-roadmap-progress';
import { DashboardLoading, DashboardError } from '@/components/dashboard/dashboard-status';
import { AITurnTrail } from '@/components/career-pipeline/ai-turn-trail';
import { MathCurveLoader } from '@/components/ui/math-curve-loader';
import type { TalentForgerResult, LearningPathStepResult, LearningResourceResult, ResourceRecommendationResult, CareerMatchResult } from '@/types/career-pipeline.types';

// Segmented bar in the "Progress Keseluruhan" card — fixed count, filled
// proportionally to percent so the bar reads the same whatever the step count.
const PROGRESS_SEGMENTS = 16;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resourceTypeIcon(type: string): React.ReactNode {
  const lower = type.toLowerCase();
  if (lower.includes('video')) return <Play className="size-3.5 shrink-0" />;
  if (lower.includes('article') || lower.includes('blog')) return <FileText className="size-3.5 shrink-0" />;
  return <Globe className="size-3.5 shrink-0" />;
}

interface StepGroup {
  week: number;
  steps: LearningPathStepResult[];
}

function groupStepsByWeek(steps: LearningPathStepResult[]): StepGroup[] {
  const map = new Map<number, LearningPathStepResult[]>();
  for (const step of steps) {
    const existing = map.get(step.week) ?? [];
    existing.push(step);
    map.set(step.week, existing);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a - b)
    .map(([week, groupSteps]) => ({
      week,
      steps: groupSteps.slice().sort((a, b) => a.step_order - b.step_order),
    }));
}

function getResourcesForStep(step: LearningPathStepResult, recommendations: ResourceRecommendationResult[], resources: LearningResourceResult[]): LearningResourceResult[] {
  const resourceIds = recommendations
    .filter((r) => r.step_id === step.step_id)
    .sort((a, b) => a.priority_order - b.priority_order)
    .map((r) => r.resource_id);
  return resourceIds.map((id) => resources.find((r) => r.resource_id === id)).filter((r): r is LearningResourceResult => Boolean(r));
}

function totalDurationHours(resources: LearningResourceResult[]): number {
  return resources.reduce((acc, r) => acc + (r.estimated_duration_hours ?? 0), 0);
}

function primaryLevel(resources: LearningResourceResult[]): string {
  if (resources.length === 0) return 'Intermediate';
  const level = resources[0].difficulty_level ?? 'intermediate';
  return level.charAt(0).toUpperCase() + level.slice(1);
}

// ─── Resource Card ────────────────────────────────────────────────────────────

function ResourceCard({ resource }: { resource: LearningResourceResult }) {
  return (
    <a href={resource.url} target="_blank" rel="noreferrer" className="group flex items-start gap-3 rounded-lg border border-[#ECECF2] bg-[#FAFAFA] p-3 transition hover:border-[#045DEF]/30 hover:bg-orange-50/20">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FE] text-[#045DEF]">{resourceTypeIcon(resource.resource_type)}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#292631] leading-snug line-clamp-2 group-hover:text-[#045DEF] transition-colors">{resource.resource_title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[#9CA3AF]">
          <span>{resource.provider}</span>
          {resource.estimated_duration_hours > 0 && (
            <>
              <span>·</span>
              <span>{resource.estimated_duration_hours}j</span>
            </>
          )}
          {resource.is_free && (
            <>
              <span>·</span>
              <span className="text-emerald-600 font-medium">Gratis</span>
            </>
          )}
        </div>
      </div>
      <ExternalLink className="size-3.5 shrink-0 text-[#CBD5E1] group-hover:text-[#045DEF] mt-0.5 transition-colors" />
    </a>
  );
}

// ─── Timeline Step ────────────────────────────────────────────────────────────

function TimelineStep({
  group,
  isLast,
  isExpanded,
  onToggle,
  recommendations,
  resources,
  completed,
  onToggleStep,
}: {
  group: StepGroup;
  isLast: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  recommendations: ResourceRecommendationResult[];
  resources: LearningResourceResult[];
  completed: Set<string>;
  onToggleStep: (stepId: string, next: boolean) => void;
}) {
  const doneInWeek = group.steps.filter((s) => completed.has(s.step_id)).length;
  const weekDone = group.steps.length > 0 && doneInWeek === group.steps.length;

  return (
    <div className="relative">
      {!isLast && <div className="absolute left-[13px] top-8 bottom-[-24px] w-0.5 bg-[#CFE0FE]" />}

      <div className="relative flex items-start gap-4 py-4">
        <button onClick={onToggle} className={cn('relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full text-white ring-4 ring-white transition-colors', weekDone ? 'bg-emerald-500' : 'bg-[#045DEF]')}>
          {isExpanded ? <ChevronUp className="size-4" strokeWidth={3} /> : <ChevronDown className="size-4" strokeWidth={3} />}
        </button>

        <div className="flex-1 pt-0.5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 cursor-pointer" onClick={onToggle}>
            <span className="text-[17px] font-semibold text-[#26262F] hover:text-[#045DEF] transition-colors font-heading">Minggu {group.week}</span>
            <span className={cn('text-xs px-2 py-1 rounded-md font-medium inline-flex items-center gap-1', weekDone ? 'text-emerald-600 bg-emerald-50' : 'text-[#8E8E8E]')}>
              {weekDone && <Check className="size-3" strokeWidth={3} />}
              {doneInWeek}/{group.steps.length} selesai
            </span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="ml-7 relative space-y-0 pb-4">
          {isLast && <div className="absolute left-[-15px] top-[-16px] bottom-6 w-0.5 bg-[#CFE0FE]" />}
          {group.steps.map((step) => {
            const stepResources = getResourcesForStep(step, recommendations, resources);
            const stepDone = completed.has(step.step_id);
            return (
              <div key={step.step_id} className="relative flex flex-col gap-3 py-3 pl-4">
                <div className="absolute left-[-15px] top-[-12px] w-[27px] h-[36px] border-l-2 border-b-2 border-[#CFE0FE] rounded-bl-xl" />
                <div className="flex items-start gap-4">
                  <button
                    type="button"
                    onClick={() => onToggleStep(step.step_id, !stepDone)}
                    aria-pressed={stepDone}
                    aria-label={stepDone ? `Tandai "${step.topic}" belum selesai` : `Tandai "${step.topic}" selesai`}
                    className={cn(
                      'relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2 ring-2 ring-white mt-0.5 transition-colors',
                      stepDone ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-[#045DEF] hover:border-emerald-400',
                    )}
                  >
                    {stepDone ? <Check className="size-3.5 text-white" strokeWidth={3} /> : <div className="size-2 rounded-full bg-[#045DEF]" />}
                  </button>
                  <div className="flex-1">
                    <span className={cn('text-[15px] font-semibold transition-colors', stepDone ? 'text-[#9CA3AF] line-through' : 'text-[#4A4A4A]')}>{step.topic}</span>
                    {step.objective && <p className="mt-1 text-xs leading-5 text-[#7C8493]">{step.objective}</p>}
                    {step.related_skill_name && <span className="mt-2 inline-block rounded-lg bg-[#EFF6FE] px-2.5 py-0.5 text-[11px] font-semibold text-[#045DEF]">{step.related_skill_name}</span>}
                  </div>
                </div>
                {stepResources.length > 0 && (
                  <div className="ml-10 flex flex-col gap-2">
                    {stepResources.slice(0, 3).map((resource) => (
                      <ResourceCard key={resource.resource_id} resource={resource} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RoadmapDetailPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = use(params);
  const dashboardState = useDashboard();

  const sessionId = dashboardState.status === 'ready' ? (dashboardState.session?.onboarding_session_id ?? null) : null;

  const { run, loading, generating, generate } = useCareerPipeline<TalentForgerResult>(sessionId, 'talent-forger', { matchId, pollWhenMissing: true });

  const roadmapReady = run?.status === 'COMPLETED' && Boolean(run.result);
  const { completed: completedStepIds, percent: progressPercent, totalSteps: progressTotal, completedSteps: progressDone, sessionGain, toggleStep } = useRoadmapProgress(sessionId, matchId, roadmapReady);

  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({});
  const [showScrollDown, setShowScrollDown] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleWeek = (week: number) => {
    setExpandedWeeks((prev) => ({ ...prev, [week]: !prev[week] }));
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setShowScrollDown(!(scrollTop > 50 || scrollTop + clientHeight >= scrollHeight - 10));
    }
  };

  const scrollDown = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ top: 400, behavior: 'smooth' });
      setShowScrollDown(false);
    }
  };

  if (dashboardState.status === 'loading') return <DashboardLoading />;
  if (dashboardState.status === 'error') return <DashboardError />;

  const { jobMatcher } = dashboardState;

  const otherMatches: CareerMatchResult[] = (jobMatcher?.result?.career_match_results ?? [])
    .slice()
    .sort((a, b) => b.total_match_score - a.total_match_score)
    .filter((m) => m.match_id !== matchId)
    .slice(0, 5);

  const isProcessing = loading || run?.status === 'PENDING' || run?.status === 'RUNNING' || generating;

  const result: TalentForgerResult | null = run?.result ?? null;
  const learningPath = result?.learning_paths?.[0] ?? null;

  const allSteps: LearningPathStepResult[] = result?.learning_path_steps ?? [];
  const allResources: LearningResourceResult[] = [...(result?.learning_resources ?? []), ...(result?.free_materials ?? [])];
  const allRecommendations: ResourceRecommendationResult[] = result?.resource_recommendations ?? [];

  const stepGroups = groupStepsByWeek(allSteps);
  const totalHours = totalDurationHours(allResources);
  const level = primaryLevel(allResources);
  const targetRole = learningPath?.target_role ?? matchId;

  // Auto-expand first week
  const initialWeek = stepGroups[0]?.week;
  if (initialWeek !== undefined && !(initialWeek in expandedWeeks)) {
    setExpandedWeeks({ [initialWeek]: true });
  }

  // Reveal the week the user left off at.
  const jumpToNextStep = () => {
    const target = stepGroups.find((group) => group.steps.some((step) => !completedStepIds.has(step.step_id)));
    if (!target) return;
    setExpandedWeeks((prev) => ({ ...prev, [target.week]: true }));
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col bg-[#F7F7FB] min-h-[calc(100vh-76px)] xl:h-[calc(100vh-76px)]">
      <div className="flex flex-col xl:h-full mx-auto max-w-[1480px] w-full px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex-1 xl:min-h-0 grid items-stretch gap-5 grid-cols-1 xl:grid-cols-[6fr_4fr]">
          {/* ── Left: Timeline ─────────────────────────────────────────── */}
          <div className="flex flex-col xl:h-full xl:min-h-0 overflow-hidden rounded-lg ring-1 ring-[#ECECF2] bg-white">
            {/* Header — orange gradient like job-matches */}
            <div className="relative bg-gradient-to-br from-[#045DEF] to-[#0047C8] text-white p-5 sm:p-6 shrink-0 overflow-hidden">
              <Image src="/logo-dash.png" alt="" width={220} height={280} className="pointer-events-none absolute -right-4 -top-2 opacity-80 select-none w-48 sm:w-80" />
              <div className="relative">
                <button onClick={() => window.history.back()} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/80 hover:text-white transition mb-3">
                  <ArrowLeft className="size-4" /> Kembali ke Overview
                </button>
                <h1 className="font-heading text-[20px] leading-[30px] font-bold tracking-[-0.01em] sm:text-[24px] sm:leading-[36px] max-w-lg">{targetRole}</h1>
                {learningPath && (
                  <p className="mt-1.5 text-[13px] text-white/80 leading-relaxed max-w-md line-clamp-2">
                    Roadmap AI-generated untuk menutup skill gap dan mempersiapkan kamu menjadi <strong>{targetRole}</strong> dalam {learningPath.estimated_duration_weeks} minggu.
                  </p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-5">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-white/70" />
                    <span className="text-[13px] text-white/90">{totalHours > 0 ? `~${Math.round(totalHours)} jam` : `${(learningPath?.estimated_duration_weeks ?? 0) * 40} jam estimasi`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="size-4 text-white/70" />
                    <span className="text-[13px] text-white/90">{allSteps.length} Topik</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BriefcaseBusiness className="size-4 text-white/70" />
                    <span className="text-[13px] text-white/90">{level}</span>
                  </div>
                </div>
                {result && (
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button onClick={jumpToNextStep} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-[13px] font-semibold text-[#045DEF] transition hover:bg-white/90">
                      <Play className="size-3.5 fill-current" />
                      {progressPercent >= 100 ? 'Tinjau Ulang' : 'Lanjut Belajar'}
                    </button>
                    <span className="text-[13px] font-medium text-white/90">{progressPercent}% selesai</span>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline body */}
            <div ref={scrollRef} onScroll={handleScroll} className="flex-1 xl:overflow-y-auto p-5 sm:p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative">
              {/* Loading */}
              {isProcessing && (
                <div className="flex flex-col items-center gap-6 py-12">
                  <MathCurveLoader size={48} label="Sakti AI sedang membuat roadmap Anda..." />
                  <p className="text-sm text-[#7C8493] text-center max-w-sm">TalentForger sedang menganalisis skill gap. Biasanya 1–3 menit.</p>
                  {run?.turns && run.turns.length > 0 && (
                    <div className="w-full max-w-md">
                      <AITurnTrail turns={run.turns} />
                    </div>
                  )}
                </div>
              )}

              {/* Not generated yet */}
              {!isProcessing && !result && (
                <div className="flex flex-col items-center gap-4 py-12 text-center">
                  <div className="flex size-14 items-center justify-center rounded-lg bg-orange-50">
                    <AlertCircle className="size-7 text-[#045DEF]" />
                  </div>
                  <div>
                    <h3 className="font-heading text-[18px] font-bold text-[#292631]">Roadmap belum di-generate</h3>
                    <p className="mt-2 text-sm text-[#7C8493] max-w-sm">Klik tombol di bawah untuk memulai TalentForger dan membuat roadmap personal.</p>
                  </div>
                  <button
                    onClick={() => void generate(matchId)}
                    disabled={generating}
                    className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#045DEF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0047C8] transition disabled:opacity-60"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="size-4 animate-spin" /> Memproses...
                      </>
                    ) : (
                      <>
                        <BookOpen className="size-4" /> Generate Roadmap
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Timeline */}
              {!isProcessing && result && stepGroups.length > 0 && (
                <div className="space-y-0 relative">
                  {stepGroups.map((group, index) => (
                    <TimelineStep
                      key={group.week}
                      group={group}
                      isLast={index === stepGroups.length - 1}
                      isExpanded={expandedWeeks[group.week] ?? false}
                      onToggle={() => toggleWeek(group.week)}
                      recommendations={allRecommendations}
                      resources={allResources}
                      completed={completedStepIds}
                      onToggleStep={toggleStep}
                    />
                  ))}
                </div>
              )}

              {!isProcessing && result && stepGroups.length === 0 && <div className="py-12 text-center text-sm text-[#9CA3AF]">Tidak ada langkah belajar ditemukan.</div>}

              {/* Scroll indicator */}
              <div
                className={cn(
                  'hidden xl:flex sticky bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none items-end justify-center pb-4 transition-opacity duration-300',
                  showScrollDown ? 'opacity-100' : 'opacity-0',
                )}
              >
                <button
                  onClick={scrollDown}
                  className={cn(
                    'pointer-events-auto flex items-center gap-2 rounded-full bg-[#045DEF] px-4 py-2 text-[12px] font-medium text-white shadow-md transition hover:bg-[#0047C8]',
                    showScrollDown ? 'translate-y-0' : 'translate-y-4 opacity-0 cursor-default',
                  )}
                >
                  Gulir ke bawah <ArrowDown className="size-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 xl:h-full xl:min-h-0">
            {/* Progress Keseluruhan */}
            <section className="bg-white rounded-lg ring-1 ring-[#ECECF2] shrink-0">
              <div className="border-b border-[#ECECF2] px-5 py-3.5">
                <h2 className="font-heading text-[18px] leading-[27px] font-bold text-[#4A4A4A]">Progress Keseluruhan</h2>
              </div>
              <div className="p-5">
                {result ? (
                  <>
                    <div className="flex items-end gap-4">
                      <div className="flex h-11 flex-1 items-stretch gap-[3px]">
                        {Array.from({ length: PROGRESS_SEGMENTS }).map((_, i) => {
                          const filledCount = Math.round((progressPercent / 100) * PROGRESS_SEGMENTS);
                          return <span key={i} className={cn('flex-1 rounded-[2px] transition-colors', i < filledCount ? 'bg-emerald-500' : 'bg-emerald-100')} />;
                        })}
                      </div>
                      <div className="flex shrink-0 flex-col items-end">
                        <span className="font-heading text-[28px] font-bold leading-none text-emerald-500">{progressPercent}%</span>
                        {sessionGain > 0 && <span className="mt-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-600">Naik {sessionGain}%</span>}
                      </div>
                    </div>
                    <p className="mt-3 text-[13px] leading-5 text-[#8A8A98]">
                      {progressDone} dari {progressTotal || allSteps.length} topik selesai. Roadmap ini dibuat otomatis dari hasil JobMatcher untuk menutup skill gap kamu.
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-[#9CA3AF] text-center py-4">Generate roadmap untuk mulai melacak progress.</p>
                )}
              </div>
            </section>

            <section className="bg-white rounded-lg ring-1 ring-[#ECECF2] flex-1 flex flex-col xl:min-h-0 overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#ECECF2] px-5 py-3.5 shrink-0">
                <h2 className="font-heading text-[18px] leading-[27px] font-bold text-[#4A4A4A]">Pilihan Roadmap lain</h2>
                <Binoculars className="size-5 text-[#9293A2]" />
              </div>

              <div className="flex-1 xl:overflow-y-auto divide-y divide-[#F0F0F5]">
                {otherMatches.length === 0 ? (
                  <p className="p-5 text-center text-xs leading-5 text-[#8A8A98] rounded-lg bg-[#FAFAFC] m-4">Tidak ada roadmap lain untuk ditampilkan.</p>
                ) : (
                  otherMatches.map((match) => (
                    <Link key={match.match_id} href={`/job-seeker/learning-paths/${match.match_id}/roadmap`} className="block px-5 py-4 hover:bg-[#FAFAFC] transition group">
                      <h3 className="font-heading text-[15px] font-bold text-[#302D37] group-hover:text-[#045DEF] transition-colors">{match.role_name}</h3>
                      <div className="mt-1.5 flex items-center gap-2 text-[12px] text-[#8A8A98]">
                        <TrendingUp className="size-3.5" />
                        <span>{Math.round(match.total_match_score)}% kecocokan</span>
                      </div>
                      <p className="mt-1.5 text-xs leading-5 text-[#5C5C6A] line-clamp-2">{match.match_reason}</p>
                    </Link>
                  ))
                )}
              </div>

              <div className="p-4 border-t border-[#ECECF2] shrink-0">
                <Link href="/job-seeker/learning-paths/explore" className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#045DEF] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#0047C8]">
                  <Waypoints className="size-4" /> Eksplorasi Roadmap Lainnya
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
