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
    api.post<ApiResponse<OnboardingRecordResponse>>(`${basePath}/educations`, body),

  createExperience: (body: CreateExperiencePayload) =>
    api.post<ApiResponse<OnboardingRecordResponse>>(`${basePath}/experiences`, body),

  createProject: (body: CreateProjectPayload) =>
    api.post<ApiResponse<OnboardingRecordResponse>>(`${basePath}/projects`, body),

  createCertification: (body: CreateCertificationPayload) =>
    api.post<ApiResponse<OnboardingRecordResponse>>(`${basePath}/certifications`, body),

  createSkill: (body: CreateSkillPayload) =>
    api.post<ApiResponse<OnboardingRecordResponse>>(`${basePath}/skills`, body),
}
