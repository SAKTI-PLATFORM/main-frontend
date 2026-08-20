'use client'

import { seekerApi } from '@/api/seeker.api'
import type {
  JobMatcherResult,
  PipelineRun,
  TalentForgerResult,
} from '@/types/career-pipeline.types'
import { handleApiError } from '@/utils/api-error'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

type PipelineKind = 'job-matcher' | 'talent-forger'
type PipelineResult = JobMatcherResult | TalentForgerResult

export function useCareerPipeline<T extends PipelineResult>(
  sessionId: string | null,
  kind: PipelineKind,
) {
  const [run, setRun] = useState<PipelineRun<T> | null>(null)
  const [loading, setLoading] = useState(Boolean(sessionId))
  const [generating, setGenerating] = useState(false)

  const loadLatest = useCallback(async () => {
    if (!sessionId) return
    try {
      const response =
        kind === 'job-matcher'
          ? await seekerApi.getLatestJobMatches(sessionId)
          : await seekerApi.getLatestLearningPath(sessionId)
      setRun(response.data.data as PipelineRun<T>)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setRun(null)
      } else {
        handleApiError(error)
      }
    } finally {
      setLoading(false)
    }
  }, [kind, sessionId])

  useEffect(() => {
    void loadLatest()
  }, [loadLatest])

  useEffect(() => {
    if (
      kind !== 'talent-forger' ||
      !sessionId ||
      loading ||
      run
    ) {
      return
    }
    const timer = window.setInterval(() => void loadLatest(), 2_000)
    return () => window.clearInterval(timer)
  }, [kind, loadLatest, loading, run, sessionId])

  useEffect(() => {
    if (!sessionId || !run || !['PENDING', 'RUNNING'].includes(run.status)) {
      return
    }
    const timer = window.setInterval(() => {
      void seekerApi
        .getPipelineStatus<T>(sessionId, run.pipelineRunId)
        .then((response) => setRun(response.data.data))
        .catch(handleApiError)
    }, 2_000)
    return () => window.clearInterval(timer)
  }, [run, sessionId])

  const generate = useCallback(
    async (matchId?: string) => {
      if (!sessionId) return
      setGenerating(true)
      try {
        const response =
          kind === 'job-matcher'
            ? await seekerApi.generateJobMatches(sessionId)
            : await seekerApi.generateLearningPath(sessionId, matchId ?? '')
        setRun(response.data.data as PipelineRun<T>)
      } catch (error) {
        handleApiError(error)
      } finally {
        setGenerating(false)
      }
    },
    [kind, sessionId],
  )

  return { run, loading, generating, generate, reload: loadLatest }
}
