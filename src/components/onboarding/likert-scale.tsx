'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

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
          <Button
            type="button"
            key={point}
            onClick={() => onChange(point)}
            aria-pressed={value === point}
            variant={value === point ? 'default' : 'outline'}
            size="icon-lg"
            className={cn(
              'rounded-full text-sm font-medium',
              value === point
                ? 'border-primary'
                : 'hover:bg-muted',
            )}
          >
            {point}
          </Button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  )
}
