import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api.types'
import type { ChatReply, ChatRole } from '@/types/chatbot.types'

export interface ChatTurn {
  role: ChatRole
  content: string
}

export const chatbotApi = {
  /**
   * Sends the full conversation history (oldest first, last turn from the
   * user) and returns the assistant reply. The backend prepends its own
   * system prompt and relays to DeepSeek via OpenRouter.
   */
  chat: (messages: ChatTurn[]) =>
    api.post<ApiResponse<ChatReply>>('/chatbot/chat', { messages }),

  /**
   * Fast side call: LLM-authored step titles for the loading stepper, run in
   * parallel with `chat` while the main answer generates.
   */
  plan: (messages: ChatTurn[]) =>
    api.post<ApiResponse<{ steps: string[] }>>('/chatbot/plan', { messages }),
}
