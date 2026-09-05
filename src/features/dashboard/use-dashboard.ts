'use client'

import { authApi } from '@/api/auth.api'
import { seekerApi } from '@/api/seeker.api'
import type {
  AssessmentResultResponse,
  DoubleDiamondResultResponse,
  OnboardingCurrentStep,
  OnboardingSessionResponse,
} from '@/types/career-onboarding.types'
import type { DashboardResponse } from '@/types/seeker.types'
import { handleApiError } from '@/utils/api-error'
import { useEffect, useState } from 'react'
import axios from 'axios'
import type {
  PipelineRun,
  JobMatcherResult,
  TalentForgerResult,
} from '@/types/career-pipeline.types'

export type DashboardState =
  | { status: 'loading' }
  | { status: 'error' }
  | {
      status: 'ready'
      data: DashboardResponse
      session: OnboardingSessionResponse | null
      assessment: AssessmentResultResponse | null
      career: DoubleDiamondResultResponse | null
      jobMatcher: PipelineRun<JobMatcherResult> | null
      learningPath: PipelineRun<TalentForgerResult> | null
    }

export function useDashboard(): DashboardState {
  const [state, setState] = useState<DashboardState>({ status: 'loading' })

  useEffect(() => {
    let active = true
    void (async () => {
      try {
        const [profileResponse, sessionResponse] = await Promise.all([
          authApi.me(),
          seekerApi.getCurrentOnboarding(),
        ])
        if (!active) return

        const profile = profileResponse.data.data
        const session = sessionResponse.data.data
        let assessment: AssessmentResultResponse | null = null
        let career: DoubleDiamondResultResponse | null = null
        let jobMatcher: PipelineRun<JobMatcherResult> | null = null
        let learningPath: PipelineRun<TalentForgerResult> | null = null

        if (session?.status === 'COMPLETED') {
          const [assessmentResponse, careerResponse] = await Promise.all([
            seekerApi.getAssessmentResult(session.onboarding_session_id),
            seekerApi.getDoubleDiamondResult(session.onboarding_session_id),
          ])
          assessment = assessmentResponse.data.data
          career = careerResponse.data.data
          // Both pipelines are enqueued by the backend after onboarding; either
          // may still be missing (404) while it runs. A 404 just means "not yet".
          const [jobMatcherResult, learningPathResult] = await Promise.all([
            seekerApi
              .getLatestJobMatches(session.onboarding_session_id)
              .then((response) => response.data.data)
              .catch(tolerate404<PipelineRun<JobMatcherResult>>()),
            seekerApi
              .getLatestLearningPath(session.onboarding_session_id)
              .then((response) => response.data.data)
              .catch(tolerate404<PipelineRun<TalentForgerResult>>()),
          ])
          jobMatcher = jobMatcherResult
          learningPath = learningPathResult
        }
        if (!active) return

        const confidence = career
          ? normalizeConfidence(career.confidence_score)
          : null
        const data: DashboardResponse = {
          profile: {
            fullName: profile.fullName,
            professionalHeadline: profile.professionalHeadline ?? null,
            domicile: profile.domicile ?? null,
            linkedinUrl: profile.linkedinUrl ?? null,
            profileSummary: profile.profileSummary ?? null,
            employmentStatus: null,
            educationLevel: null,
            field: career?.selected_field ?? null,
            targetRole: resolvedTargetRole(career),
          },
          employabilityScore: confidence,
          profileCompleteness: onboardingProgress(session),
          matchedCount:
            jobMatcher?.status === 'COMPLETED'
              ? (jobMatcher.result?.career_match_results.length ?? 0)
              : 0,
          ocean: assessment
            ? {
                scores: {
                  O: assessment.ocean.openness,
                  C: assessment.ocean.conscientiousness,
                  E: assessment.ocean.extraversion,
                  A: assessment.ocean.agreeableness,
                  N: assessment.ocean.neuroticism,
                },
                traitConfidence: {
                  O: confidence ?? 100,
                  C: confidence ?? 100,
                  E: confidence ?? 100,
                  A: confidence ?? 100,
                  N: confidence ?? 100,
                },
                confidence: confidence ?? 100,
              }
            : null,
          riasec: assessment
            ? {
                scores: {
                  R: assessment.riasec.realistic,
                  I: assessment.riasec.investigative,
                  A: assessment.riasec.artistic,
                  S: assessment.riasec.social,
                  E: assessment.riasec.enterprising,
                  C: assessment.riasec.conventional,
                },
                hollandCode: assessment.riasec.dominant_code,
              }
            : null,
          topStrengthSkills:
            career?.strengths.map((name) => ({
              name,
              category: 'Hasil onboarding',
              hoursEstimate: null,
            })) ?? [],
          marketBenchmark: null,
          skillGaps: null,
          jobRecommendations: [],
          aiInsight: career
            ? {
                narrative:
                  career.career_summary ??
                  assessment?.career_profile_summary ??
                  'Onboarding telah selesai.',
                marketReady: true,
                source: 'onboarding',
              }
            : session
              ? {
                  narrative: `Progress tersimpan. Lanjutkan dari tahap ${stepLabel(session.current_step)} tanpa mengulang dari awal.`,
                  marketReady: false,
                  source: 'onboarding',
                }
              : null,
        }

        setState({
          status: 'ready',
          data,
          session,
          assessment,
          career,
          jobMatcher,
          learningPath,
        })
      } catch (error) {
        if (!active) return
        handleApiError(error)
        setState({ status: 'error' })
      }
    })()
    return () => {
      active = false
    }
  }, [])

  return state
}

