'use client'

import { useEffect, useState } from 'react'
import { seekerApi } from '@/api/seeker.api'
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
    seekerApi
      .dashboard()
      .then((response) => {
        if (active) setState({ status: 'ready', data: response.data.data })
      })
      .catch((err) => {
        if (!active) return
        // 404 = profil belum dibuat → ditangani inline (prompt onboarding),
        // jadi jangan munculkan toast/alert untuk kasus itu.
        handleApiError(err, { silent404: true })
        setState({ status: 'error' })
      })
    return () => {
      active = false
    }
  }, [])

  return state
}
