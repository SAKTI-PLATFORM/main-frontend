import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { SkillGap } from '@/types/seeker.types'

const PRIORITY_STYLES: Record<SkillGap['priority'], string> = {
  high: 'bg-rose-100 text-rose-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-slate-100 text-slate-600',
}

interface SkillGapListProps {
  gaps: SkillGap[]
}

export function SkillGapList({ gaps }: SkillGapListProps) {
  if (gaps.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Tidak ada gap signifikan — skill kamu sudah selaras dengan target role.
      </p>
    )
  }

  return (
    <ul className="space-y-4">
      {gaps.map((gap) => {
        const progress = gap.targetHours
          ? Math.round((gap.currentHours / gap.targetHours) * 100)
          : 0
        return (
          <li key={gap.skill} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium capitalize">{gap.skill}</span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase',
                  PRIORITY_STYLES[gap.priority],
                )}
              >
                {gap.priority}
              </span>
            </div>
            <Progress value={progress} />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {gap.currentHours} / {gap.targetHours} jam
              </span>
              <span>Gap: {gap.gapHours} jam</span>
            </div>
            {gap.course && (
              <p className="text-xs text-primary">
                ↳ {gap.course.title} — {gap.course.provider}
                {gap.course.cost === 'free' ? ' (gratis)' : ''}
              </p>
            )}
          </li>
        )
      })}
    </ul>
  )
}
