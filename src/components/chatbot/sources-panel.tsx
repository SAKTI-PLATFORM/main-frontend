'use client'

import { ChevronDown, ExternalLink, Globe } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { ChatContextItem, ChatSource } from '@/types/chatbot.types'

/** Real URL when the model gave one, else a web search for the reference. */
function sourceHref(source: ChatSource): string {
  if (source.url) return source.url
  const query = [source.site, source.title].filter(Boolean).join(' ')
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`
}

function sourceHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

interface SourcesPanelProps {
  sources: ChatSource[]
  context: ChatContextItem[]
  /** No assistant reply selected yet (empty conversation / still sending). */
  hasReply: boolean
  sourcesOpen: boolean
  contextOpen: boolean
  onToggleSources: () => void
  onToggleContext: () => void
}

export function SourcesPanel({
  sources,
  context,
  hasReply,
  sourcesOpen,
  contextOpen,
  onToggleSources,
  onToggleContext,
}: SourcesPanelProps) {
  return (
    <aside className="hidden shrink-0 py-5 pr-5 xl:block xl:w-[392px]">
      <div className="overflow-hidden rounded-2xl border border-[#ECECF2] bg-white shadow-[0_4px_24px_rgba(20,21,29,0.04)]">
        <button
          type="button"
          onClick={onToggleSources}
          className="flex w-full items-center justify-between px-5 py-4"
        >
          <span className="text-[15px] font-semibold text-[#26262F]">Sumber</span>
          <span className="flex items-center gap-2 text-[13px] text-[#9A9AAB]">
            {sources.length}
            <ChevronDown
              className={cn(
                'size-4 transition-transform',
                !sourcesOpen && '-rotate-90',
              )}
            />
          </span>
        </button>

        {sourcesOpen && (
          <div className="border-t border-[#F0F0F5] px-5 py-4">
            {sources.length === 0 ? (
              <p className="text-[12px] leading-5 text-[#9A9AAB]">
                {hasReply
                  ? 'Jawaban ini tidak memakai rujukan eksternal.'
                  : 'Kirim pertanyaan untuk melihat sumber yang dipakai SAKTI AI.'}
              </p>
            ) : (
              <div className="-mx-2 space-y-0.5">
                {sources.map((source, index) => (
                  <a
                    key={`${source.site}-${index}`}
                    href={sourceHref(source)}
                    target="_blank"
                    rel="noreferrer"
                    className="group block rounded-lg px-2 py-2 transition-colors hover:bg-[#F7F6FF]"
                  >
                    <div className="flex items-center gap-1.5">
                      <Globe className="size-3.5 shrink-0 text-[#9A9AAB] group-hover:text-[#4138D8]" />
                      <span className="text-[13px] font-medium text-[#3A3A46] group-hover:text-[#4138D8]">
                        {source.site}
                      </span>
                      <ExternalLink className="size-3 shrink-0 text-[#C2C2CE] group-hover:text-[#4138D8]" />
                    </div>
                    {source.title && source.title !== source.site && (
                      <p className="mt-1 text-[12px] font-medium text-[#5B5B6B]">
                        {source.title}
                      </p>
                    )}
                    {source.description && (
                      <p className="mt-1 text-[12px] leading-5 text-[#9A9AAB]">
                        {source.description}
                      </p>
                    )}
                    <p className="mt-1 truncate text-[11px] text-[#B4B4C2]">
                      {source.url ? sourceHost(source.url) : 'Cari di web'}
                    </p>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onToggleContext}
          className="flex w-full items-center justify-between border-t border-[#F0F0F5] px-5 py-3.5"
        >
          <span className="flex items-center gap-2">
            <Image
              src="/logo-mark.png"
              alt=""
              width={512}
              height={512}
              className="size-4"
            />
            <span className="text-[13px] font-medium text-[#4138D8]">
              Konteks SAKTI AI
            </span>
          </span>
          <span className="flex items-center gap-2 text-[13px] text-[#9A9AAB]">
            {context.length}
            <ChevronDown
              className={cn(
                'size-4 transition-transform',
                !contextOpen && '-rotate-90',
              )}
            />
          </span>
        </button>

        {contextOpen && (
          <div className="border-t border-[#F0F0F5] px-5 py-4">
            {context.length === 0 ? (
              <p className="text-[12px] leading-5 text-[#9A9AAB]">
                Belum ada konteks khusus untuk jawaban ini.
              </p>
            ) : (
              <ul className="space-y-3">
                {context.map((item, index) => (
                  <li key={`${item.label}-${index}`}>
                    {item.label && (
                      <p className="text-[12px] font-medium text-[#3A3A46]">
                        {item.label}
                      </p>
                    )}
                    {item.description && (
                      <p className="mt-0.5 text-[12px] leading-5 text-[#9A9AAB]">
                        {item.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
