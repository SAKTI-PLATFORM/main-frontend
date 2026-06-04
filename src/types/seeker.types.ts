export type Gender = 'male' | 'female'
export type EmploymentStatus = 'fresh_grad' | 'working' | 'unemployed' | 'freelance'
export type EducationLevel = 'SMA' | 'D3' | 'S1' | 'S2' | 'S3'
export type FieldOfInterest =
  | 'teknologi'
  | 'keuangan'
  | 'kesehatan'
  | 'pendidikan'
  | 'manufaktur'
  | 'kreatif'
  | 'lainnya'
export type ToolsExperience = '0-6m' | '6-12m' | '1-2y' | '2-3y' | '3-5y' | '>5y'
export type WorkMode = 'remote' | 'hybrid' | 'onsite' | 'flexible'
export type CompanyType =
  | 'startup'
  | 'korporasi'
  | 'bumn'
  | 'instansi_pemerintah'
  | 'ngo'
  | 'umkm'
export type JobType = 'full_time' | 'part_time' | 'contract' | 'freelance' | 'magang'

export type OceanTraitKey = 'O' | 'C' | 'E' | 'A' | 'N'
export type RiasecTypeKey = 'R' | 'I' | 'A' | 'S' | 'E' | 'C'
export type Polarity = '+' | '-'

export interface FoundationPayload {
  phoneNumber?: string
  dob?: string
  gender: Gender
  employmentStatus: EmploymentStatus
  educationLevel: EducationLevel
  field: FieldOfInterest
}

export interface ToolExperienceEntry {
  name: string
  experience?: ToolsExperience
}

export interface ExpertisePayload {
  tools: ToolExperienceEntry[]
  knowledgeAreas: string[]
  softSkillsRanked: string[]
}

export interface OceanResponse {
  trait: OceanTraitKey
  polarity: Polarity
  value: number
}

export interface RiasecResponse {
  item: number
  letter?: RiasecTypeKey
  agreed: boolean
}

export interface AssessmentPayload {
  oceanResponses: OceanResponse[]
  riasecResponses: RiasecResponse[]
}

export interface VisionPayload {
  targetRole: string
  workModes: WorkMode[]
  salaryMin?: number
  salaryMax?: number
  companyTypes: CompanyType[]
  jobTypes: JobType[]
}

export type OnboardingStep =
  | 'foundation'
  | 'expertise'
  | 'assessment'
  | 'vision'

export interface OnboardingStepResult {
  step: OnboardingStep
  profileCompleteness: number
}

export type OceanScores = Record<OceanTraitKey, number>
export type RiasecScores = Record<RiasecTypeKey, number>

export interface BenchmarkBar {
  skill: string
  marketDemand: number
  yourScore: number
}

export interface SkillHighlight {
  skill: string
  score: number
}

export interface Benchmark {
  role: string
  bars: BenchmarkBar[]
  potentialSkill: SkillHighlight | null
  developmentArea: SkillHighlight | null
}

export interface CourseRef {
  title: string
  provider: string
  url: string
  cost: string
}

export interface SkillGap {
  skill: string
  priority: 'high' | 'medium' | 'low'
  currentHours: number
  targetHours: number
  gapHours: number
  course: CourseRef | null
}

export interface SkillGapResult {
  role: string
  totalGapHours: number
  gaps: SkillGap[]
}

export type MatchStatus = 'matched' | 'rise' | 'no_match'

export interface JobRecommendation {
  jobId: string
  title: string
  company: string | null
  totalScore: number
  status: MatchStatus
  autoApplied: boolean
  breakdown: {
    skill: number
    education: number
    experience: number
    location: number
    preference: number
    oceanBonus: number
    riasecBonus: number
  }
  shap: Record<string, number>
}

export interface AiInsight {
  narrative: string
  marketReady: boolean
  source: string
}

export interface RoleOption {
  id: string
  name: string
  hollandCode: string
}

export interface DashboardResponse {
  profile: {
    fullName: string
    employmentStatus: string | null
    educationLevel: string | null
    field: string | null
    targetRole: string | null
  }
  employabilityScore: number | null
  profileCompleteness: number
  matchedCount: number
  ocean: {
    scores: OceanScores
    traitConfidence: OceanScores
    confidence: number
  } | null
  riasec: {
    scores: RiasecScores
    hollandCode: string
  } | null
  topStrengthSkills: Array<{
    name: string
    category: string
    hoursEstimate: number | null
  }>
  marketBenchmark: Benchmark | null
  skillGaps: SkillGapResult | null
  jobRecommendations: JobRecommendation[]
  aiInsight: AiInsight | null
}
