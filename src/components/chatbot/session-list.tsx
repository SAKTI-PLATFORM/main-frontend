'use client'

import { PanelLeftClose, Search, SquarePen, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import type { ChatSession } from '@/types/chatbot.types'
import { Toast } from '@/utils/toast'
import { stripMarkdown } from './markdown'

interface SessionListProps {
  sessions: ChatSession[]
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onDelete: (id: string) => void
  onClose?: () => void
  open?: boolean
}

function preview(session: ChatSession): string {
  const last = session.messages[session.messages.length - 1]
  if (!last) return 'Belum ada pesan'
  return stripMarkdown(last.content) || last.content
}

export function SessionList({
  sessions,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onClose,
  open = true,
}: SessionListProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return sessions
    return sessions.filter(
      (session) =>
        session.title.toLowerCase().includes(term) ||
        session.messages.some((message) =>
          message.content.toLowerCase().includes(term),
        ),
    )
  }, [sessions, query])

  return (
    <aside 
      className={cn(
        "hidden shrink-0 flex-col bg-white transition-all duration-300 ease-in-out md:flex overflow-hidden",
        open ? "w-[300px] border-r border-[#ECECF2]" : "w-0 border-r-0 border-transparent"
      )}
    >
      <div className="flex h-full w-[300px] flex-col">
        <div className="flex items-center justify-between gap-2 px-5 pb-3 pt-5">
          <h1 className="font-heading text-[19px] font-bold tracking-[-0.01em] text-[#1F1F27]">
            Sesi Chat Sakti
          </h1>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onNew}
              title="Chat baru"
              aria-label="Chat baru"
              className="flex size-8 items-center justify-center rounded-lg text-[#8E8E9C] transition-colors hover:bg-[#F4F3FB] hover:text-[#4138D8]"
            >
              <SquarePen className="size-[18px]" />
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                title="Tutup sesi chat"
                className="flex size-8 items-center justify-center rounded-lg text-[#8E8E9C] transition-colors hover:bg-[#F4F3FB] hover:text-[#4138D8]"
              >
                <PanelLeftClose className="size-[18px]" />
              </button>
            )}
          </div>
        </div>

        <div className="px-5 pb-3">
          <div className="relative">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type to search"
              className="h-10 w-full rounded-lg border border-[#E6E6EF] bg-white pl-3.5 pr-9 text-[13px] text-[#33333E] outline-none transition-colors placeholder:text-[#A9A9B8] focus:border-[#B8AEF5]"
            />
            <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#B6B6C4]" />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-5 py-6 text-[13px] leading-5 text-[#A9A9B8]">
              {sessions.length === 0
                ? 'Belum ada percakapan. Mulai chat baru untuk bertanya ke SAKTI AI.'
                : 'Tidak ada sesi yang cocok dengan pencarianmu.'}
            </p>
          ) : (
            filtered.map((session) => {
              const active = session.id === activeId
              return (
                <div
                  key={session.id}
                  className={cn(
                    'group relative border-b border-l-2 border-[#F0F0F5] transition-colors',
                    active
                      ? 'border-l-[#4138D8] bg-[#F7F6FF]'
                      : 'border-l-transparent hover:bg-[#FAFAFC]',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(session.id)}
                    className="block w-full px-5 py-4 pr-9 text-left"
                  >
                    <p
                      className={cn(
                        'truncate text-[14px] font-semibold',
                        active ? 'text-[#4138D8]' : 'text-[#2B2B36]',
                      )}
                    >
                      {session.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[12.5px] leading-5 text-[#8E8E9E]">
                      {preview(session)}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(session.id)
                      Toast.info('Sesi chat dihapus')
                    }}
                    title="Hapus sesi"
                    aria-label="Hapus sesi"
                    className="absolute right-2.5 top-3.5 flex size-7 items-center justify-center rounded-md text-[#B4B4C2] opacity-0 transition-all hover:bg-white hover:text-rose-500 focus-visible:opacity-100 group-hover:opacity-100"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </aside>
  )
}
