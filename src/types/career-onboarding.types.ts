export type OnboardingCurrentStep =
  | 'CV_UPLOAD'
  | 'IDENTITY'
  | 'OCEAN'
  | 'RIASEC'
  | 'DIVERGE_1'
  | 'CONVERGE_1'
  | 'DIVERGE_2'
  | 'CONVERGE_2'
  | 'PREFERENCE'
  | 'COMPLETE'

export type AssessmentType = 'OCEAN' | 'RIASEC'
export type DoubleDiamondPhase =
  | 'DIVERGE_1'
  | 'CONVERGE_1'
  | 'DIVERGE_2'
  | 'CONVERGE_2'
export type DoubleDiamondResponseType =
  | 'SINGLE_CHOICE'
  | 'MULTI_CHOICE'
  | 'RANKING'
  | 'SCALE'
  | 'TEXT'

export interface OnboardingSessionResponse {
  onboarding_session_id: string
  cv_id: string | null
  current_step: OnboardingCurrentStep
  profile_step: number
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED'
  onboarding_version: string
  started_at: string
  last_saved_at: string
  completed_at: string | null
}

export interface AssessmentQuestion {
  question_id: string
  question_code: string
  dimension: string
  question_text: string
  question_order: number
}

export interface AssessmentQuestionsResponse {
  assessment_type: AssessmentType
  instrument_version: string
  scale: {
    minimum: number
    maximum: number
    labels: Record<string, string>
  }
  questions: AssessmentQuestion[]
  existing_responses: Record<string, number>
}

export interface AssessmentResultResponse {
  career_profile_summary: string
  scoring_method_version: string
  reliability_note: string | null
  ocean: Record<
    | 'openness'
    | 'conscientiousness'
    | 'extraversion'
    | 'agreeableness'
    | 'neuroticism',
    number
  >
  riasec: Record<
    | 'realistic'
    | 'investigative'
    | 'artistic'
    | 'social'
    | 'enterprising'
    | 'conventional',
    number
  > & {
    dominant_code: string
  }
}

export interface DoubleDiamondOption {
  code: string
  label: string
}

export interface DoubleDiamondQuestion {
  question_id: string
  question_code: string
  question_text: string
  helper_text: string | null
  response_type: DoubleDiamondResponseType
  options: DoubleDiamondOption[]
  min_selection: number | null
  max_selection: number | null
  scale_min: number | null
  scale_max: number | null
  question_order: number
  is_required: boolean
}

export type DoubleDiamondAnswer = string | string[] | number

export interface DoubleDiamondQuestionsResponse {
  phase: DoubleDiamondPhase
  framework_version: string
  questions: DoubleDiamondQuestion[]
  existing_responses: Record<string, DoubleDiamondAnswer>
}

export interface CareerCandidate {
  code: string
  label: string
  score: number
  reason: string
}

export interface DoubleDiamondResultResponse {
  detected_fields: CareerCandidate[]
  recommended_roles: CareerCandidate[] | null
  selected_field: string | null
  selected_role: string | null
  strengths: string[]
  barriers: string[] | null
  career_summary: string | null
  work_style_summary: string | null
  readiness_summary: string | null
  confidence_score: number
  result_version: string
  generated_at: string
}
