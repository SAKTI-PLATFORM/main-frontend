'use client'

import { useCallback, useEffect, useState } from 'react'
import { seekerApi } from '@/api/seeker.api'
import type { RoadmapProgress } from '@/types/career-pipeline.types'
import { handleApiError } from '@/utils/api-error'

export interface UseRoadmapProgress {
  progress: RoadmapProgress | null
  /** `step_id`s currently marked done (optimistic — updates before the server). */
  completed: Set<string>
  totalSteps: number
  completedSteps: number
  percent: number
  /** Percent gained since this roadmap view opened. Never negative. */
  sessionGain: number
  /** A step toggle request is in flight. */
  saving: boolean
  toggleStep: (stepId: string, next: boolean) => void
}

interface ProgressState {
  /** `sessionId::matchId` the data below belongs to — stale once it drifts. */
  key: string
  progress: RoadmapProgress | null
  completed: Set<string>
  /** Percent at first load, for the "Naik X%" pill. */
  baseline: number | null
}

const EMPTY: ProgressState = {
  key: '',
  progress: null,
  completed: new Set(),
  baseline: null,
}

/**
 * Owns the per-user completion state for one roadmap. Fetches once per
 * session/match, toggles optimistically, and rolls back on failure. All of it
 * lives in a single keyed state object so switching roadmaps (the route param
 * changing without a remount) never shows the previous roadmap's progress.
 */
export function useRoadmapProgress(
  sessionId: string | null,
  matchId: string,
  enabled: boolean,
): UseRoadmapProgress {
  const [state, setState] = useState<ProgressState>(EMPTY)
  const [saving, setSaving] = useState(false)

  const target =
    enabled && sessionId && matchId ? `${sessionId}::${matchId}` : ''

  useEffect(() => {
    if (!target || !sessionId) return
    let alive = true
    void seekerApi
      .getRoadmapProgress(sessionId, matchId)
      .then((res) => {
        if (!alive) return
        const next = res.data.data
        setState({
          key: target,
          progress: next,
          completed: new Set(next.completed_step_ids),
          baseline: next.percent,
        })
      })
      .catch(handleApiError)
    return () => {
      alive = false
    }
  }, [target, sessionId, matchId])

  const toggleStep = useCallback(
    (stepId: string, next: boolean) => {
      if (!target || !sessionId) return
      const flip = (on: boolean) =>
        setState((prev) => {
          if (prev.key !== target) return prev
          const draft = new Set(prev.completed)
          if (on) draft.add(stepId)
          else draft.delete(stepId)
          return { ...prev, completed: draft }
        })

      flip(next)
      setSaving(true)
      void seekerApi
        .setRoadmapStepProgress(sessionId, matchId, stepId, next)
        .then((res) => {
          const server = res.data.data
          setState((prev) =>
            prev.key === target
              ? {
                  key: target,
                  progress: server,
                  completed: new Set(server.completed_step_ids),
                  baseline: prev.baseline ?? server.percent,
                }
              : prev,
          )
        })
        .catch((error) => {
          flip(!next) // roll back
          handleApiError(error)
        })
        .finally(() => setSaving(false))
    },
    [target, sessionId, matchId],
  )

  const fresh = target !== '' && state.key === target
  const progress = fresh ? state.progress : null
  const completed = fresh ? state.completed : new Set<string>()
  const baseline = fresh ? state.baseline : null

  const totalSteps = progress?.total_steps ?? 0
  const completedSteps = completed.size
  const percent =
    totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100)
  const sessionGain =
    baseline === null ? 0 : Math.max(0, percent - baseline)

  return {
    progress,
    completed,
    totalSteps,
    completedSteps,
    percent,
    sessionGain,
    saving,
    toggleStep,
  }
}
