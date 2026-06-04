'use client'

import { Check, ChevronDown, X } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  /** Show an "Others" row that reveals a free-text input for custom entries. */
  allowOther?: boolean
}

/** Inline multi-select with chips in the trigger and an expandable checklist. */
export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Pilih satu atau lebih',
  allowOther = true,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [showOther, setShowOther] = useState(false)
  const [otherText, setOtherText] = useState('')

  const labelFor = (value: string) =>
    options.find((o) => o.value === value)?.label ?? value

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    )
  }

  const addOther = () => {
    const value = otherText.trim().toLowerCase()
    if (value && !selected.includes(value)) {
      onChange([...selected, value])
    }
    setOtherText('')
  }

  return (
    <div className="space-y-2">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-3 py-2 text-left outline-none focus-visible:border-ring"
      >
        <span className="flex flex-1 flex-wrap gap-1.5">
          {selected.length === 0 ? (
            <span className="text-sm text-muted-foreground">{placeholder}</span>
          ) : (
            selected.map((value) => (
              <span
                key={value}
                className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary"
              >
                {labelFor(value)}
                <X
                  className="size-3 cursor-pointer"
                  onClick={(event) => {
                    event.stopPropagation()
                    toggle(value)
                  }}
                />
              </span>
            ))
          )}
        </span>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-muted-foreground transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {/* Checklist */}
      {open && (
        <div className="overflow-hidden rounded-lg border border-border">
          {options.map((option) => {
            const checked = selected.includes(option.value)
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggle(option.value)}
                className={cn(
                  'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted',
                  checked && 'bg-primary/5',
                )}
              >
                <span
                  className={cn(
                    'flex size-4 items-center justify-center rounded-full border',
                    checked
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground/40',
                  )}
                >
                  {checked && <Check className="size-3" />}
                </span>
                {option.label}
              </button>
            )
          })}

          {allowOther && (
            <button
              type="button"
              onClick={() => setShowOther((v) => !v)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted"
            >
              <span className="flex size-4 items-center justify-center rounded-full border border-muted-foreground/40" />
              Others
            </button>
          )}

          {allowOther && showOther && (
            <div className="flex items-center gap-2 border-t border-border p-2">
              <Input
                value={otherText}
                placeholder="Ketik lalu Enter…"
                onChange={(event) => setOtherText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    addOther()
                  }
                }}
              />
              <button
                type="button"
                onClick={addOther}
                className="shrink-0 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
              >
                Tambah
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
