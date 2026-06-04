'use client'

import { cn } from '@/lib/utils'

interface Option<T extends string> {
  value: T
  label: string
}

interface SingleProps<T extends string> {
  options: Option<T>[]
  value: T | undefined
  onChange: (value: T) => void
  multiple?: false
  columns?: 1 | 2 | 3
}

interface MultiProps<T extends string> {
  options: Option<T>[]
  value: T[]
  onChange: (value: T[]) => void
  multiple: true
  columns?: 1 | 2 | 3
}

const COLUMN_CLASS: Record<1 | 2 | 3, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
}

/**
 * Chip-style selector reused across the onboarding steps. Multi-select preserves
 * click order, so soft-skill ranking falls out of selection order for free.
 */
export function OptionToggleGroup<T extends string>(
  props: SingleProps<T> | MultiProps<T>,
) {
  const { options, columns = 2 } = props
  const isSelected = (value: T): boolean =>
    props.multiple ? props.value.includes(value) : props.value === value

  const toggle = (value: T): void => {
    if (props.multiple) {
      props.onChange(
        props.value.includes(value)
          ? props.value.filter((item) => item !== value)
          : [...props.value, value],
      )
    } else {
      props.onChange(value)
    }
  }

  return (
    <div className={cn('grid gap-2', COLUMN_CLASS[columns])}>
      {options.map((option) => {
        const selected = isSelected(option.value)
        const rank =
          props.multiple && selected ? props.value.indexOf(option.value) + 1 : null
        return (
          <button
            type="button"
            key={option.value}
            onClick={() => toggle(option.value)}
            aria-pressed={selected}
            className={cn(
              'flex items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
              selected
                ? 'border-primary bg-primary/10 text-foreground'
                : 'border-border hover:bg-muted',
            )}
          >
            <span>{option.label}</span>
            {rank !== null && (
              <span className="ml-2 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {rank}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
