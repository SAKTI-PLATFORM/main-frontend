export type AiPipelineStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'
export type AiPipelineType = 'JOB_MATCHER' | 'TALENT_FORGER'

export interface CareerCandidateRole {
  role_id: string
  role_name: string
  role_category: string
  role_level: string
  description: string
  required_skills: string[]
  nice_to_have_skills: string[]
  riasec_ideal: string | null
  min_experience_months: number
}

export interface CareerMatchResult {
  match_id: string
  user_id: string
  role_id: string
  role_name: string
  total_match_score: number
  match_reason: string
  created_at: string
}

export interface CareerMatchScore {
  match_id: string
  skill_match_score: number
  experience_project_score: number
  education_score: number
  riasec_fit_score: number
  ocean_workstyle_score: number
  preference_score: number
}

export interface CareerSkillGap {
  gap_id: string
  match_id: string
  skill_name: string
  /** 0-100 proficiency score of the user today. */
  current_level: number
  /** 0-100 proficiency score the role demands. */
  required_level: number
  /** max(0, required_level - current_level). */
  gap_score: number
  priority: string
  reason: string
}

export interface CareerJobPosting {
  title: string
  company: string
  location: string
  url: string
}

export interface JobMatcherResult {
  candidate_roles: CareerCandidateRole[]
  active_job_postings: CareerJobPosting[]
  career_match_results: CareerMatchResult[]
  career_match_score_details: CareerMatchScore[]
  skill_gap_results: CareerSkillGap[]
}

export interface LearningPathResult {
  learning_path_id: string
  match_id: string
  target_role: string
  learning_path_type: string
  estimated_duration_weeks: number
  created_at: string
}

export interface LearningPathStepResult {
  step_id: string
  learning_path_id: string
  gap_id: string | null
  step_order: number
  week: number
  topic: string
  objective: string
  related_skill_name: string
}

export interface LearningResourceResult {
  resource_id: string
  skill_name: string
  resource_title: string
  resource_type: string
  provider: string
  difficulty_level: string
  estimated_duration_hours: number
  url: string
  language?: string
  is_free?: boolean
  summary?: string
}

export interface ResourceRecommendationResult {
  recommendation_id: string
  step_id: string
  resource_id: string
  recommendation_reason: string
  priority_order: number
}

export interface TalentForgerResult {
  learning_paths: LearningPathResult[]
  learning_path_steps: LearningPathStepResult[]
  learning_resources: LearningResourceResult[]
  free_materials: LearningResourceResult[]
  resource_recommendations: ResourceRecommendationResult[]
}

/** A scraped job listing stored in `career_job_posting`. */
export interface JobPosting {
  id: string
  title: string
  company: string
  location: string
  url: string
}

export interface JobPostingList {
  postings: JobPosting[]
  /** Distinct postings matching the search, before the `limit` cap. */
  total: number
}

export interface JobSalary {
  /** Monthly gross in IDR, or null when undisclosed / unknown. */
  min: number | null
  max: number | null
  currency: string
  period: 'month' | 'year' | 'hour'
  /** false → show "Dirahasiakan". */
  disclosed: boolean
}

export interface RelatedJob {
  id: string
  title: string
  company: string
  location: string
  url: string
  work_arrangement: string | null
  salary: JobSalary
  blurb: string
}

export interface JobPostingDetail {
  id: string
  title: string
  company: string
  location: string
  url: string
  /** "remote" | "hybrid" | "onsite" | null. */
  work_arrangement: string | null
  /** "full_time" | "part_time" | "contract" | "internship" | "freelance" | null. */
  employment_type: string | null
  /** "domestic" | "international" | null. */
  posting_scope: string | null
  job_field: string | null
  /** "Lead" | "Senior" | "Junior" | "Internship" | null. */
  seniority: string | null
  category: string | null
  salary: JobSalary
  /** "male" | "female" | "any" | null. */
  gender_requirement: string | null
  tags: string[]
  match: { score: number | null; reason: string | null }
  description: string | null
  qualifications: string[]
  additional_info: string | null
  related: RelatedJob[]
}

export interface LeaderboardEntry {
  user_id: string
  name: string
  xp: number
  days_streak: number
  rank: number
  is_current_user: boolean
}

export interface LeaderboardResponse {
  /** Top entries, rank ascending. */
  entries: LeaderboardEntry[]
  /** The current user's entry — may also appear in `entries`. */
  me: LeaderboardEntry | null
  total_participants: number
  xp_per_step: number
}

/** Per-user completion state for the saved roadmap of one career match. */
export interface RoadmapProgress {
  match_id: string
  /** Null until the roadmap has been generated. */
  pipeline_run_id: string | null
  total_steps: number
  completed_steps: number
  percent: number
  /** `step_id`s the user has ticked off, ordered as the roadmap lists them. */
  completed_step_ids: string[]
  updated_at: string | null
}

export type TurnType = 'processing' | 'question' | 'result' | 'error'
export type TurnStatus = 'in_progress' | 'waiting_input' | 'done' | 'failed'

/** One step of the Turn Title System's live trail — see AITurnTrail. */
export interface TurnEvent {
  turnId: string
  sequence: number
  title: string
  type: TurnType
  status: TurnStatus
  timestamp: string
}

export interface PipelineRun<T> {
  pipelineRunId: string
  type: AiPipelineType
  /** Null for JOB_MATCHER; the career match this roadmap belongs to otherwise. */
  matchId: string | null
  status: AiPipelineStatus
  attempt: number
  errorMessage: string | null
  createdAt: string
  startedAt: string | null
  finishedAt: string | null
  result: T | null
  /** Turn trail: live while RUNNING, persisted once COMPLETED. */
  turns?: TurnEvent[]
}
