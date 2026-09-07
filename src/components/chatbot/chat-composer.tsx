'use client'

import { Send } from 'lucide-react'
import Link from 'next/link'
import { useImperativeHandle, useRef, useState } from 'react'

export interface ChatComposerHandle {
  focus: () => void
}

interface ChatComposerProps {
  ref?: React.Ref<ChatComposerHandle>
  onSend: (value: string) => void
  disabled: boolean
  error: string | null
}

export function ChatComposer({ ref, onSend, disabled, error }: ChatComposerProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
  }))

  function resize() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  function submit() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    requestAnimationFrame(resize)
  }

  return (
    <div className="shrink-0 px-4 pb-4 pt-1 sm:px-8">
      <div className="mx-auto max-w-[820px]">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            submit()
          }}
          className="flex items-end gap-2.5 rounded-2xl border border-[#E4E4EF] bg-white px-4 py-2.5 shadow-[0_1px_2px_rgba(20,21,29,0.04)] transition-colors focus-within:border-[#B8AEF5]"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              resize()
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                submit()
              }
            }}
            placeholder="Tanyakan tentang karier, skills, atau rekomendasi pekerjaanmu..."
            className="max-h-40 flex-1 resize-none bg-transparent py-1.5 text-[14px] leading-6 text-[#33333E] outline-none [scrollbar-width:none] placeholder:text-[#A9A9B8] [&::-webkit-scrollbar]:hidden"
          />
          <button
            type="submit"
            disabled={disabled || !value.trim()}
            aria-label="Kirim"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#5B3DF5] text-white transition-opacity hover:bg-[#4E2FE8] disabled:opacity-40"
          >
            <Send className="size-4" />
          </button>
        </form>

        {error && <p className="mt-2 text-[12px] text-rose-500">{error}</p>}

        <p className="mt-2.5 text-[12px] leading-5 text-[#A9A9B8]">
          SAKTI AI dapat membuat kesalahan. Selalu verifikasi rekomendasi skill
          dan pekerjaan sebelum mengambil keputusan karier.{' '}
          <Link href="/landing" className="underline hover:text-[#8E8E9E]">
            Lihat kebijakan privasi →
          </Link>
        </p>
      </div>
    </div>
  )
}
