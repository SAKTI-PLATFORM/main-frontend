'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { chatbotApi } from '@/api/chatbot.api'
import type { ChatMessage, ChatSession } from '@/types/chatbot.types'
import { handleApiError } from '@/utils/api-error'

const STORAGE_KEY = 'sakti:chat-sessions'

function uid(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`
  }
}

function deriveTitle(content: string): string {
  const firstLine = content.trim().split('\n')[0].trim()
  if (firstLine.length <= 48) return firstLine || 'Chat baru'
  return `${firstLine.slice(0, 48).trimEnd()}…`
}

function readSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ChatSession[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (session) => session && typeof session.id === 'string' && Array.isArray(session.messages),
    )
  } catch {
    return []
  }
}

export interface UseChatSessions {
  hydrated: boolean
  sessions: ChatSession[]
  activeId: string | null
  activeSession: ChatSession | null
  sending: boolean
  /** LLM-authored step titles for the loading stepper; empty until `plan` lands. */
  planSteps: string[]
  error: string | null
  selectSession: (id: string) => void
  newSession: () => void
  deleteSession: (id: string) => void
  sendMessage: (content: string) => Promise<void>
}

/**
 * localStorage-backed chat sessions. Each turn replays the whole history to
 * the backend, which is stateless — nothing is persisted server-side.
 */
export function useChatSessions(): UseChatSessions {
  const [hydrated, setHydrated] = useState(false)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [planSteps, setPlanSteps] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const sendingRef = useRef(false)

  // Ref mirrors of the latest state so `sendMessage` can resolve the target
  // session and its history synchronously — a `setSessions` updater is not
  // guaranteed to run before the `await` on the next line.
  const sessionsRef = useRef<ChatSession[]>([])
  const activeIdRef = useRef<string | null>(null)
  useEffect(() => {
    sessionsRef.current = sessions
  }, [sessions])
  useEffect(() => {
    activeIdRef.current = activeId
  }, [activeId])

  useEffect(() => {
    const stored = readSessions()
    setSessions(stored)
    setActiveId(stored[0]?.id ?? null)
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
    } catch {
      /* storage full / disabled — sessions stay in memory only */
    }
  }, [sessions, hydrated])

  const orderedSessions = useMemo(
    () => [...sessions].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [sessions],
  )

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeId) ?? null,
    [sessions, activeId],
  )

  const selectSession = useCallback((id: string) => {
    setError(null)
    setActiveId(id)
  }, [])

  const newSession = useCallback(() => {
    setError(null)
    setActiveId(null)
  }, [])

  const deleteSession = useCallback((id: string) => {
    setSessions((current) => current.filter((session) => session.id !== id))
    setActiveId((current) => {
      if (current !== id) return current
      const next = sessionsRef.current.find((session) => session.id !== id)
      return next?.id ?? null
    })
  }, [])

  const sendMessage = useCallback(async (raw: string) => {
    const content = raw.trim()
    if (!content || sendingRef.current) return

    const now = new Date().toISOString()
    const userMessage: ChatMessage = {
      id: uid(),
      role: 'user',
      content,
      createdAt: now,
    }

    // Resolve the target session + full history from the ref mirror BEFORE any
    // setState, so the request always carries the message just typed.
    const existing = sessionsRef.current.find(
      (session) => session.id === activeIdRef.current,
    )
    const targetId = existing ? existing.id : uid()
    const history: ChatMessage[] = existing
      ? [...existing.messages, userMessage]
      : [userMessage]

    if (existing) {
      setSessions((current) =>
        current.map((session) =>
          session.id === targetId
            ? {
                ...session,
                title:
                  session.messages.length === 0
                    ? deriveTitle(content)
                    : session.title,
                messages: [...session.messages, userMessage],
                updatedAt: now,
              }
            : session,
        ),
      )
    } else {
      const created: ChatSession = {
        id: targetId,
        title: deriveTitle(content),
        messages: [userMessage],
        createdAt: now,
        updatedAt: now,
      }
      setSessions((current) => [created, ...current])
    }

    activeIdRef.current = targetId
    setActiveId(targetId)
    setSending(true)
    sendingRef.current = true
    setPlanSteps([])
    setError(null)

    const turns = history.map((message) => ({
      role: message.role,
      content: message.content,
    }))

    // Fire the planning call in parallel — it usually resolves well before the
    // main answer and fills the loading stepper with real step titles. Failure
    // here is non-fatal: the stepper just keeps its generic fallback.
    void chatbotApi
      .plan(turns)
      .then((response) => {
        if (sendingRef.current) setPlanSteps(response.data.data.steps ?? [])
      })
      .catch(() => undefined)

    try {
      const response = await chatbotApi.chat(turns)
      const reply = response.data.data
      const assistantMessage: ChatMessage = {
        id: uid(),
        role: 'assistant',
        content: reply.content,
        createdAt: reply.createdAt ?? new Date().toISOString(),
        steps: reply.steps ?? [],
        sources: reply.sources ?? [],
        context: reply.context ?? [],
      }
      setSessions((current) =>
        current.map((session) =>
          session.id === targetId
            ? {
                ...session,
                messages: [...session.messages, assistantMessage],
                updatedAt: new Date().toISOString(),
              }
            : session,
        ),
      )
    } catch (err) {
      const parsed = handleApiError(err)
      setError(parsed.message)
    } finally {
      setSending(false)
      sendingRef.current = false
      setPlanSteps([])
    }
  }, [])

  return {
    hydrated,
    sessions: orderedSessions,
    activeId,
    activeSession,
    sending,
    planSteps,
    error,
    selectSession,
    newSession,
    deleteSession,
    sendMessage,
  }
}
