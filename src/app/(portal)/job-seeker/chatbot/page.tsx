'use client'

import { ChevronRight, PanelLeftOpen } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { ChatComposer, type ChatComposerHandle } from '@/components/chatbot/chat-composer'
import { ChatThread } from '@/components/chatbot/chat-thread'
import { SessionList } from '@/components/chatbot/session-list'
import { SourcesPanel } from '@/components/chatbot/sources-panel'
import { Sidebar } from '@/components/dashboard/sidebar'
import { useChatSessions } from '@/features/chatbot/use-chat-sessions'

export default function ChatbotPage() {
  const chat = useChatSessions()
  const composerRef = useRef<ChatComposerHandle>(null)
  const [sessionListOpen, setSessionListOpen] = useState(true)

  // The panel is an accordion: opening "Sumber" collapses "Konteks SAKTI AI"
  // and vice versa. null = both collapsed.
  const [openPanel, setOpenPanel] = useState<'sources' | 'context' | null>(
    'sources',
  )
  // Which reply's sources are pinned in the panel, scoped to its session so
  // switching conversations falls back to "newest reply" without an effect.
  const [pinned, setPinned] = useState<{
    sessionId: string
    messageId: string
  } | null>(null)

  const title = chat.activeSession?.title ?? 'Percakapan baru'

  const assistantMessages = useMemo(
    () =>
      (chat.activeSession?.messages ?? []).filter(
        (message) => message.role === 'assistant',
      ),
    [chat.activeSession],
  )

  const pinnedId =
    pinned && pinned.sessionId === chat.activeId ? pinned.messageId : null
  const selectedAssistant =
    assistantMessages.find((message) => message.id === pinnedId) ??
    assistantMessages[assistantMessages.length - 1] ??
    null

  function handleNew() {
    chat.newSession()
    composerRef.current?.focus()
  }

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-white text-[#26262F]">
      <Sidebar />

      <SessionList
        open={sessionListOpen}
        sessions={chat.sessions}
        activeId={chat.activeId}
        onSelect={chat.selectSession}
        onNew={handleNew}
        onDelete={chat.deleteSession}
        onClose={() => setSessionListOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <nav
          aria-label="Breadcrumb"
          className="flex h-14 shrink-0 items-center gap-1.5 px-4 text-[13px] sm:px-8"
        >
          {!sessionListOpen && (
            <button 
              onClick={() => setSessionListOpen(true)}
              className="mr-2 flex size-7 items-center justify-center rounded-md text-[#8E8E9C] transition-colors hover:bg-[#F4F3FB] hover:text-[#4138D8]"
              title="Buka sesi chat"
            >
              <PanelLeftOpen className="size-4" />
            </button>
          )}
          <span className="text-[#9A9AAB]">Overview</span>
          <ChevronRight className="size-3.5 text-[#C7C7D2]" />
          <span className="text-[#9A9AAB]">Sakti Chatbot</span>
          <ChevronRight className="size-3.5 text-[#C7C7D2]" />
          <span className="truncate font-medium text-[#3A3A46]">{title}</span>
        </nav>

        <ChatThread
          session={chat.activeSession}
          sending={chat.sending}
          planSteps={chat.planSteps}
          selectedAssistantId={selectedAssistant?.id ?? null}
          onPickSuggestion={chat.sendMessage}
          onOpenSources={(messageId) => {
            if (chat.activeId) {
              setPinned({ sessionId: chat.activeId, messageId })
            }
            setOpenPanel('sources')
          }}
        />

        <ChatComposer
          ref={composerRef}
          onSend={chat.sendMessage}
          disabled={chat.sending}
          error={chat.error}
        />
      </div>

      <SourcesPanel
        sources={selectedAssistant?.sources ?? []}
        context={selectedAssistant?.context ?? []}
        hasReply={selectedAssistant !== null}
        sourcesOpen={openPanel === 'sources'}
        contextOpen={openPanel === 'context'}
        onToggleSources={() =>
          setOpenPanel((open) => (open === 'sources' ? null : 'sources'))
        }
        onToggleContext={() =>
          setOpenPanel((open) => (open === 'context' ? null : 'context'))
        }
      />
    </div>
  )
}
