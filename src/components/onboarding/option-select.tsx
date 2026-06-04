'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface SelectOption<T extends string> {
  value: T
  label: string
}

interface OptionSelectProps<T extends string> {
  options: SelectOption<T>[]
  value?: T
  onChange: (value: T | undefined) => void
  placeholder?: string
  className?: string
}

/** Single-choice dropdown shared by the onboarding foundation fields. */
export function OptionSelect<T extends string>({
  options,
  value,
  onChange,
  placeholder = 'Pilih salah satu',
  className,
}: OptionSelectProps<T>) {
  const items = Object.fromEntries(options.map((o) => [o.value, o.label]))

  return (
    <Select
      items={items}
      value={value ?? null}
      onValueChange={(next) => onChange((next as T | null) ?? undefined)}
    >
      <SelectTrigger className={cn('w-full justify-between', className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
