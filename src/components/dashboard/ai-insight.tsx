import { FileChartColumn } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { AiInsight as AiInsightData } from '@/types/seeker.types'

interface AiInsightProps {
  insight: AiInsightData
}

export function AiInsight({ insight }: AiInsightProps) {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="flex gap-3 py-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
          <FileChartColumn className="size-4" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-primary">AI Insight</p>
            {insight.marketReady && (
              <Badge className="bg-emerald-100 text-[10px] text-emerald-700 hover:bg-emerald-100">
                Market Ready
              </Badge>
            )}
          </div>
          <p className="text-sm leading-relaxed text-foreground/80">
            {insight.narrative}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
