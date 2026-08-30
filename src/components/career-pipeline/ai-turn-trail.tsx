'use client'

import { AlertCircle, CheckCircle2, HelpCircle, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { TurnEvent, TurnType } from '@/types/career-pipeline.types'

const STALE_AFTER_MS = 15_000

/**
 * Live trail for a running JobMatcher/TalentForger pipeline — surfaces the
 * titles those graphs already emit via `get_stream_writer()` instead of
 * leaving the user with a bare spinner for the 1–5 minutes a run can take.
 * `turns` arrives already flowing through the poll `useCareerPipeline` runs
 * (see `PipelineRun.turns`), so this component only renders it.
 */
export function AITurnTrail({ turns = [], inFlight = false }: { turns?: TurnEvent[]; inFlight?: boolean }) {
  const sorted = [...turns].sort((a, b) => a.sequence - b.sequence)
  const lastTurn = sorted[sorted.length - 1]
  const stale = useStaleness(lastTurn?.timestamp, inFlight)

  if (!sorted.length) return null

  return (
    <ol aria-live="polite" className="space-y-1.5 rounded-2xl border border-[#E7E4EE] bg-white/60 p-3.5">
      {sorted.map((turn) => (
        <li key={turn.turnId} className="flex items-center gap-2.5 text-xs">
          <TurnIcon type={turn.type} active={inFlight && turn.turnId === lastTurn?.turnId} />
          <span className={cn('font-medium', turn.type === 'error' ? 'text-rose-700' : 'text-[#4A4555]')}>
            {turn.title}
          </span>
        </li>
      ))}
      {stale && (
        <li className="flex items-center gap-2.5 text-xs italic text-muted-foreground">
          <Loader2 className="size-3.5 shrink-0 animate-spin" />
          Masih memproses, mohon tunggu sebentar...
        </li>
      )}
    </ol>
  )
}

function TurnIcon({ type, active }: { type: TurnType; active: boolean }) {
  if (active && type !== 'result' && type !== 'error') {
    return <Loader2 className="size-3.5 shrink-0 animate-spin text-primary" />
  }
  if (type === 'result') return <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" />
  if (type === 'error') return <AlertCircle className="size-3.5 shrink-0 text-rose-600" />
  if (type === 'question') return <HelpCircle className="size-3.5 shrink-0 text-amber-600" />
  return <CheckCircle2 className="size-3.5 shrink-0 text-[#C7C2D4]" />
}

/** True once the most recent turn has gone quiet for a while during an
 * in-flight run — `explain_matches`'s per-match LLM loop, for one, can go
 * quiet for tens of seconds without a new turn arriving. */
function useStaleness(lastTimestamp: string | undefined, inFlight: boolean): boolean {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!inFlight || !lastTimestamp) return
    const timer = window.setInterval(() => setNow(Date.now()), 2_000)
    return () => window.clearInterval(timer)
  }, [inFlight, lastTimestamp])

  if (!inFlight || !lastTimestamp) return false
  return now - new Date(lastTimestamp).getTime() > STALE_AFTER_MS
}
