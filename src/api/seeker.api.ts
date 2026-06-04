import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api.types'
import type {
  AssessmentPayload,
  DashboardResponse,
  ExpertisePayload,
  FoundationPayload,
  OnboardingStepResult,
  RoleOption,
  VisionPayload,
} from '@/types/seeker.types'

export const seekerApi = {
  foundation: (body: FoundationPayload) =>
    api.post<ApiResponse<OnboardingStepResult>>('/seeker/onboarding/foundation', body),

  expertise: (body: ExpertisePayload) =>
    api.post<ApiResponse<OnboardingStepResult>>('/seeker/onboarding/expertise', body),

  assessment: (body: AssessmentPayload) =>
    api.post<ApiResponse<OnboardingStepResult>>('/seeker/onboarding/assessment', body),

  vision: (body: VisionPayload) =>
    api.post<ApiResponse<OnboardingStepResult>>('/seeker/onboarding/vision', body),

  dashboard: () => api.get<ApiResponse<DashboardResponse>>('/seeker/dashboard'),

  roles: () => api.get<ApiResponse<RoleOption[]>>('/seeker/roles'),
}
