import { ArrowDown, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const HIGH_THRESHOLD = 75
const LOW_NEUROTICISM = 50

interface TraitChipProps {
  label: string
  value: number
  variant?: 'ocean' | 'riasec'
  /** Neuroticism reads inverted (low = good) → green tone. */
  isNeuroticism?: boolean
}

/** Coloured score pill: strengths blue↑, neutral gray, low-neuroticism green↓. */
export function TraitChip({
  label,
  value,
  variant = 'ocean',
  isNeuroticism,
}: TraitChipProps) {
  const rounded = Math.round(value)
  let tone = 'bg-gray-100 text-gray-500'
  let arrow: 'up' | 'down' | null = null

  if (variant === 'riasec') {
    tone = 'bg-violet-50 text-violet-600'
  } else if (isNeuroticism) {
    tone = 'bg-emerald-50 text-emerald-600'
    arrow = value < LOW_NEUROTICISM ? 'down' : 'up'
  } else if (value >= HIGH_THRESHOLD) {
    tone = 'bg-blue-50 text-blue-600'
    arrow = 'up'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
        tone,
      )}
    >
      {label} {rounded}
      {arrow === 'up' && <ArrowUp className="size-3" />}
      {arrow === 'down' && <ArrowDown className="size-3" />}
    </span>
  )
}
