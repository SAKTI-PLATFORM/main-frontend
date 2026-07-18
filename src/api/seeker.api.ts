import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api.types'
import type {
  CreateCertificationPayload,
  CreateEducationPayload,
  CreateExperiencePayload,
  CreateProjectPayload,
  CreateSkillPayload,
  OnboardingRecordResponse,
  ParseCvPayload,
  ParseCvResponse,
} from '@/types/seeker.types'

const basePath = '/job-seeker/onboarding'

export const seekerApi = {
  parseCv: (body: ParseCvPayload) =>
    api.post<ApiResponse<ParseCvResponse>>(`${basePath}/cv/parse`, body),

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
