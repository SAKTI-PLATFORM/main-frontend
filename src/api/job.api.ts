import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api.types'
import type { Job, MatchScore } from '@/types/job.types'

export const jobApi = {
  getAll: () =>
    api.get<ApiResponse<Job[]>>('/jobs'),

  getById: (id: string) =>
    api.get<ApiResponse<Job>>(`/jobs/${id}`),

  getMatchScores: () =>
    api.get<ApiResponse<MatchScore[]>>('/jobs/match-scores'),
}
