import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export type StatTone = 'employability' | 'potential' | 'development'

const TONE_STYLES: Record<StatTone, string> = {
  employability: 'text-orange-500',
  potential: 'text-emerald-500',
  development: 'text-rose-500',
}

interface StatHighlightProps {
  label: string
  value: string
  caption?: string
  tone: StatTone
  badge?: string
}

/** The big coloured KPI cards at the top of the Skills dashboard. */
export function StatHighlight({
  label,
  value,
  caption,
  tone,
  badge,
}: StatHighlightProps) {
  return (
    <Card>
      <CardContent className="space-y-1 py-5">
        <div className="flex items-start justify-between">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          {badge && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              {badge}
            </span>
          )}
        </div>
        <p className={cn('text-3xl font-bold tracking-tight', TONE_STYLES[tone])}>
          {value}
        </p>
        {caption && <p className="text-xs text-muted-foreground">{caption}</p>}
      </CardContent>
    </Card>
  )
}
