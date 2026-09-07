'use client'

import {
  ChevronRight,
  LoaderCircle,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { formatTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { ChatMessage, ChatSession } from '@/types/chatbot.types'
import { Markdown } from './markdown'

const SUGGESTIONS = [
  'Apa yang perlu aku siapkan untuk mulai mencari kerja lewat SAKTI?',
  'Skill apa yang paling dicari untuk fresh graduate Teknik Informatika?',
  'Bagaimana cara menutup skill gap SQL dan Git?',
]

interface ChatThreadProps {
  session: ChatSession | null
  sending: boolean
  planSteps: string[]
  selectedAssistantId: string | null
  onPickSuggestion: (text: string) => void
  onOpenSources: (messageId: string) => void
}

export function ChatThread({
  session,
  sending,
  planSteps,
  selectedAssistantId,
  onPickSuggestion,
  onOpenSources,
}: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const messages = session?.messages ?? []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length, sending])

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
      <div className="mx-auto flex max-w-[820px] flex-col gap-6">
        {messages.length === 0 && !sending ? (
          <EmptyState onPick={onPickSuggestion} />
        ) : (
          messages.map((message) =>
            message.role === 'user' ? (
              <UserBubble key={message.id} message={message} />
            ) : (
              <AssistantMessage
                key={message.id}
                message={message}
                selected={message.id === selectedAssistantId}
                onOpenSources={onOpenSources}
              />
            ),
          )
        )}
        {sending && <LoadingSteps planSteps={planSteps} />}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

function UserBubble({ message }: { message: ChatMessage }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-[#5B3DF5] px-4 py-2.5 text-[14px] leading-[22px] text-white">
        {message.content}
      </div>
    </div>
  )
}

function AssistantMessage({
  message,
  selected,
  onOpenSources,
}: {
  message: ChatMessage
  selected: boolean
  onOpenSources: (messageId: string) => void
}) {
  const steps = message.steps ?? []
  return (
    <div className="flex flex-col gap-2">
      {steps.length > 0 && <AgenticRow steps={steps} />}
      <Markdown
        text={message.content}
        className="max-w-[94%] text-[14px] leading-[26px] text-[#33333E]"
      />
      <MetaRow
        message={message}
        selected={selected}
        onOpenSources={onOpenSources}
      />
    </div>
  )
}

function MetaRow({
  message,
  selected,
  onOpenSources,
}: {
  message: ChatMessage
  selected: boolean
  onOpenSources: (messageId: string) => void
}) {
  const [vote, setVote] = useState<'up' | 'down' | null>(null)
  const sourceCount = message.sources?.length ?? 0

  return (
    <div className="flex items-center gap-3 text-[#A9A9B8]">
      {sourceCount > 0 && (
        <button
          type="button"
          onClick={() => onOpenSources(message.id)}
          className={cn(
            'inline-flex items-center rounded-md bg-[#F1F1F5] px-2 py-1 text-[12px] font-medium text-[#7B7B8A] transition-colors hover:bg-[#EAEAF0]',
            selected && 'bg-[#EDEBFF] text-[#4138D8] ring-1 ring-[#CFC8FF]',
          )}
        >
          +{sourceCount} Sumber
        </button>
      )}
      <button
        type="button"
        aria-label="Jawaban ini membantu"
        aria-pressed={vote === 'up'}
        onClick={() => setVote((current) => (current === 'up' ? null : 'up'))}
        className={cn(
          'transition-colors hover:text-[#4138D8]',
          vote === 'up' && 'text-[#4138D8]',
        )}
      >
        <ThumbsUp className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Jawaban ini kurang membantu"
        aria-pressed={vote === 'down'}
        onClick={() => setVote((current) => (current === 'down' ? null : 'down'))}
        className={cn(
          'transition-colors hover:text-[#4138D8]',
          vote === 'down' && 'text-[#4138D8]',
        )}
      >
        <ThumbsDown className="size-4" />
      </button>
      <span className="text-[12px]">{formatTime(message.createdAt)}</span>
    </div>
  )
}

function AgenticRow({ steps }: { steps: string[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 border-t border-[#F0F0F5] pt-3 text-[13px] text-[#9A9AAB] transition-colors hover:text-[#6E6E86]"
      >
        <Sparkles className="size-3.5 shrink-0" />
        <span>Agentic AI Step by step</span>
        <span className="text-[12px] text-[#C2C2CE]">{steps.length} langkah</span>
        <ChevronRight
          className={cn(
            'size-3.5 shrink-0 transition-transform',
            open && 'rotate-90',
          )}
        />
      </button>
      {open && (
        <ol className="mt-2.5 space-y-2 pl-1">
          {steps.map((step, index) => (
            <li
              key={index}
              className="flex gap-2.5 text-[13px] leading-5 text-[#5B5B6B]"
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#EFEEFF] text-[11px] font-semibold text-[#4138D8]">
                {index + 1}
              </span>
              <span className="pt-px">{step}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

/**
 * Loading indicator while a reply generates. Two phases:
 *  1. no plan yet  → just a pulse ("...") while /chatbot/plan is in flight
 *  2. plan arrived → reveal step titles one at a time on a single line
 * The full stacked list only shows afterwards, on the finished message
 * (see AgenticRow).
 */
function LoadingSteps({ planSteps }: { planSteps: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const hasPlan = planSteps.length > 0

  useEffect(() => {
    if (!hasPlan) return
    const timer = setInterval(() => {
      setActiveIndex((current) => Math.min(current + 1, planSteps.length - 1))
    }, 1600)
    return () => clearInterval(timer)
  }, [hasPlan, planSteps.length])

  if (!hasPlan) {
    return (
      <div className="flex items-center gap-2 border-t border-[#F0F0F5] pt-3 text-[#B4B4C2]">
        <Sparkles className="size-3.5 shrink-0 text-[#C2C2CE]" />
        <span className="flex gap-1">
          <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
          <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
          <span className="size-1.5 animate-bounce rounded-full bg-current" />
        </span>
      </div>
    )
  }

  const index = Math.min(activeIndex, planSteps.length - 1)
  return (
    <div className="flex items-center gap-2.5 border-t border-[#F0F0F5] pt-3 text-[13px] leading-5">
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#EFEEFF] text-[11px] font-semibold text-[#4138D8]">
        {index + 1}
      </span>
      <LoaderCircle className="size-3.5 shrink-0 animate-spin text-[#B8AEF5]" />
      <span
        key={index}
        className="min-w-0 flex-1 truncate font-medium text-[#33333E] duration-300 animate-in fade-in-0 slide-in-from-bottom-2"
      >
        {planSteps[index]}
      </span>
      <span className="shrink-0 text-[12px] text-[#B4B4C2]">
        {index + 1}/{planSteps.length}
      </span>
    </div>
  )
}

function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <Image
        src="/logo-mark.png"
        alt=""
        width={512}
        height={512}
        className="size-11 opacity-90"
      />
      <h2 className="mt-4 font-heading text-[20px] font-bold text-[#26262F]">
        Tanya SAKTI AI soal kariermu
      </h2>
      <p className="mt-1.5 max-w-sm text-[13px] leading-5 text-[#8E8E9E]">
        Skill gap, rekomendasi kursus, estimasi gaji, atau persiapan melamar
        kerja lewat SAKTI.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onPick(suggestion)}
            className="rounded-full border border-[#E6E6EF] bg-white px-3.5 py-2 text-[12.5px] text-[#5B5B6B] transition-colors hover:border-[#B8AEF5] hover:text-[#4138D8]"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
