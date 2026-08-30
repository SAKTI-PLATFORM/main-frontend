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

const POLL_INTERVAL_MS = 2_000

interface UseCareerPipelineOptions {
  /** talent-forger only: the career match whose saved roadmap we want. */
  matchId?: string
  /** Keep asking for a run the backend enqueues on its own after JobMatcher. */
  pollWhenMissing?: boolean
}

export function useCareerPipeline<T extends PipelineResult>(
  sessionId: string | null,
  kind: PipelineKind,
  options: UseCareerPipelineOptions = {},
) {
  const { matchId = '', pollWhenMissing = false } = options
  // One fetch key per thing we can read. `loadedKey` trails it until that exact
  // request resolves, and `loading` is the gap between the two — a plain
  // useState(Boolean(sessionId)) never switches back on when the session id
  // arrives a render after mount, which made every refresh flash the
  // "sedang disiapkan" notice as if the pipeline had restarted.
  const key = !sessionId
    ? ''
    : kind === 'talent-forger'
      ? matchId && `${sessionId}:${matchId}`
      : sessionId

  const [run, setRun] = useState<PipelineRun<T> | null>(null)
  const [loadedKey, setLoadedKey] = useState('')
  const [generating, setGenerating] = useState(false)

  // Resolves to the run, to null when the backend has nothing saved yet (404),
  // or to undefined on a transient failure — the caller keeps what it has
  // rather than blanking a roadmap that is still perfectly valid.
  const fetchLatest = useCallback(async (): Promise<
    PipelineRun<T> | null | undefined
  > => {
    if (!sessionId) return undefined
    try {
      const response =
        kind === 'job-matcher'
          ? await seekerApi.getLatestJobMatches(sessionId)
          : await seekerApi.getLatestLearningPath(sessionId, matchId)
      return response.data.data as PipelineRun<T>
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null
      }
      handleApiError(error)
      return undefined
    }
  }, [kind, matchId, sessionId])

  useEffect(() => {
    if (!key) {
      setRun(null)
      setLoadedKey('')
      return
    }
    let active = true
    setRun(null)
    void fetchLatest().then((next) => {
      if (!active) return
      if (next !== undefined) setRun(next)
      setLoadedKey(key)
    })
    return () => {
      active = false
    }
  }, [fetchLatest, key])

  useEffect(() => {
    if (!key || !pollWhenMissing || loadedKey !== key || run) return
    let active = true
    const timer = window.setInterval(() => {
      void fetchLatest().then((next) => {
        if (active && next) setRun(next)
      })
    }, POLL_INTERVAL_MS)
    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [fetchLatest, key, loadedKey, pollWhenMissing, run])

  // Keyed on primitives, so a status tick no longer tears down and rebuilds the
  // interval on every poll the way a dependency on the whole `run` object did.
  const pipelineRunId = run?.pipelineRunId ?? ''
  const inFlight = run?.status === 'PENDING' || run?.status === 'RUNNING'

  useEffect(() => {
    if (!sessionId || !pipelineRunId || !inFlight) return
    let active = true
    const timer = window.setInterval(() => {
      void seekerApi
        .getPipelineStatus<T>(sessionId, pipelineRunId)
        .then((response) => {
          if (active) setRun(response.data.data)
        })
        .catch(handleApiError)
    }, POLL_INTERVAL_MS)
    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [inFlight, pipelineRunId, sessionId])

  const generate = useCallback(
    async (targetMatchId?: string) => {
      if (!sessionId) return
      setGenerating(true)
      try {
        const response =
          kind === 'job-matcher'
            ? await seekerApi.generateJobMatches(sessionId)
            : await seekerApi.generateLearningPath(
                sessionId,
                targetMatchId ?? matchId,
              )
        setRun(response.data.data as PipelineRun<T>)
      } catch (error) {
        handleApiError(error)
      } finally {
        setGenerating(false)
      }
    },
    [kind, matchId, sessionId],
  )

  const reload = useCallback(async () => {
    const next = await fetchLatest()
    if (next !== undefined) setRun(next)
  }, [fetchLatest])

  return {
    run,
    loading: Boolean(key) && loadedKey !== key,
    generating,
    generate,
    reload,
  }
}
