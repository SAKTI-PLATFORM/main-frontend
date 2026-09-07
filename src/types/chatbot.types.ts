export type ChatRole = 'user' | 'assistant'

/** A reference shown in the "Sumber" panel — dynamic, one set per reply. */
export interface ChatSource {
  site: string
  title: string
  /** Official source URL when the model is confident; '' otherwise. */
  url: string
  description: string
}

/** A "Konteks SAKTI AI" entry — assumptions/context the model used. */
export interface ChatContextItem {
  label: string
  description: string
}

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: string
  steps?: string[]
  sources?: ChatSource[]
  context?: ChatContextItem[]
}

/** Reply payload returned by `POST /chatbot/chat`. */
export interface ChatReply {
  role: 'assistant'
  content: string
  createdAt: string
  steps: string[]
  sources: ChatSource[]
  context: ChatContextItem[]
}

/** One conversation, persisted client-side in localStorage. */
export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}
