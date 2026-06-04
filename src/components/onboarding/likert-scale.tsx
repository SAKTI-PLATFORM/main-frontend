'use client'

import { cn } from '@/lib/utils'

interface LikertScaleProps {
  value: number | undefined
  onChange: (value: number) => void
  minLabel: string
  maxLabel: string
  points?: number
}

export function LikertScale({ value, onChange, minLabel, maxLabel, points = 7 }: LikertScaleProps) {
  const scale = Array.from({ length: points }, (_, i) => i + 1)

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-1.5">
        {scale.map((point) => (
          <button
            type="button"
            key={point}
            onClick={() => onChange(point)}
            aria-pressed={value === point}
            className={cn(
              'size-9 rounded-full border text-sm font-medium transition-colors',
              value === point
                ? 'border-primary bg-primary text-white'
                : 'border-border hover:bg-muted',
            )}
          >
            {point}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  )
}
