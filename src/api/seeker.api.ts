import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api.types'
import type {
  CreateCertificationPayload,
  CreateEducationPayload,
  CreateExperiencePayload,
  CreateProjectPayload,
  CreateSkillPayload,
  OnboardingRecordResponse,
  ParseCvResponse,
  IdentityResponse,
  UpdateIdentityPayload,
} from '@/types/seeker.types'
import type {
  AssessmentQuestionsResponse,
  AssessmentResultResponse,
  AssessmentType,
  DoubleDiamondAnswer,
  DoubleDiamondPhase,
  DoubleDiamondQuestionsResponse,
  DoubleDiamondResultResponse,
  OnboardingSessionResponse,
} from '@/types/career-onboarding.types'

const basePath = '/job-seeker/onboarding'

export const seekerApi = {
  parseCv: (cv: File, versionNumber?: number) => {
    const body = new FormData()
    body.append('cv', cv)
    if (versionNumber) body.append('versionNumber', String(versionNumber))

    return api.post<ApiResponse<ParseCvResponse>>(`${basePath}/cv/parse`, body)
  },

  updateIdentity: (body: UpdateIdentityPayload) =>
    api.put<ApiResponse<IdentityResponse>>(`${basePath}/identity`, body),

  createEducation: (body: CreateEducationPayload) =>
    api.post<ApiResponse<OnboardingRecordResponse>>(
      `${basePath}/educations`,
      body,
    ),

  createExperience: (body: CreateExperiencePayload) =>
    api.post<ApiResponse<OnboardingRecordResponse>>(
      `${basePath}/experiences`,
      body,
    ),

  createProject: (body: CreateProjectPayload) =>
    api.post<ApiResponse<OnboardingRecordResponse>>(
      `${basePath}/projects`,
      body,
    ),

  createCertification: (body: CreateCertificationPayload) =>
    api.post<ApiResponse<OnboardingRecordResponse>>(
      `${basePath}/certifications`,
      body,
    ),

  createSkill: (body: CreateSkillPayload) =>
    api.post<ApiResponse<OnboardingRecordResponse>>(`${basePath}/skills`, body),

  createOrGetOnboarding: (cvId?: string) =>
    api.post<ApiResponse<OnboardingSessionResponse>>(basePath, { cvId }),

  getCurrentOnboarding: () =>
    api.get<ApiResponse<OnboardingSessionResponse | null>>(
      `${basePath}/current`,
    ),

  getParsedCv: (sessionId: string) =>
    api.get<ApiResponse<ParseCvResponse>>(
      `${basePath}/${sessionId}/cv/parsed`,
    ),

  saveProfileProgress: (sessionId: string, step: number) =>
    api.put<ApiResponse<OnboardingSessionResponse>>(
      `${basePath}/${sessionId}/profile/progress`,
      { step },
    ),

  completeProfile: (sessionId: string) =>
    api.post<ApiResponse<OnboardingSessionResponse>>(
      `${basePath}/${sessionId}/profile/complete`,
    ),

  getAssessmentQuestions: (sessionId: string, type: AssessmentType) =>
    api.get<ApiResponse<AssessmentQuestionsResponse>>(
      `${basePath}/${sessionId}/assessment/${type}/questions`,
    ),

  saveAssessmentResponses: (
    sessionId: string,
    type: AssessmentType,
    responses: Array<{ questionId: string; answerValue: number }>,
  ) =>
    api.put<ApiResponse<{ saved: number; saved_at: string }>>(
      `${basePath}/${sessionId}/assessment/${type}/responses`,
      { responses },
    ),

  submitAssessment: (sessionId: string, type: AssessmentType) =>
    api.post<ApiResponse<AssessmentResultResponse & { current_step: string }>>(
      `${basePath}/${sessionId}/assessment/${type}/submit`,
    ),

  getAssessmentResult: (sessionId: string) =>
    api.get<ApiResponse<AssessmentResultResponse>>(
      `${basePath}/${sessionId}/assessment/result`,
    ),

  generateDoubleDiamondQuestions: (
    sessionId: string,
    phase: DoubleDiamondPhase,
  ) =>
    api.post<ApiResponse<DoubleDiamondQuestionsResponse>>(
      `${basePath}/${sessionId}/double-diamond/${phase}/questions/generate`,
    ),

  saveDoubleDiamondResponses: (
    sessionId: string,
    phase: DoubleDiamondPhase,
    responses: Array<{ questionId: string; answer: DoubleDiamondAnswer }>,
  ) =>
    api.put<ApiResponse<{ saved: number; saved_at: string }>>(
      `${basePath}/${sessionId}/double-diamond/${phase}/responses`,
      { responses },
    ),

  submitDoubleDiamond: (
    sessionId: string,
    phase: DoubleDiamondPhase,
    selection?: string,
  ) =>
    api.post<
      ApiResponse<DoubleDiamondResultResponse & { current_step: string }>
    >(`${basePath}/${sessionId}/double-diamond/${phase}/submit`, { selection }),

  getDoubleDiamondResult: (sessionId: string) =>
    api.get<ApiResponse<DoubleDiamondResultResponse>>(
      `${basePath}/${sessionId}/double-diamond/result`,
    ),

  completeOnboarding: (sessionId: string) =>
    api.post<ApiResponse<OnboardingSessionResponse>>(
      `${basePath}/${sessionId}/complete`,
    ),
}
