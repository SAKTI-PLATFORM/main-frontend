'use client'

import { useEffect, useState } from 'react'
import { authApi } from '@/api/auth.api'
import type { DashboardResponse } from '@/types/seeker.types'
import { handleApiError } from '@/utils/api-error'

export type DashboardState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; data: DashboardResponse }

/** Shared loader for both the Skills and Personality dashboard pages. */
export function useDashboard(): DashboardState {
  const [state, setState] = useState<DashboardState>({ status: 'loading' })

  useEffect(() => {
    let active = true
    authApi
      .me()
      .then((response) => {
        if (!active) return
        const profile = response.data.data
        const cvParsed =
          typeof window !== 'undefined' &&
          window.localStorage.getItem('sakti:onboarding:cvParsed') === 'true'

        setState({
          status: 'ready',
          data: {
            profile: {
              fullName: profile.fullName,
              professionalHeadline: profile.professionalHeadline ?? null,
              domicile: profile.domicile ?? null,
              linkedinUrl: profile.linkedinUrl ?? null,
              profileSummary: profile.profileSummary ?? null,
              employmentStatus: null,
              educationLevel: null,
              field: null,
              targetRole: null,
            },
            employabilityScore: null,
            profileCompleteness: cvParsed ? 50 : 25,
            matchedCount: 0,
            ocean: null,
            riasec: null,
            topStrengthSkills: [],
            marketBenchmark: null,
            skillGaps: null,
            jobRecommendations: [],
            aiInsight: cvParsed
              ? {
                  narrative:
                    'CV kamu sudah diparsing dan data awal onboarding tersimpan. Tahap berikutnya adalah review, koreksi, dan lengkapi data manual agar rekomendasi karier bisa lebih akurat.',
                  marketReady: false,
                  source: 'onboarding',
                }
              : null,
          },
        })
      })
      .catch((err) => {
        if (!active) return
        handleApiError(err)
        setState({ status: 'error' })
      })
    return () => {
      active = false
    }
  }, [])

  return state
}