/** Swallow a 404 from an optional pipeline fetch, rethrow anything else. */
function tolerate404<T>(): (error: unknown) => T | null {
  return (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null
    throw error
  }
}

const STEP_PROGRESS: Record<OnboardingCurrentStep, number> = {
  CV_UPLOAD: 5,
  IDENTITY: 15,
  OCEAN: 35,
  RIASEC: 45,
  DIVERGE_1: 55,
  CONVERGE_1: 65,
  DIVERGE_2: 75,
  CONVERGE_2: 85,
  PREFERENCE: 95,
  COMPLETE: 100,
}

function onboardingProgress(session: OnboardingSessionResponse | null): number {
  if (!session) return 0
  if (session.status === 'COMPLETED') return 100
  if (session.current_step === 'IDENTITY') {
    return 10 + Math.round((Math.max(session.profile_step, 1) / 7) * 20)
  }
  return STEP_PROGRESS[session.current_step]
}

function normalizeConfidence(value: number): number {
  return Math.round((value <= 1 ? value * 100 : value) * 100) / 100
}

function resolvedTargetRole(career: DoubleDiamondResultResponse | null): string | null {
  const selectedRole = career?.selected_role?.trim()
  if (selectedRole && !isConfirmationAnswer(selectedRole)) return selectedRole
  return career?.recommended_roles?.[0]?.label ?? null
}

function isConfirmationAnswer(value: string): boolean {
  return /^(ya|iya|tidak|setuju|saya setuju|sangat setuju|sesuai|sudah sesuai)\b/i.test(
    value.trim(),
  )
}

function stepLabel(step: OnboardingCurrentStep): string {
  return (
    {
      CV_UPLOAD: 'unggah CV',
      IDENTITY: 'review profil CV',
      OCEAN: 'assessment OCEAN',
      RIASEC: 'assessment RIASEC',
      DIVERGE_1: 'Double Diamond — eksplorasi bidang',
      CONVERGE_1: 'Double Diamond — pemilihan bidang',
      DIVERGE_2: 'Double Diamond — eksplorasi role',
      CONVERGE_2: 'Double Diamond — pemilihan role',
      PREFERENCE: 'ringkasan dan preferensi akhir',
      COMPLETE: 'selesai',
    } satisfies Record<OnboardingCurrentStep, string>
  )[step]
}
