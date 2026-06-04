'use client'

import { TOOLS_EXPERIENCE_OPTIONS } from '@/features/onboarding/constants'
import type { ToolsExperience } from '@/types/seeker.types'
import { cn } from '@/lib/utils'

interface ExperienceSliderProps {
  value?: ToolsExperience
  onChange: (value: ToolsExperience) => void
}

/** Segmented slider with the 6 experience stops; click a node to select. */
export function ExperienceSlider({ value, onChange }: ExperienceSliderProps) {
  const stops = TOOLS_EXPERIENCE_OPTIONS
  const activeIndex = stops.findIndex((s) => s.value === value)
  const lastIndex = stops.length - 1
  const fillPercent = activeIndex >= 0 ? (activeIndex / lastIndex) * 100 : 0

  return (
    <div className="px-1 pt-2">
      <div className="relative flex items-center">
        {/* base track */}
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-muted" />
        {/* filled track */}
        <div
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary transition-all"
          style={{ width: `${fillPercent}%` }}
        />
        {/* nodes */}
        <div className="relative flex w-full justify-between">
          {stops.map((stop, index) => {
            const active = index === activeIndex
            const reached = activeIndex >= 0 && index <= activeIndex
            return (
              <button
                key={stop.value}
                type="button"
                aria-label={stop.label}
                onClick={() => onChange(stop.value)}
                className={cn(
                  'flex size-4 items-center justify-center rounded-full border-2 bg-white transition-colors',
                  active
                    ? 'size-5 border-primary ring-4 ring-primary/20'
                    : reached
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground/30',
                )}
              />
            )
          })}
        </div>
      </div>

      {/* labels */}
      <div className="mt-2 flex justify-between">
        {stops.map((stop) => (
          <span
            key={stop.value}
            className={cn(
              'w-12 text-center text-[10px] leading-tight',
              stop.value === value
                ? 'font-semibold text-primary'
                : 'text-muted-foreground',
            )}
          >
            {stop.label}
          </span>
        ))}
      </div>
    </div>
  )
}
