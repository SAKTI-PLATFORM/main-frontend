'use client'

import { Plus, X } from 'lucide-react'
import { MAX_SOFT_SKILLS } from '@/features/onboarding/constants'
import { cn } from '@/lib/utils'

export interface SoftSkillOption {
  value: string
  label: string
}

interface RankedSoftSkillsProps {
  options: SoftSkillOption[]
  value: string[]
  onChange: (values: string[]) => void
  max?: number
}

/** Pick & rank the best N soft skills: numbered slots + a pool of `+` chips. */
export function RankedSoftSkills({
  options,
  value,
  onChange,
  max = MAX_SOFT_SKILLS,
}: RankedSoftSkillsProps) {
  const labelFor = (v: string) => options.find((o) => o.value === v)?.label ?? v
  const isFull = value.length >= max

  const add = (skill: string) => {
    if (!value.includes(skill) && !isFull) onChange([...value, skill])
  }
  const remove = (skill: string) => onChange(value.filter((v) => v !== skill))

  const pool = options.filter((o) => !value.includes(o.value))

  return (
    <div className="space-y-4">
      {/* Ranked slots */}
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: max }).map((_, index) => {
          const skill = value[index]
          return (
            <div
              key={index}
              className={cn(
                'relative flex h-16 items-center justify-center rounded-lg border text-center',
                skill
                  ? 'border-primary/40 bg-primary/5'
                  : 'border-dashed border-border bg-muted/40',
              )}
            >
              <span className="absolute left-1.5 top-1 text-xs font-bold text-muted-foreground/60">
                {index + 1}
              </span>
              {skill ? (
                <button
                  type="button"
                  onClick={() => remove(skill)}
                  className="group flex flex-col items-center gap-0.5 px-1"
                >
                  <span className="text-xs font-medium leading-tight text-primary">
                    {labelFor(skill)}
                  </span>
                  <X className="size-3 text-muted-foreground group-hover:text-red-500" />
                </button>
              ) : (
                <span className="text-2xl font-bold text-muted-foreground/30">
                  {index + 1}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Pool */}
      <div className="flex flex-wrap gap-2">
        {pool.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={isFull}
            onClick={() => add(option.value)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg border border-primary/40 px-3 py-1.5 text-xs font-medium text-primary transition-colors',
              isFull
                ? 'cursor-not-allowed opacity-40'
                : 'hover:bg-primary/5',
            )}
          >
            {option.label}
            <Plus className="size-3.5" />
          </button>
        ))}
        {pool.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Semua soft skill sudah dipilih.
          </p>
        )}
      </div>
    </div>
  )
}
