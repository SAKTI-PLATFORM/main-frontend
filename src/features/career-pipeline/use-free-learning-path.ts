'use client'

import { seekerApi } from '@/api/seeker.api'
import type { PipelineRun, TalentForgerResult } from '@/types/career-pipeline.types'
import { handleApiError } from '@/utils/api-error'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

const POLL_INTERVAL_MS = 3_000

export function useFreeLearningPath(sessionId: string | null, roleSlug: string) {
  const key = sessionId && roleSlug ? `${sessionId}:${roleSlug}` : ''

  const [run, setRun] = useState<PipelineRun<TalentForgerResult> | null>(null)
  const [loadedKey, setLoadedKey] = useState('')
  const [generating, setGenerating] = useState(false)

  const fetchLatest = useCallback(async (): Promise<
    PipelineRun<TalentForgerResult> | null | undefined
  > => {
    if (!sessionId || !roleSlug) return undefined
    try {
      const response = await seekerApi.getLatestFreeLearningPath(sessionId, roleSlug)
      return response.data.data as PipelineRun<TalentForgerResult>
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) return null
      handleApiError(error)
      return undefined
    }
  }, [sessionId, roleSlug])

  // Initial load
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
    return () => { active = false }
  }, [fetchLatest, key])

  // Poll while in flight
  const pipelineRunId = run?.pipelineRunId ?? ''
  const inFlight = run?.status === 'PENDING' || run?.status === 'RUNNING'

  useEffect(() => {
    if (!sessionId || !pipelineRunId || !inFlight) return
    let active = true
    const timer = window.setInterval(() => {
      void seekerApi
        .getPipelineStatus<TalentForgerResult>(sessionId, pipelineRunId)
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

  const generate = useCallback(async () => {
    if (!sessionId || !roleSlug) return
    setGenerating(true)
    try {
      const response = await seekerApi.generateFreeLearningPath(sessionId, roleSlug)
      setRun(response.data.data as PipelineRun<TalentForgerResult>)
    } catch (error) {
      handleApiError(error)
    } finally {
      setGenerating(false)
    }
  }, [sessionId, roleSlug])

  return {
    run,
    loading: Boolean(key) && loadedKey !== key,
    generating,
    generate,
  }
}
