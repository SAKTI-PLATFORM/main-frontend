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
                ? 'border-[#4138D8] bg-[#4138D8] text-white hover:bg-[#3315B8]'
                : 'border-[#E4E3F0] text-[#6E6E86] hover:border-[#CFC8FF] hover:bg-[#F4F3FB] hover:text-[#4138D8]',
            )}
          >
            {point}
          </Button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-[#9A9AAB]">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  )
}
