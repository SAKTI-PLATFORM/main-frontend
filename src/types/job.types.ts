export interface Job {
  id: string
  title: string
  company: string
  location: string
  description: string
  requirements: string[]
  postedAt: string
}

export interface MatchScore {
  jobId: string
  score: number
  matchedSkills: string[]
  missingSkills: string[]
}
